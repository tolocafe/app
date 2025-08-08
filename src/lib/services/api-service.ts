import type { ClientData, PosterCategory, PosterProduct } from '@/lib/api'
import type { CreateOrderResponse } from '@/lib/queries/order'

import { privateClient, publicClient } from './http-client'

/**
 * API service object with methods for making HTTP requests
 * Uses public client for auth/menu endpoints, private client for user-specific endpoints
 */
export const api = {
	auth: {
		requestOtp: (phone: string, name?: string, email?: string) =>
			publicClient
				.post<{ success: true }>('auth/request-otp', {
					json: { email, name, phone },
				})
				.json(),
		self: () => privateClient.get<ClientData>('auth/self').json(),
		sessions: () =>
			privateClient
				.get<
					{ createdAt: number; name: string; token: string }[]
				>('auth/self/sessions')
				.json(),
		verifyOtp: (phone: string, code: string, sessionName: string) =>
			publicClient
				.post<{ client: ClientData; token: string }>('auth/verify-otp', {
					json: { code, phone, sessionName },
				})
				.json(),
	},

	client: {
		update: (clientId: string, data: Record<string, unknown>) =>
			privateClient
				.put<ClientData>(`clients/${clientId}`, {
					json: data,
				})
				.json(),
	},

	get: (endpoint: string) => privateClient.get(endpoint).json(),

	menu: {
		getCategories: () =>
			publicClient.get<PosterCategory[]>('menu/categories').json(),
		getProduct: (productId: string) =>
			publicClient.get<PosterProduct>(`menu/products/${productId}`).json(),
		getProducts: () =>
			publicClient.get<PosterProduct[]>('menu/products').json(),
	},

	orders: {
		create: (orderData: unknown) =>
			privateClient
				.post<CreateOrderResponse>('orders', {
					json: orderData,
				})
				.json(),
	},

	// Generic methods for other endpoints
	post: (endpoint: string, data: unknown) =>
		privateClient.post(endpoint, { json: data }).json(),
}
