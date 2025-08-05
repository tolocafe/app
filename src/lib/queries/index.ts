// Menu queries and utilities
export {
	menuCategoryQueryOptions,
	menuPrefetchOptions,
	menuQueryOptions,
	type CategoryData,
	type MenuData,
} from './menu'

export {
	cancelMenuQueries,
	ensureMenuData,
	fetchMenuData,
	getCachedMenu,
	hasMenuCache,
	invalidateMenu,
	invalidateMenuCategory,
	prefetchMenu,
	prefetchMenuCategory,
	removeMenuCache,
	resetMenuQueries,
	setCachedMenu,
} from './menu-utils'

// Preferences queries and mutations
export {
	preferencesMutationOptions,
	preferencesQueryOptions,
	setDefaultStoreMutationOptions,
	toggleFavoriteMutationOptions,
	updateLanguageMutationOptions,
	updateNotificationsMutationOptions,
	type UserPreferences,
} from './preferences'
