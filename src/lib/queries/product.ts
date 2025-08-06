import { queryOptions } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

export const productQueryOptions = (productId: string) =>
	queryOptions({
		queryKey: ['product', productId] as const,
		queryFn: () => api.menu.getProduct(productId),
		enabled: Boolean(productId),
		// Individual products may have dynamic pricing/availability
		staleTime: 1000 * 60 * 10, // 10 minutes - individual product data is fresh for 10 minutes
		gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep product data in cache for 24 hours
	})
