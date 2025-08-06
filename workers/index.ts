import { Hono } from 'hono'
import { cors } from 'hono/cors'

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

const app = new Hono<{ Bindings: { POSTER_TOKEN: string } }>().basePath('/api')

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

export default app
