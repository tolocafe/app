import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { signJwt, authenticate } from './utils/jwt'
import { generateOtp, storeOtp, verifyOtp } from './utils/otp'
import {
	createPosterClient,
	getPosterClientByPhone,
	getPosterClientById,
	updatePosterClient,
	sendSms,
} from './utils/poster'
import { requestOtpSchema, verifyOtpSchema } from './utils/schemas'
import { defaultJsonHeaders } from './utils/headers'
import { getMenuCategories, getMenuProducts, getProduct } from './utils/menu'

const app = new Hono<{
	Bindings: {
		POSTER_TOKEN: string
		JWT_SECRET: string
		OTP_CODES: KVNamespace
		KV_SESSIONS: KVNamespace
	}
}>().basePath('/api')

app.use('*', cors())

app
	.get('/', (context) => {
		return context.json(
			{ message: 'Hello Cloudflare Workers!' },
			200,
			defaultJsonHeaders,
		)
	})
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
		const { phone, name, email } = requestOtpSchema.parse(await c.req.json())

		let client = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)

		if (!client) {
			client = await createPosterClient(c.env.POSTER_TOKEN, {
				phone,
				client_name: name || 'anon',
				email,
				client_groups_id_client: 1,
			})
		}

		const code = generateOtp()

		await Promise.all([
			storeOtp(c.env.OTP_CODES, phone, code),
			sendSms(
				c.env.POSTER_TOKEN,
				phone,
				`Your verification code: ${code}`,
			).catch((err) => console.error(err)),
			// TODO: remove catch
		])

		return c.json({ success: true })
	})
	.post('/auth/verify-otp', async (c) => {
		const { phone, code, sessionName } = verifyOtpSchema.parse(
			await c.req.json(),
		)

		await verifyOtp(c.env.OTP_CODES, phone, code)

		const client = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)

		if (!client) throw new HTTPException(404, { message: 'Client not found' })

		const clientId = String(client.client_id ?? client.id)

		const [token, sessionsRaw] = await Promise.all([
			signJwt(clientId, c.env.JWT_SECRET),
			c.env.KV_SESSIONS.get(clientId),
		])

		const sessions = sessionsRaw ? JSON.parse(sessionsRaw) : []

		await Promise.all([
			c.env.KV_SESSIONS.put(
				clientId,
				JSON.stringify([
					...sessions,
					{ token, name: sessionName, createdAt: Date.now() },
				]),
			),
			updatePosterClient(c.env.POSTER_TOKEN, clientId, {
				client_groups_id_client: 3,
			}),
		])

		return c.json({ token, client })
	})
	.get('/auth/self', async (c) => {
		const clientId = await authenticate(
			c.req.header('Authorization'),
			c.env.JWT_SECRET,
		)
		const client = await getPosterClientById(c.env.POSTER_TOKEN, clientId)
		if (!client) throw new HTTPException(404, { message: 'Client not found' })
		return c.json(client)
	})
	.get('/auth/self/sessions', async (c) => {
		const clientId = await authenticate(
			c.req.header('Authorization'),
			c.env.JWT_SECRET,
		)
		const key = clientId
		const sessionsRaw = await c.env.KV_SESSIONS.get(key)
		const sessions = sessionsRaw ? JSON.parse(sessionsRaw) : []
		return c.json(sessions)
	})

	.put('/clients/:id', async (c) => {
		const clientIdFromToken = await authenticate(
			c.req.header('Authorization'),
			c.env.JWT_SECRET,
		)
		const id = c.req.param('id')

		if (!id || id !== clientIdFromToken)
			throw new HTTPException(403, { message: 'Forbidden' })

		const body = await c.req.json<Record<string, unknown>>()
		const client = await updatePosterClient(c.env.POSTER_TOKEN, id, body)
		return c.json(client)
	})

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return err.getResponse()
	}
	console.error(err)
	return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
