import { queryOptions } from '@tanstack/react-query'
import { api, PosterApiResponse, PosterProduct } from '@/lib/api/client'
import { productsQueryOptions } from '@/lib/queries/menu'
import { queryClient } from '@/lib/query-client'

export const productQueryOptions = (productId: string) =>
	queryOptions({
		queryKey: ['product', productId] as const,
		queryFn: () => api.menu.getProduct(productId),
		enabled: Boolean(productId),
		initialData: () => {
			// Get the products list from cache using the imported queryClient
			const productsData = queryClient.getQueryData<PosterApiResponse<PosterProduct[]>>(
				productsQueryOptions.queryKey
			)
			
			// Find the specific product in the list
			const product = productsData?.response?.find(
				(p) => p.product_id === productId
			)
			
			// Return the product wrapped in the same API response format
			// as the individual product endpoint
			return product ? { response: product } : undefined
		},
		initialDataUpdatedAt: () => {
			// Get the timestamp of when the products list was last updated
			const productsState = queryClient.getQueryState(productsQueryOptions.queryKey)
			return productsState?.dataUpdatedAt
		},
	})
