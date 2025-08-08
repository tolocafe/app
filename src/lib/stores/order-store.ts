import { create } from 'zustand/react'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import * as Sentry from '@sentry/react-native'
import { api } from '@/lib/services/api-service'
import { convertOrderToApiFormat } from '@/lib/queries/order'

export interface OrderItem {
	productId: string
	quantity: number
	modifications?: {
		id: string
		name: string
		price: number
	}[]
}

export interface Order {
	id: string
	items: OrderItem[]
	totalAmount: number
	status: 'draft' | 'submitted' | 'confirmed' | 'completed' | 'cancelled'
	createdAt: Date
	updatedAt: Date
	customerNote?: string
	apiOrderId?: string
}

interface OrderStore {
	currentOrder: Order | null
	orders: Order[]

	// Actions
	createOrder: () => void
	addItem: (item: Pick<OrderItem, 'productId' | 'quantity'>) => void
	updateItem: (productId: string, quantity: number) => void
	removeItem: (productId: string) => void
	clearOrder: () => void
	setCustomerNote: (note: string) => void
	submitOrder: () => Promise<unknown>

	// Getters
	getTotalItems: () => number
	getTotalAmount: () => number
	hasItems: () => boolean
}

export const useOrderStore = create<OrderStore>()(
	persist(
		(set, get) => ({
			currentOrder: null,
			orders: [],

			createOrder: () => {
				const newOrder: Order = {
					id: `order-${Date.now()}`,
					items: [],
					totalAmount: 0,
					status: 'draft',
					createdAt: new Date(),
					updatedAt: new Date(),
				}
				set({ currentOrder: newOrder })
			},

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
				if (existingItemIndex >= 0) {
					// Update existing item quantity
					updatedItems = currentOrder.items.map((existingItem, index) =>
						index === existingItemIndex
							? {
									...existingItem,
									quantity: existingItem.quantity + item.quantity,
								}
							: existingItem,
					)
				} else {
					// Add new item
					updatedItems = [...currentOrder.items, { ...item }]
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

			clearOrder: () => {
				set({ currentOrder: null })
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
						status: 'submitted' as const,
						updatedAt: new Date(),
						// Store the API response for reference with proper typing
						apiOrderId: response?.order?.order_id,
					}

					// Add to orders history and clear current order
					set({
						orders: [submittedOrder, ...orders],
						currentOrder: null,
					})

					return response
				} catch (error) {
					// Use Sentry for error logging instead of console.error
					Sentry.captureException(error, {
						tags: { feature: 'orders', operation: 'submitOrder' },
						extra: {
							orderId: currentOrder.id,
							itemCount: currentOrder.items.length,
						},
					})
					throw error
				}
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

			getTotalAmount: () => {
				const { currentOrder } = get()
				return currentOrder?.totalAmount || 0
			},

			hasItems: () => {
				const { currentOrder } = get()
				return Boolean(currentOrder && currentOrder.items.length > 0)
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
			totalItems: state.getTotalItems(),
			totalAmount: state.getTotalAmount(),
			hasItems: state.hasItems(),
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
