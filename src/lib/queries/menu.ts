import { queryOptions } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

// Raw categories query (for direct API access if needed)
export const categoriesQueryOptions = queryOptions({
	queryKey: ['categories'] as const,
	queryFn: api.menu.getCategories,
})

// Raw products query (for direct API access if needed)
export const productsQueryOptions = queryOptions({
	queryKey: ['products'] as const,
	queryFn: api.menu.getProducts,
})
