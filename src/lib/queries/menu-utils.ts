import { queryClient, storage } from '@/lib/query-client'
import { categoriesQueryOptions, productsQueryOptions } from './menu'
import type {
	PosterApiResponse,
	PosterCategory,
	PosterProduct,
} from '@/lib/api/client'

// Categories utilities
export const prefetchCategories = () => {
	return queryClient.prefetchQuery(categoriesQueryOptions)
}

export const invalidateCategories = () => {
	return queryClient.invalidateQueries({
		queryKey: categoriesQueryOptions.queryKey,
	})
}

export const getCachedCategories = ():
	| PosterApiResponse<PosterCategory[]>
	| undefined => {
	return queryClient.getQueryData(categoriesQueryOptions.queryKey)
}

export const setCachedCategories = (
	data: PosterApiResponse<PosterCategory[]>,
) => {
	queryClient.setQueryData(categoriesQueryOptions.queryKey, data)
}

export const hasCategoriesCache = (): boolean => {
	return (
		queryClient.getQueryState(categoriesQueryOptions.queryKey) !== undefined
	)
}

export const ensureCategoriesData = () => {
	return queryClient.ensureQueryData(categoriesQueryOptions)
}

export const fetchCategoriesData = () => {
	return queryClient.fetchQuery(categoriesQueryOptions)
}

// Products utilities
export const prefetchProducts = () => {
	return queryClient.prefetchQuery(productsQueryOptions)
}

export const invalidateProducts = () => {
	return queryClient.invalidateQueries({
		queryKey: productsQueryOptions.queryKey,
	})
}

export const getCachedProducts = ():
	| PosterApiResponse<PosterProduct[]>
	| undefined => {
	return queryClient.getQueryData(productsQueryOptions.queryKey)
}

export const setCachedProducts = (data: PosterApiResponse<PosterProduct[]>) => {
	queryClient.setQueryData(productsQueryOptions.queryKey, data)
}

export const hasProductsCache = (): boolean => {
	return queryClient.getQueryState(productsQueryOptions.queryKey) !== undefined
}

export const ensureProductsData = () => {
	return queryClient.ensureQueryData(productsQueryOptions)
}

export const fetchProductsData = () => {
	return queryClient.fetchQuery(productsQueryOptions)
}

// General menu utilities
export const cancelMenuQueries = () => {
	return Promise.all([
		queryClient.cancelQueries({ queryKey: categoriesQueryOptions.queryKey }),
		queryClient.cancelQueries({ queryKey: productsQueryOptions.queryKey }),
	])
}

export const removeMenuCache = () => {
	queryClient.removeQueries({ queryKey: categoriesQueryOptions.queryKey })
	queryClient.removeQueries({ queryKey: productsQueryOptions.queryKey })
}

export const resetMenuQueries = () => {
	return Promise.all([
		queryClient.resetQueries({ queryKey: categoriesQueryOptions.queryKey }),
		queryClient.resetQueries({ queryKey: productsQueryOptions.queryKey }),
	])
}

// Clear all cache utilities
export const clearAllCache = async () => {
	// Clear TanStack Query cache (in-memory)
	queryClient.clear()

	// Clear persisted cache in MMKV storage
	try {
		// Remove the specific TanStack Query cache key
		storage.removeItem('REACT_QUERY_OFFLINE_CACHE')

		// Clear all other cache keys that might exist
		// Note: MMKV doesn't have a clearAll method, but we can remove specific known keys
		// The query client will handle most of the cache clearing
	} catch (error) {
		console.warn('Failed to clear persisted cache:', error)
	}
}
