const BASE_URL = 'https://joinposter.com/api'

export function getMenuCategories(token: string) {
	return fetch(`${BASE_URL}/menu.getCategories?token=${token}`).then((res) =>
		res.json(),
	)
}

export function getMenuProducts(
	token: string,
	_opts: { type: 'products' | 'categories' } = { type: 'products' },
) {
	return fetch(`${BASE_URL}/menu.getProducts?token=${token}`).then((res) =>
		res.json(),
	)
}

export function getProduct(token: string, productId: string) {
	return fetch(
		`${BASE_URL}/menu.getProduct?token=${token}&product_id=${productId}`,
	).then((res) => res.json())
}
