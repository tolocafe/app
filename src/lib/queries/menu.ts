import { queryOptions } from '@tanstack/react-query'

import { api } from '@/lib/services/api-service'

export const categoriesQueryOptions = queryOptions({
	queryFn: () => api.menu.getCategories(),
	queryKey: ['categories'] as const,
})

export const productsQueryOptions = queryOptions({
	queryFn: () => api.menu.getProducts(),
	queryKey: ['products'] as const,
})
