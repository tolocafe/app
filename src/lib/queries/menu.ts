import { queryOptions } from '@tanstack/react-query'
import { api } from '@/lib/services/api-service'

export const categoriesQueryOptions = queryOptions({
	queryKey: ['categories'] as const,
	queryFn: () => api.menu.getCategories(),
})

export const productsQueryOptions = queryOptions({
	queryKey: ['products'] as const,
	queryFn: () => api.menu.getProducts(),
})
