import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { signJwt, authenticate } from './utils/jwt'
import { generateOtp, storeOtp, verifyOtp } from './utils/otp'
import { createPosterClient, getPosterClientByPhone, getPosterClientById, updatePosterClient, sendSms } from './utils/poster'
import { requestOtpSchema, verifyOtpSchema } from './utils/schemas'

const BASE_URL = 'https://joinposter.com/api'

function getMenuCategories(token: string) {
	return fetch(`${BASE_URL}/menu.getCategories?token=${token}`).then((res) =>
		res.json(),
	)
}

function getMenuProducts(
	token: string,
	{ type = 'products' }: { type: 'products' | 'categories' },
) {
	return fetch(`${BASE_URL}/menu.getProducts?token=${token}`).then((res) =>
		res.json(),
	)
}

function getProduct(token: string, productId: string) {
	return fetch(
		`${BASE_URL}/menu.getProduct?token=${token}&product_id=${productId}`,
	).then((res) => res.json())
}

const defaultJsonHeaders = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Cache-Control': 'public, max-age=3600',
}

// -----------------------------------------------------------------------------
// Auth utilities --------------------------------------------------------------

// Poster helpers --------------------------------------------------------------

// OTP helpers --------------------------------------------------------------

const app = new Hono<{ Bindings: { POSTER_TOKEN: string; JWT_SECRET: string; OTP_CODES: KVNamespace; KV_SESSIONS: KVNamespace } }>().basePath('/api')

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
	.get('*', (context) => {
		return context.json({ message: 'Not found :(' }, 404, defaultJsonHeaders)
	})
	// Auth routes --------------------------------------------------------------
	.post('/auth/request-otp', async (c) => {
     try {
       const body = await c.req.json()
       const parse = requestOtpSchema.safeParse(body)
       if (!parse.success) {
         return c.json({ error: parse.error.flatten().fieldErrors }, 400, defaultJsonHeaders)
       }
       const { phone, name, email } = parse.data
       // ensure client exists
       let client = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)
       if (!client) {
         client = await createPosterClient(c.env.POSTER_TOKEN, { phone, name, email })
       }
       const code = generateOtp()
       await storeOtp(c.env.OTP_CODES, phone, code)
       try {
         await sendSms(c.env.POSTER_TOKEN, phone, `Your verification code: ${code}`)
       } catch {
         return c.json({ error: 'Failed to send SMS' }, 500, defaultJsonHeaders)
       }
       return c.json({ success: true }, 200, defaultJsonHeaders)
     } catch {
       return c.json({ error: 'Failed to issue OTP' }, 500, defaultJsonHeaders)
     }
   })
   .post('/auth/verify-otp', async (c) => {
     try {
       const body = await c.req.json()
       const parse = verifyOtpSchema.safeParse(body)
       if (!parse.success) {
         return c.json({ error: parse.error.flatten().fieldErrors }, 400, defaultJsonHeaders)
       }
       const { phone, code, sessionName } = parse.data
       // phone and code validated by zod
       const isValid = await verifyOtp(c.env.OTP_CODES, phone, code)
       if (!isValid) {
         return c.json({ error: 'Invalid or expired code' }, 401, defaultJsonHeaders)
       }
       const client = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)
       if (!client) {
         return c.json({ error: 'Client not found' }, 404, defaultJsonHeaders)
       }
       const clientId = String(client.client_id ?? client.id)
       const token = await signJwt(clientId, c.env.JWT_SECRET)
       // Store session
       const key = `sessions:${clientId}`
       const currentRaw = await c.env.KV_SESSIONS.get(key)
       const sessions = currentRaw ? (JSON.parse(currentRaw) as Array<any>) : []
       sessions.push({ token, name: sessionName, createdAt: Date.now() })
       await c.env.KV_SESSIONS.put(key, JSON.stringify(sessions))
       return c.json({ token, client }, 200, defaultJsonHeaders)
     } catch {
       return c.json({ error: 'OTP verification failed' }, 500, defaultJsonHeaders)
     }
   })
	.get('/auth/self', async (c) => {
      let clientId: string
      try {
        clientId = await authenticate(c.req.header('Authorization'), c.env.JWT_SECRET)
      } catch {
        return c.json({ error: 'Unauthorized' }, 401, defaultJsonHeaders)
      }
      const client = await getPosterClientById(c.env.POSTER_TOKEN, clientId)
      if (!client) {
        return c.json({ error: 'Client not found' }, 404, defaultJsonHeaders)
      }
      return c.json({ client }, 200, defaultJsonHeaders)
    })
	.get('/auth/sessions', async (c) => {
      let clientId: string
      try {
        clientId = await authenticate(c.req.header('Authorization'), c.env.JWT_SECRET)
      } catch {
        return c.json({ error: 'Unauthorized' }, 401, defaultJsonHeaders)
      }
      const key = `sessions:${clientId}`
      const sessionsRaw = await c.env.KV_SESSIONS.get(key)
      const sessions = sessionsRaw ? JSON.parse(sessionsRaw) : []
      return c.json({ sessions }, 200, defaultJsonHeaders)
    })
	// Optional client update ---------------------------------------------------
	.put('/clients/:id', async (c) => {
      let clientIdFromToken: string
      try {
        clientIdFromToken = await authenticate(c.req.header('Authorization'), c.env.JWT_SECRET)
      } catch {
        return c.json({ error: 'Unauthorized' }, 401, defaultJsonHeaders)
      }
      const id = c.req.param('id')
      if (!id || id !== clientIdFromToken) {
        return c.json({ error: 'Forbidden' }, 403, defaultJsonHeaders)
      }
      if (!id) return c.json({ error: 'Client ID required' }, 400, defaultJsonHeaders)
      try {
        const body = await c.req.json<Record<string, unknown>>()
        const client = await updatePosterClient(c.env.POSTER_TOKEN, id, body)
        return c.json(client, 200, defaultJsonHeaders)
      } catch {
        return c.json({ error: 'Failed to update client' }, 500, defaultJsonHeaders)
      }
    })

export default app
