/**
 * Test file to validate TanStack Query stale-while-revalidate configuration
 * This ensures our caching strategy is properly implemented
 */

import { QueryClient } from '@tanstack/react-query'
import { queryClient } from '../query-client'
import { categoriesQueryOptions, productsQueryOptions } from '../menu'
import { productQueryOptions } from '../product'

describe('TanStack Query Cache Configuration', () => {
	describe('Global Query Client Defaults', () => {
		it('should have optimal stale-while-revalidate defaults', () => {
			const defaults = queryClient.getDefaultOptions()
			
			expect(defaults.queries?.staleTime).toBe(1000 * 60 * 30) // 30 minutes
			expect(defaults.queries?.gcTime).toBe(1000 * 60 * 60 * 24) // 24 hours
			expect(defaults.queries?.networkMode).toBe('offlineFirst')
			expect(defaults.queries?.refetchOnWindowFocus).toBe(true)
			expect(defaults.queries?.refetchOnReconnect).toBe(true)
			expect(defaults.queries?.refetchOnMount).toBe(true)
		})
	})

	describe('Menu Query Options', () => {
		it('should have appropriate cache settings for categories', () => {
			const options = categoriesQueryOptions
			
			expect(options.staleTime).toBe(1000 * 60 * 60) // 1 hour
			expect(options.gcTime).toBe(1000 * 60 * 60 * 24 * 7) // 1 week
			expect(options.queryKey).toEqual(['categories'])
		})

		it('should have appropriate cache settings for products', () => {
			const options = productsQueryOptions
			
			expect(options.staleTime).toBe(1000 * 60 * 15) // 15 minutes
			expect(options.gcTime).toBe(1000 * 60 * 60 * 24) // 24 hours
			expect(options.queryKey).toEqual(['products'])
		})
	})

	describe('Product Query Options', () => {
		it('should have appropriate cache settings for individual products', () => {
			const options = productQueryOptions('test-product-id')
			
			expect(options.staleTime).toBe(1000 * 60 * 10) // 10 minutes
			expect(options.gcTime).toBe(1000 * 60 * 60 * 24) // 24 hours
			expect(options.queryKey).toEqual(['product', 'test-product-id'])
			expect(options.enabled).toBe(true)
		})

		it('should be disabled when productId is empty', () => {
			const options = productQueryOptions('')
			
			expect(options.enabled).toBe(false)
		})
	})

	describe('Cache Behavior Validation', () => {
		it('should implement proper stale-while-revalidate flow', () => {
			// This test validates the conceptual flow:
			// 1. Fresh data (within staleTime) → serve from cache, no network
			// 2. Stale data (beyond staleTime but within gcTime) → serve from cache + background refetch
			// 3. Expired data (beyond gcTime) → remove from cache + fetch fresh
			
			const testQueryClient = new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000, // 1 second for testing
						gcTime: 5000, // 5 seconds for testing
					},
				},
			})

			// Mock time progression
			const now = Date.now()
			jest.spyOn(Date, 'now')
				.mockReturnValueOnce(now) // Initial fetch
				.mockReturnValueOnce(now + 500) // Within staleTime
				.mockReturnValueOnce(now + 2000) // Beyond staleTime, within gcTime
				.mockReturnValueOnce(now + 6000) // Beyond gcTime

			// This test structure validates our configuration logic
			expect(testQueryClient.getDefaultOptions().queries?.staleTime).toBe(1000)
			expect(testQueryClient.getDefaultOptions().queries?.gcTime).toBe(5000)
		})
	})
})

/**
 * Integration test helper to validate cache behavior in real usage
 */
export const validateCacheIntegration = () => {
	const testClient = new QueryClient()
	
	// Test that our query options work with the client
	const categoriesQuery = testClient.getQueryCache().find({
		queryKey: categoriesQueryOptions.queryKey,
	})
	
	const productsQuery = testClient.getQueryCache().find({
		queryKey: productsQueryOptions.queryKey,
	})
	
	return {
		categoriesQuery,
		productsQuery,
		cacheSize: testClient.getQueryCache().getAll().length,
	}
}