// Menu queries and utilities
export { categoriesQueryOptions, productsQueryOptions } from './menu'

export {
	// Categories utilities
	prefetchCategories,
	invalidateCategories,
	getCachedCategories,
	setCachedCategories,
	hasCategoriesCache,
	ensureCategoriesData,
	fetchCategoriesData,
	// Products utilities
	prefetchProducts,
	invalidateProducts,
	getCachedProducts,
	setCachedProducts,
	hasProductsCache,
	ensureProductsData,
	fetchProductsData,
	// General utilities
	cancelMenuQueries,
	removeMenuCache,
	resetMenuQueries,
	clearAllCache,
} from './menu-utils'

// Product queries
export { productQueryOptions } from './product'

// Preferences queries and mutations
export {
	preferencesMutationOptions,
	preferencesQueryOptions,
	setDefaultStoreMutationOptions,
	updateLanguageMutationOptions,
	updateNotificationsMutationOptions,
	type UserPreferences,
} from './preferences'
