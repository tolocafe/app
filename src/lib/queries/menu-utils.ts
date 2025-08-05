import { queryClient } from '../query-client'
import type { MenuData } from './menu'
import { menuCategoryQueryOptions, menuQueryOptions } from './menu'

export const prefetchMenu = () => {
	return queryClient.prefetchQuery(menuQueryOptions)
}

export const prefetchMenuCategory = (categoryId: string) => {
	return queryClient.prefetchQuery(menuCategoryQueryOptions(categoryId))
}

export const invalidateMenu = () => {
	return queryClient.invalidateQueries({
		queryKey: menuQueryOptions.queryKey,
	})
}

export const invalidateMenuCategory = (categoryId: string) => {
	return queryClient.invalidateQueries({
		queryKey: menuCategoryQueryOptions(categoryId).queryKey,
	})
}

export const getCachedMenu = (): MenuData | undefined => {
	return queryClient.getQueryData(menuQueryOptions.queryKey)
}

export const setCachedMenu = (data: MenuData) => {
	queryClient.setQueryData(menuQueryOptions.queryKey, data)
}

export const hasMenuCache = (): boolean => {
	return queryClient.getQueryState(menuQueryOptions.queryKey) !== undefined
}

export const ensureMenuData = () => {
	return queryClient.ensureQueryData(menuQueryOptions)
}

export const fetchMenuData = () => {
	return queryClient.fetchQuery(menuQueryOptions)
}

export const cancelMenuQueries = () => {
	return queryClient.cancelQueries({
		queryKey: menuQueryOptions.queryKey,
	})
}

export const removeMenuCache = () => {
	queryClient.removeQueries({
		queryKey: menuQueryOptions.queryKey,
	})
}

export const resetMenuQueries = () => {
	return queryClient.resetQueries({
		queryKey: menuQueryOptions.queryKey,
	})
}
