import * as Sentry from '@sentry/react-native'
import { persist } from 'zustand/middleware'
import { create } from 'zustand/react'
import { useShallow } from 'zustand/react/shallow'

import { convertOrderToApiFormat } from '@/lib/queries/order'
import { api } from '@/lib/services/api-service'

export type Order = {
	apiOrderId?: string
	createdAt: Date
	customerNote?: string
	id: string
	items: OrderItem[]
	status: 'cancelled' | 'completed' | 'confirmed' | 'draft' | 'submitted'
	totalAmount: number
	updatedAt: Date
}

export type OrderItem = {
	modifications?: {
		id: string
		name: string
		price: number
	}[]
	productId: string
	quantity: number
}

type OrderStore = {
	addItem: (item: Pick<OrderItem, 'productId' | 'quantity'>) => void
	clearOrder: () => void

	// Actions
	createOrder: () => void
	currentOrder: null | Order
	getTotalAmount: () => number
	// Getters
	getTotalItems: () => number
	orders: Order[]
	removeItem: (productId: string) => void
	setCustomerNote: (note: string) => void

	submitOrder: () => Promise<unknown>
	updateItem: (productId: string, quantity: number) => void
}

export const useOrderStore = create<OrderStore>()(
	persist(
		(set, get) => ({
			addItem: (item: Pick<OrderItem, 'productId' | 'quantity'>) => {
				const { currentOrder } = get()
				if (!currentOrder) {
					get().createOrder()
					return get().addItem(item)
				}

				const existingItemIndex = currentOrder.items.findIndex(
					(existingItem) => existingItem.productId === item.productId,
				)

				let updatedItems: OrderItem[]
				if (existingItemIndex === -1) {
					// Add new item
					updatedItems = [...currentOrder.items, { ...item }]
				} else {
					// Update existing item quantity
					updatedItems = currentOrder.items.map((existingItem, index) =>
						index === existingItemIndex
							? {
									...existingItem,
									quantity: existingItem.quantity + item.quantity,
								}
							: existingItem,
					)
				}

				set({
					currentOrder: {
						...currentOrder,
						items: updatedItems,
						totalAmount: 0, // Will be calculated when needed
						updatedAt: new Date(),
					},
				})
			},
			clearOrder: () => {
				set({ currentOrder: null })
			},

			createOrder: () => {
				const nextOrder: Order = {
					createdAt: new Date(),
					id: `order-${Date.now()}`,
					items: [],
					status: 'draft',
					totalAmount: 0,
					updatedAt: new Date(),
				}
				set({ currentOrder: nextOrder })
			},

			currentOrder: null,

			getTotalAmount: () => {
				const { currentOrder } = get()
				return currentOrder?.totalAmount || 0
			},

			// Getters
			getTotalItems: () => {
				const { currentOrder } = get()
				if (!currentOrder) return 0
				return currentOrder.items.reduce(
					(total, item) => total + item.quantity,
					0,
				)
			},

			hasItems: () => {
				const { currentOrder } = get()
				return Boolean(currentOrder && currentOrder.items.length > 0)
			},

			orders: [],

			removeItem: (productId: string) => {
				const { currentOrder } = get()
				if (!currentOrder) return

				const updatedItems = currentOrder.items.filter(
					(item) => item.productId !== productId,
				)

				const updatedOrder = {
					...currentOrder,
					items: updatedItems,
					totalAmount: 0, // Will be calculated when needed
					updatedAt: new Date(),
				}

				// If no items left, clear the order
				if (updatedItems.length === 0) {
					set({ currentOrder: null })
				} else {
					set({ currentOrder: updatedOrder })
				}
			},

			setCustomerNote: (note: string) => {
				const { currentOrder } = get()
				if (!currentOrder) return

				set({
					currentOrder: {
						...currentOrder,
						customerNote: note,
						updatedAt: new Date(),
					},
				})
			},

			submitOrder: async () => {
				const { currentOrder, orders } = get()
				if (!currentOrder || currentOrder.items.length === 0) return

				try {
					// Convert to API format and submit
					const orderData = convertOrderToApiFormat(currentOrder)
					const response = await api.orders.create(orderData)

					const submittedOrder = {
						...currentOrder,
						// Store the API response for reference with proper typing
						apiOrderId: response.order.order_id,
						status: 'submitted' as const,
						updatedAt: new Date(),
					}

					// Add to orders history and clear current order
					set({
						currentOrder: null,
						orders: [submittedOrder, ...orders],
					})

					return response
				} catch (error) {
					// Use Sentry for error logging instead of console.error
					Sentry.captureException(error, {
						extra: {
							itemCount: currentOrder.items.length,
							orderId: currentOrder.id,
						},
						tags: { feature: 'orders', operation: 'submitOrder' },
					})
					throw error
				}
			},

			updateItem: (productId: string, quantity: number) => {
				const { currentOrder } = get()
				if (!currentOrder) return

				if (quantity <= 0) {
					get().removeItem(productId)
					return
				}

				const updatedItems = currentOrder.items.map((item) =>
					item.productId === productId ? { ...item, quantity } : item,
				)

				set({
					currentOrder: {
						...currentOrder,
						items: updatedItems,
						totalAmount: 0, // Will be calculated when needed
						updatedAt: new Date(),
					},
				})
			},
		}),
		{
			name: 'tolo-order-storage',
			partialize: (state) => ({
				currentOrder: state.currentOrder,
				orders: state.orders,
			}),
		},
	),
)

// Optimized selector hooks using useShallow for multiple values
export const useOrderData = () =>
	useOrderStore(
		useShallow((state) => ({
			currentOrder: state.currentOrder,
			orders: state.orders,
		})),
	)

// For computed values that might have same content but different references
export const useOrderStats = () =>
	useOrderStore(
		useShallow((state) => ({
			totalAmount: state.getTotalAmount(),
			totalItems: state.getTotalItems(),
		})),
	)

// Individual selectors for single values
export const useCurrentOrder = () =>
	useOrderStore((state) => state.currentOrder)
export const useOrders = () => useOrderStore((state) => state.orders)

// Action selectors
export const useAddItem = () => useOrderStore((state) => state.addItem)
export const useUpdateItem = () => useOrderStore((state) => state.updateItem)
export const useRemoveItem = () => useOrderStore((state) => state.removeItem)
export const useClearOrder = () => useOrderStore((state) => state.clearOrder)
export const useSetCustomerNote = () =>
	useOrderStore((state) => state.setCustomerNote)
export const useSubmitOrder = () => useOrderStore((state) => state.submitOrder)
export const useCreateOrder = () => useOrderStore((state) => state.createOrder)
