import type {
	PosterApiResponse,
	PosterCategory,
	PosterProduct,
} from '@common/api'

const BASE_URL = 'https://joinposter.com/api'

const defaultGetMenuProductsOptions = { type: 'products' } as const

export function getMenuCategories(token: string) {
	return fetch(`${BASE_URL}/menu.getCategories?token=${token}`)
		.then(
			(response) =>
				response.json() as Promise<PosterApiResponse<PosterCategory[]>>,
		)
		.then((data) => data.response)
}

export function getMenuProducts(
	token: string,
	_options: { type: 'categories' | 'products' } = defaultGetMenuProductsOptions,
) {
	return fetch(`${BASE_URL}/menu.getProducts?token=${token}`)
		.then(
			(response) =>
				response.json() as Promise<PosterApiResponse<PosterProduct[]>>,
		)
		.then((data) => data.response)
}

export function getProduct(token: string, productId: string) {
	return fetch(
		`${BASE_URL}/menu.getProduct?token=${token}&product_id=${productId}`,
	)
		.then(
			(response) =>
				response.json() as Promise<PosterApiResponse<PosterProduct>>,
		)
		.then((data) => data.response)
}
