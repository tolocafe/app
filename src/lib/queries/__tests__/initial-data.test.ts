/**
 * Test file to validate initial data from cache implementation
 * This ensures product detail queries are pre-populated from products list
 */

import { QueryClient } from '@tanstack/react-query'
import { PosterApiResponse, PosterProduct } from '@/lib/api/client'
import { productQueryOptions } from '@/lib/queries/product'
import { productsQueryOptions } from '@/lib/queries/menu'

// Mock product data that would come from the products list
const mockProducts: PosterProduct[] = [
	{
		product_id: '1',
		product_name: 'Espresso',
		product_code: 'ESP001',
		barcode: '',
		category_name: 'Coffee',
		menu_category_id: '1',
		price: { '1': '3.50' },
		unit: 'pcs',
		cost: '1.50',
		cost_netto: '1.25',
		fiscal: '1',
		hidden: '0',
		workshop: '1',
		nodiscount: '0',
		photo: '/images/espresso.jpg',
		photo_origin: '/images/espresso_large.jpg',
		profit: { '1': '2.00' },
		sort_order: '1',
		tax_id: '1',
		product_tax_id: '1',
		type: '1',
		weight_flag: '0',
		color: '#8B4513',
		spots: [
			{
				spot_id: '1',
				price: '3.50',
				profit: '2.00',
				profit_netto: '1.75',
				visible: '1',
			},
		],
		ingredient_id: '1',
		cooking_time: '2',
		different_spots_prices: '0',
		sources: [],
		master_id: '1',
		out: 0,
		product_production_description: 'Rich and bold espresso shot',
		ingredients: [],
		group_modifications: [],
	},
	{
		product_id: '2',
		product_name: 'Cappuccino',
		product_code: 'CAP001',
		barcode: '',
		category_name: 'Coffee',
		menu_category_id: '1',
		price: { '1': '4.50' },
		unit: 'pcs',
		cost: '2.00',
		cost_netto: '1.75',
		fiscal: '1',
		hidden: '0',
		workshop: '1',
		nodiscount: '0',
		photo: '/images/cappuccino.jpg',
		photo_origin: '/images/cappuccino_large.jpg',
		profit: { '1': '2.50' },
		sort_order: '2',
		tax_id: '1',
		product_tax_id: '1',
		type: '1',
		weight_flag: '0',
		color: '#D2691E',
		spots: [
			{
				spot_id: '1',
				price: '4.50',
				profit: '2.50',
				profit_netto: '2.25',
				visible: '1',
			},
		],
		ingredient_id: '2',
		cooking_time: '3',
		different_spots_prices: '0',
		sources: [],
		master_id: '2',
		out: 0,
		product_production_description: 'Creamy cappuccino with steamed milk',
		ingredients: [],
		group_modifications: [],
	},
]

const mockProductsResponse: PosterApiResponse<PosterProduct[]> = {
	response: mockProducts,
}

describe('Initial Data from Cache', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		})
	})

	afterEach(() => {
		queryClient.clear()
	})

	describe('Product Query Initial Data', () => {
		it('should get initial data from products cache when available', () => {
			// First, populate the products cache
			queryClient.setQueryData(productsQueryOptions.queryKey, mockProductsResponse)

			// Create product query options for a specific product
			const productOptions = productQueryOptions('1')

			// Get the initial data function result
			const initialData = productOptions.initialData?.()

			// Should return the product wrapped in API response format
			expect(initialData).toEqual({
				response: mockProducts[0], // Espresso
			})
		})

		it('should return undefined when product not found in cache', () => {
			// Populate cache with products
			queryClient.setQueryData(productsQueryOptions.queryKey, mockProductsResponse)

			// Try to get initial data for non-existent product
			const productOptions = productQueryOptions('999')
			const initialData = productOptions.initialData?.()

			expect(initialData).toBeUndefined()
		})

		it('should return undefined when products cache is empty', () => {
			// Don't populate the cache
			const productOptions = productQueryOptions('1')
			const initialData = productOptions.initialData?.()

			expect(initialData).toBeUndefined()
		})

		it('should get initialDataUpdatedAt from products cache state', () => {
			// Set products data with a specific timestamp
			const timestamp = Date.now()
			queryClient.setQueryData(productsQueryOptions.queryKey, mockProductsResponse)

			// Simulate the dataUpdatedAt timestamp
			const productsState = queryClient.getQueryState(productsQueryOptions.queryKey)
			expect(productsState?.dataUpdatedAt).toBeDefined()

			// Test the initialDataUpdatedAt function
			const productOptions = productQueryOptions('1')
			const updatedAt = productOptions.initialDataUpdatedAt?.()

			expect(updatedAt).toBe(productsState?.dataUpdatedAt)
		})

		it('should maintain correct data structure for API compatibility', () => {
			// Populate cache
			queryClient.setQueryData(productsQueryOptions.queryKey, mockProductsResponse)

			// Get initial data for Cappuccino
			const productOptions = productQueryOptions('2')
			const initialData = productOptions.initialData?.()

			// Verify structure matches individual product API response
			expect(initialData).toHaveProperty('response')
			expect(initialData?.response).toEqual(mockProducts[1])
			expect(initialData?.response?.product_name).toBe('Cappuccino')
			expect(initialData?.response?.price).toEqual({ '1': '4.50' })
		})
	})

	describe('Performance Benefits', () => {
		it('should provide instant data without network request', () => {
			// This test validates the conceptual benefit:
			// When products list is already cached, individual product details
			// can be shown immediately without waiting for network request

			queryClient.setQueryData(productsQueryOptions.queryKey, mockProductsResponse)

			const productOptions = productQueryOptions('1')
			const initialData = productOptions.initialData?.()

			// Data is available immediately
			expect(initialData).toBeDefined()
			expect(initialData?.response?.product_name).toBe('Espresso')

			// This would typically require a network request, but now it's instant
			expect(initialData?.response?.product_production_description).toBe(
				'Rich and bold espresso shot'
			)
		})
	})
})

/**
 * Integration test helper to validate real-world usage
 */
export const validateInitialDataIntegration = (queryClient: QueryClient) => {
	// Simulate having products in cache (as would happen after visiting menu)
	queryClient.setQueryData(productsQueryOptions.queryKey, mockProductsResponse)

	// Test getting initial data for different products
	const espressoOptions = productQueryOptions('1')
	const cappuccinoOptions = productQueryOptions('2')
	const nonExistentOptions = productQueryOptions('999')

	return {
		espressoInitialData: espressoOptions.initialData?.(),
		cappuccinoInitialData: cappuccinoOptions.initialData?.(),
		nonExistentInitialData: nonExistentOptions.initialData?.(),
		cacheHasProducts: Boolean(
			queryClient.getQueryData(productsQueryOptions.queryKey)
		),
	}
}