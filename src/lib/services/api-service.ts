import type {
	PosterApiResponse,
	PosterCategory,
	PosterProduct,
	ClientData,
} from '@/lib/api'
import { publicClient, privateClient } from './http-client'
import { CreateOrderResponse } from '@/lib/queries/order'

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
					json: { phone, name, email },
				})
				.json(),
		verifyOtp: (phone: string, code: string, sessionName: string) =>
			publicClient
				.post<{ token: string; client: ClientData }>('auth/verify-otp', {
					json: { phone, code, sessionName },
				})
				.json(),
		self: () => privateClient.get<ClientData>('auth/self').json(),
		sessions: () =>
			privateClient
				.get<
					{ token: string; name: string; createdAt: number }[]
				>('auth/self/sessions')
				.json(),
	},

	// Menu endpoints (public - no authentication required)
	menu: {
		getCategories: () =>
			publicClient
				.get<PosterApiResponse<PosterCategory[]>>('menu/categories')
				.json(),

		getProducts: () =>
			publicClient
				.get<PosterApiResponse<PosterProduct[]>>('menu/products')
				.json(),

		getProduct: (productId: string) =>
			publicClient
				.get<PosterApiResponse<PosterProduct>>(`menu/products/${productId}`)
				.json(),
	},

	// Client endpoints (private - requires authentication)
	client: {
		update: (clientId: string, data: Partial<ClientData>) =>
			privateClient
				.put<ClientData>(`clients/${clientId}`, {
					json: data,
				})
				.json(),
	},

	// Order endpoints (private - requires authentication)
	orders: {
		create: (orderData: any) =>
			privateClient
				.post<CreateOrderResponse>('orders', {
					json: orderData,
				})
				.json(),
	},

	// Generic methods for other endpoints
	post: (endpoint: string, data: any) =>
		privateClient.post(endpoint, { json: data }).json(),

	get: (endpoint: string) => privateClient.get(endpoint).json(),
}
