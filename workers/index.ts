import * as Sentry from '@sentry/cloudflare'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'

import { defaultJsonHeaders } from './utils/headers'
import { authenticate, signJwt } from './utils/jwt'
import { getMenuCategories, getMenuProducts, getProduct } from './utils/menu'
import { generateOtp, storeOtp, verifyOtp } from './utils/otp'
import {
	createPosterClient,
	createPosterOrder,
	getPosterClientById,
	getPosterClientByPhone,
	sendSms,
	updatePosterClient,
} from './utils/poster'
import {
	createOrderSchema,
	requestOtpSchema,
	verifyOtpSchema,
} from './utils/schemas'

const app = new Hono<{
	Bindings: {
		JWT_SECRET: string
		KV_SESSIONS: KVNamespace
		OTP_CODES: KVNamespace
		POSTER_TOKEN: string
	}
}>().basePath('/api')

app.use(
	'*',
	cors({
		credentials: true,
		origin: (origin) => origin,
	}),
)

app
	.get('/', (context) =>
		context.json(
			{ message: 'Hello Cloudflare Workers!' },
			200,
			defaultJsonHeaders,
		),
	)
	.get('/menu/categories', async (context) => {
		const categories = await getMenuCategories(context.env.POSTER_TOKEN)

		return context.json(categories, 200, defaultJsonHeaders)
	})
	.get('/menu/products', async (context) => {
		const categories = await getMenuProducts(context.env.POSTER_TOKEN, {
			type: 'products',
		})

		return context.json(categories, 200, defaultJsonHeaders)
	})
	.get('/menu/products/:id', async (context) => {
		const productId = context.req.param('id')

		if (!productId) {
			return context.json(
				{ error: 'Product ID is required' },
				400,
				defaultJsonHeaders,
			)
		}

		try {
			const product = await getProduct(context.env.POSTER_TOKEN, productId)
			return context.json(product, 200, defaultJsonHeaders)
		} catch {
			return context.json(
				{ error: 'Failed to fetch product details' },
				500,
				defaultJsonHeaders,
			)
		}
	})

	.post('/auth/request-otp', async (c) => {
		const { email, name, phone } = requestOtpSchema.parse(await c.req.json())

		const existingClient = await getPosterClientByPhone(
			c.env.POSTER_TOKEN,
			phone,
		)

		if (!existingClient) {
			await createPosterClient(c.env.POSTER_TOKEN, {
				client_groups_id_client: 1,
				client_name: name ?? 'anon',
				email,
				phone,
			})
		}

		const code = generateOtp()

		await Promise.all([
			storeOtp(c.env.OTP_CODES, phone, code),
			sendSms(c.env.POSTER_TOKEN, phone, `Your verification code: ${code}`),
		])

		return c.json({ success: true })
	})
	.post('/auth/verify-otp', async (c) => {
		const { code, phone, sessionName } = verifyOtpSchema.parse(
			await c.req.json(),
		)

		await verifyOtp(c.env.OTP_CODES, phone, code)

		const client = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)

		if (!client) throw new HTTPException(404, { message: 'Client not found' })

		const { client_id: clientId } = client

		const [token, sessionsRaw] = await Promise.all([
			signJwt(clientId, c.env.JWT_SECRET),
			c.env.KV_SESSIONS.get(clientId),
		])

		type SessionRecord = { createdAt: number; name: string; token: string }
		const isSessionRecord = (value: unknown): value is SessionRecord =>
			typeof value === 'object' &&
			value !== null &&
			'createdAt' in value &&
			'name' in value &&
			'token' in value

		const parsedSessionsUnknown: unknown = sessionsRaw
			? JSON.parse(sessionsRaw)
			: []
		const sessions: SessionRecord[] = Array.isArray(parsedSessionsUnknown)
			? parsedSessionsUnknown.filter((record) => isSessionRecord(record))
			: []

		await Promise.all([
			c.env.KV_SESSIONS.put(
				clientId,
				JSON.stringify([
					...sessions,
					{ createdAt: Date.now(), name: sessionName, token },
				]),
			),
			updatePosterClient(c.env.POSTER_TOKEN, clientId, {
				client_groups_id_client: 3,
			}),
		])

		// For web: set HttpOnly cookie. For native: client uses token from body
		const isWeb = (c.req.header('User-Agent') ?? '').includes('Mozilla')

		const responseBody = { client, token }

		if (isWeb) {
			setCookie(c, 'tolo_session', token, {
				httpOnly: true,
				// 30 days
				maxAge: 60 * 60 * 24 * 30,
				path: '/',
				sameSite: 'Lax',
				secure: true,
			})
		}

		return c.json(responseBody)
	})
	.get('/auth/self', async (c) => {
		const clientId = await authenticate(c, c.env.JWT_SECRET)
		const client = await getPosterClientById(c.env.POSTER_TOKEN, clientId)
		if (!client) throw new HTTPException(404, { message: 'Client not found' })
		return c.json(client)
	})
	.get('/auth/self/sessions', async (c) => {
		const clientId = await authenticate(c, c.env.JWT_SECRET)
		const key = clientId
		const sessionsRaw = await c.env.KV_SESSIONS.get(key)

		type SessionRecord = { createdAt: number; name: string; token: string }
		const isSessionRecord = (value: unknown): value is SessionRecord =>
			typeof value === 'object' &&
			value !== null &&
			'createdAt' in value &&
			'name' in value &&
			'token' in value

		const parsedUnknown: unknown = sessionsRaw ? JSON.parse(sessionsRaw) : []
		const sessions: SessionRecord[] = Array.isArray(parsedUnknown)
			? parsedUnknown.filter((record) => isSessionRecord(record))
			: []
		return c.json(sessions)
	})

	.put('/clients/:id', async (c) => {
		const clientIdFromToken = await authenticate(c, c.env.JWT_SECRET)
		const id = c.req.param('id')

		if (!id || id !== clientIdFromToken)
			throw new HTTPException(403, { message: 'Forbidden' })

		const bodyUnknown = (await c.req.json()) as unknown
		const body =
			typeof bodyUnknown === 'object' &&
			bodyUnknown !== null &&
			!Array.isArray(bodyUnknown)
				? (bodyUnknown as Record<string, unknown>)
				: {}
		const client = await updatePosterClient(c.env.POSTER_TOKEN, id, body)
		return c.json(client)
	})
	.post('/orders', async (c) => {
		const clientId = await authenticate(c, c.env.JWT_SECRET)

		const bodyUnknown = (await c.req.json()) as unknown
		if (
			typeof bodyUnknown !== 'object' ||
			bodyUnknown === null ||
			Array.isArray(bodyUnknown)
		) {
			throw new HTTPException(400, { message: 'Invalid body' })
		}

		const validatedData = createOrderSchema.parse({
			...(bodyUnknown as Record<string, unknown>),
			client_id: clientId,
		})

		try {
			const order = await createPosterOrder(
				c.env.POSTER_TOKEN,
				validatedData,
				clientId,
			)
			return c.json({ order, success: true }, 201, defaultJsonHeaders)
		} catch (error) {
			throw new HTTPException(500, {
				message:
					error instanceof Error ? error.message : 'Failed to create order',
			})
		}
	})

app.onError((error, c) => {
	if (error instanceof HTTPException) {
		return error.getResponse()
	}

	return c.json({ error: 'Internal Server Error' }, 500)
})

export default Sentry.withSentry(
	(environment: { SENTRY_DSN: string }) => ({
		dsn: environment.SENTRY_DSN,
		enableLogs: true,
		sendDefaultPii: true,
		tracesSampleRate: 0.5,
	}),
	app,
)
