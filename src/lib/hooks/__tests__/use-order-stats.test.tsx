import { renderHook, act } from '@testing-library/react-native'
import {
	useOrderStats,
	useAddItem,
	useClearOrder,
} from '@/lib/stores/order-store'

// Mock Sentry to avoid issues in tests
jest.mock('@sentry/react-native', () => ({
	captureException: jest.fn(),
}))

// Mock the API service
jest.mock('@/lib/services/api-service', () => ({
	api: {
		orders: {
			create: jest.fn(),
		},
	},
}))

describe('useOrderStats hook', () => {
	beforeEach(() => {
		// Clear any existing order state before each test
		const { result: clearResult } = renderHook(() => useClearOrder())
		act(() => {
			clearResult.current()
		})
	})

	it('returns correct initial state', () => {
		const { result } = renderHook(() => useOrderStats())

		expect(result.current.totalItems).toBe(0)
		expect(result.current.totalAmount).toBe(0)
		expect(result.current.hasItems).toBe(false)
	})

	it('updates stats when items are added', () => {
		const { result: statsResult } = renderHook(() => useOrderStats())
		const { result: addItemResult } = renderHook(() => useAddItem())

		// Initially no items
		expect(statsResult.current.totalItems).toBe(0)
		expect(statsResult.current.hasItems).toBe(false)

		// Add an item
		act(() => {
			addItemResult.current({
				productId: 'test-product-1',
				quantity: 2,
			})
		})

		// Stats should update
		expect(statsResult.current.totalItems).toBe(2)
		expect(statsResult.current.hasItems).toBe(true)
	})

	it('updates stats when multiple items are added', () => {
		const { result: statsResult } = renderHook(() => useOrderStats())
		const { result: addItemResult } = renderHook(() => useAddItem())

		// Add multiple items
		act(() => {
			addItemResult.current({
				productId: 'product-1',
				quantity: 1,
			})
		})

		act(() => {
			addItemResult.current({
				productId: 'product-2',
				quantity: 3,
			})
		})

		// Total should be sum of all quantities
		expect(statsResult.current.totalItems).toBe(4)
		expect(statsResult.current.hasItems).toBe(true)
	})

	it('updates stats when same product is added multiple times', () => {
		const { result: statsResult } = renderHook(() => useOrderStats())
		const { result: addItemResult } = renderHook(() => useAddItem())

		// Add same product twice
		act(() => {
			addItemResult.current({
				productId: 'product-1',
				quantity: 2,
			})
		})

		act(() => {
			addItemResult.current({
				productId: 'product-1',
				quantity: 1,
			})
		})

		// Should accumulate quantities for same product
		expect(statsResult.current.totalItems).toBe(3)
		expect(statsResult.current.hasItems).toBe(true)
	})

	it('resets stats when order is cleared', () => {
		const { result: statsResult } = renderHook(() => useOrderStats())
		const { result: addItemResult } = renderHook(() => useAddItem())
		const { result: clearResult } = renderHook(() => useClearOrder())

		// Add items first
		act(() => {
			addItemResult.current({
				productId: 'product-1',
				quantity: 2,
			})
		})

		expect(statsResult.current.totalItems).toBe(2)
		expect(statsResult.current.hasItems).toBe(true)

		// Clear the order
		act(() => {
			clearResult.current()
		})

		// Stats should reset
		expect(statsResult.current.totalItems).toBe(0)
		expect(statsResult.current.hasItems).toBe(false)
	})
})
