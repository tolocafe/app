import { queryOptions } from '@tanstack/react-query'

import { api } from '@/lib/services/api-service'

export const productQueryOptions = (productId: string) =>
	queryOptions({
		enabled: Boolean(productId),
		queryFn: () => api.menu.getProduct(productId),
		queryKey: ['product', productId] as const,
	})
