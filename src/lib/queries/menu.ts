import { queryOptions } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

// Raw categories query (for direct API access if needed)
export const categoriesQueryOptions = queryOptions({
	queryKey: ['categories'] as const,
	queryFn: api.menu.getCategories,
	// Categories change infrequently, so we can cache them longer
	staleTime: 1000 * 60 * 60, // 1 hour - categories are fresh for 1 hour
	gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week - keep categories in cache for 1 week
})

// Raw products query (for direct API access if needed)
export const productsQueryOptions = queryOptions({
	queryKey: ['products'] as const,
	queryFn: api.menu.getProducts,
	// Products may change more frequently (pricing, availability)
	staleTime: 1000 * 60 * 15, // 15 minutes - products are fresh for 15 minutes
	gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep products in cache for 24 hours
})
