import { mutationOptions } from '@tanstack/react-query'

import type { CreateOrder } from '@common/schemas'

import { api } from '@/lib/services/api-service'
import { formatPosterPrice } from '@/lib/utils/price'

import type { Order } from '@/lib/stores/order-store'

export type CreateOrderRequest = {
	client_address?: string
	client_name?: string
	comment?: string
	payment: {
		sum: number
		type: 'card' | 'cash' | 'online'
	}
	phone?: string
	products: {
		count: number
		modifications?: {
			count: number
			modification_id: string
		}[]
		price?: number
		product_id: string
	}[]
	service_mode?: '1' | '2' | '3' // 1 = table service, 2 = takeaway, 3 = delivery
}

export type CreateOrderResponse = {
	order: {
		created_at: string
		order_id: string
		status: string
		sum: number
		transaction_id: string
	}
	success: boolean
}

export const createOrderMutationOptions = mutationOptions({
	mutationFn: (data: CreateOrder) => api.orders.create(data),
})

export type FormattedCreateOrderResponse = Omit<
	CreateOrderResponse,
	'order'
> & {
	order: CreateOrderResponse['order'] & { sumFormatted: string }
}

export function formatCreateOrderResponse(
	response: CreateOrderResponse,
): FormattedCreateOrderResponse {
	return {
		...response,
		order: {
			...response.order,
			sumFormatted: formatPosterPrice(response.order.sum),
		},
	}
}

// Helper function to convert our internal Order format to API format
export function convertOrderToApiFormat(order: Order): CreateOrderRequest {
	return {
		comment: order.customerNote,
		payment: {
			sum: 0, // Server will calculate the total
			type: 'cash',
		},
		products: order.products.map((item) => ({
			count: item.quantity,
			// Price will be calculated by the server based on product_id
			modifications: item.modifications?.map((module_) => ({
				count: 1,
				modification_id: module_.id,
			})),
			product_id: item.id,
		})),
		service_mode: '2', // takeaway by default
	}
}
