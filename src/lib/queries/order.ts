import { mutationOptions } from '@tanstack/react-query'
import { api } from '@/lib/services/api-service'
import type { Order } from '@/lib/stores/order-store'

export interface CreateOrderRequest {
	products: {
		product_id: string
		count: number
		price?: number
		modifications?: {
			modification_id: string
			count: number
		}[]
	}[]
	comment?: string
	phone?: string
	client_name?: string
	client_address?: string
	service_mode?: '1' | '2' | '3' // 1 = table service, 2 = takeaway, 3 = delivery
	payment: {
		type: 'cash' | 'card' | 'online'
		sum: number
	}
}

export interface CreateOrderResponse {
	success: boolean
	order: {
		order_id: string
		transaction_id: string
		sum: number
		status: string
		created_at: string
	}
}

export const createOrderMutationOptions = mutationOptions({
	mutationFn: async (orderData: CreateOrderRequest) => {
		const response = await api.orders.create(orderData)
		return response
	},
})

// Helper function to convert our internal Order format to API format
export function convertOrderToApiFormat(order: Order): CreateOrderRequest {
	return {
		products: order.items.map((item) => ({
			product_id: item.productId,
			count: item.quantity,
			// Price will be calculated by the server based on product_id
			modifications: item.modifications?.map((mod) => ({
				modification_id: mod.id,
				count: 1,
			})),
		})),
		comment: order.customerNote,
		service_mode: '2', // takeaway by default
		payment: {
			type: 'cash',
			sum: 0, // Server will calculate the total
		},
	}
}
