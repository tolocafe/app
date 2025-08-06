import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { SignJWT } from 'jose'

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
async function sha256(data: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
function generateSalt(length = 16): string {
  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)
  return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('')
}
async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt()
  const hash = await sha256(salt + password)
  return `${salt}:${hash}`
}
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const newHash = await sha256(salt + password)
  return newHash === hash
}
function secretKey(secret: string): Uint8Array {
  return encoder.encode(secret)
}
async function signJwt(clientId: string, secret: string): Promise<string> {
  return new SignJWT({ sub: clientId })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey(secret))
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
// -----------------------------------------------------------------------------

const app = new Hono<{ Bindings: { POSTER_TOKEN: string; USER_CREDENTIALS: KVNamespace; JWT_SECRET: string } }>().basePath('/api')

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
	.post('/auth/signup', async (c) => {
		try {
      const { name, phone, email, password } = await c.req.json<Record<string, string>>()
      if (!phone || !password) {
        return c.json({ error: 'phone and password required' }, 400, defaultJsonHeaders)
      }
      const existing = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)
      if (existing) {
        return c.json({ error: 'Client already exists' }, 409, defaultJsonHeaders)
      }
      const client = await createPosterClient(c.env.POSTER_TOKEN, { phone, name, email })
      const hashed = await hashPassword(password)
      // Persist hashed password keyed by client id
      await c.env.USER_CREDENTIALS.put(String(client.client_id ?? client.id), hashed)
      const token = await signJwt(String(client.client_id ?? client.id), c.env.JWT_SECRET)
      return c.json({ token, client }, 201, defaultJsonHeaders)
    } catch (err) {
      return c.json({ error: 'Failed to sign up' }, 500, defaultJsonHeaders)
    }
	})
	.post('/auth/signin', async (c) => {
		try {
      const { phone, password } = await c.req.json<Record<string, string>>()
      if (!phone || !password) {
        return c.json({ error: 'phone and password required' }, 400, defaultJsonHeaders)
      }
      const client = await getPosterClientByPhone(c.env.POSTER_TOKEN, phone)
      if (!client) {
        return c.json({ error: 'Client not found' }, 404, defaultJsonHeaders)
      }
      const clientId = String(client.client_id ?? client.id)
      const stored = await c.env.USER_CREDENTIALS.get(clientId)
      if (!stored || !(await verifyPassword(password, stored))) {
        return c.json({ error: 'Invalid credentials' }, 401, defaultJsonHeaders)
      }
      const token = await signJwt(clientId, c.env.JWT_SECRET)
      return c.json({ token, client }, 200, defaultJsonHeaders)
    } catch (err) {
      return c.json({ error: 'Failed to sign in' }, 500, defaultJsonHeaders)
    }
	})
	// Optional client update ---------------------------------------------------
	.put('/clients/:id', async (c) => {
      const id = c.req.param('id')
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
