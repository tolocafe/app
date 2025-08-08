import type {
	ClientData,
	PosterApiResponse,
	PosterCategory,
	PosterProduct,
} from '@/lib/api'
import type { CreateOrderResponse } from '@/lib/queries/order'

import { privateClient, publicClient } from './http-client'

/**
 * API service object with methods for making HTTP requests
 * Uses public client for auth/menu endpoints, private client for user-specific endpoints
 */
export const api = {
	// Auth endpoints (public - no token required initially)
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

	// Client endpoints (private - requires authentication)
	client: {
		update: (clientId: string, data: Record<string, unknown>) =>
			privateClient
				.put<ClientData>(`clients/${clientId}`, {
					json: data,
				})
				.json(),
	},

	get: (endpoint: string) => privateClient.get(endpoint).json(),

	// Menu endpoints (public - no authentication required)
	menu: {
		getCategories: () =>
			publicClient
				.get<PosterApiResponse<PosterCategory[]>>('menu/categories')
				.json(),

		getProduct: (productId: string) =>
			publicClient
				.get<PosterApiResponse<PosterProduct>>(`menu/products/${productId}`)
				.json(),

		getProducts: () =>
			publicClient
				.get<PosterApiResponse<PosterProduct[]>>('menu/products')
				.json(),
	},

	// Order endpoints (private - requires authentication)
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
