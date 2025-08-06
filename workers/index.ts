import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { SignJWT, jwtVerify } from 'jose'
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
const encoder = new TextEncoder()
function secretKey(secret: string): Uint8Array {
  return encoder.encode(secret)
}
async function signJwt(clientId: string, secret: string): Promise<string> {
  return new SignJWT({ sub: clientId })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    //.setExpirationTime('7d')
    .sign(secretKey(secret))
}
async function verifyJwt(token: string, secret: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(secret))
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}
// Poster helpers --------------------------------------------------------------
async function createPosterClient(token: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/clients.createClient?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (json?.response?.client) return json.response.client
  throw new Error('Failed to create client')
}
async function getPosterClientByPhone(token: string, phone: string) {
  const res = await fetch(`${BASE_URL}/clients.getClients?token=${token}&phone=${encodeURIComponent(phone)}`)
  const json = await res.json()
  if (json?.response?.clients?.length) return json.response.clients[0]
  return null
}
async function updatePosterClient(token: string, id: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/clients.updateClient?token=${token}&client_id=${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return (await res.json())?.response?.client
}
async function getPosterClientById(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/clients.getClients?token=${token}&client_id=${id}`)
  const json = await res.json()
  if (json?.response?.clients?.length) return json.response.clients[0]
  return null
}
// OTP helpers --------------------------------------------------------------
function generateOtp(length = 6): string {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((v) => (v % 10).toString())
    .join('')
}
async function storeOtp(kv: KVNamespace, phone: string, code: string, ttl = 300) {
  await kv.put(`otp:${phone}`, code, { expirationTtl: ttl })
}
async function verifyOtp(kv: KVNamespace, phone: string, code: string): Promise<boolean> {
  const stored = await kv.get(`otp:${phone}`)
  return stored === code
}
// -----------------------------------------------------------------------------

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
       // phone and code validated by zod
       //
       //
       // ensure client exists
       let client = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)
       if (!client) {
         client = await createPosterClient(c.env.POSTER_TOKEN, { phone, name, email })
       }
       const code = generateOtp()
       await storeOtp(c.env.OTP_CODES, phone, code)
       // TODO: integrate Poster SMS/e-mail send or other provider; placeholder logging
       console.log('OTP code', code, 'sent to', phone)
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
      const auth = c.req.header('Authorization') || ''
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
      const clientId = token ? await verifyJwt(token, c.env.JWT_SECRET) : null
      if (!clientId) {
        return c.json({ error: 'Unauthorized' }, 401, defaultJsonHeaders)
      }
      const client = await getPosterClientById(c.env.POSTER_TOKEN, clientId)
      if (!client) {
        return c.json({ error: 'Client not found' }, 404, defaultJsonHeaders)
      }
      return c.json({ client }, 200, defaultJsonHeaders)
    })
	.get('/auth/sessions', async (c) => {
      const auth = c.req.header('Authorization') || ''
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
      const clientId = token ? await verifyJwt(token, c.env.JWT_SECRET) : null
      if (!clientId) {
        return c.json({ error: 'Unauthorized' }, 401, defaultJsonHeaders)
      }
      const key = `sessions:${clientId}`
      const sessionsRaw = await c.env.KV_SESSIONS.get(key)
      const sessions = sessionsRaw ? JSON.parse(sessionsRaw) : []
      return c.json({ sessions }, 200, defaultJsonHeaders)
    })
	// Optional client update ---------------------------------------------------
	.put('/clients/:id', async (c) => {
      const auth = c.req.header('Authorization') || ''
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
      const clientIdFromToken = token ? await verifyJwt(token, c.env.JWT_SECRET) : null
      if (!clientIdFromToken) {
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
