import { queryOptions } from '@tanstack/react-query'
import { api } from '@/lib/services/api-service'

export const productQueryOptions = (productId: string) =>
	queryOptions({
		queryKey: ['product', productId] as const,
		queryFn: () => api.menu.getProduct(productId),
		enabled: Boolean(productId),
	})
