import { queryOptions } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Category, MenuItem } from '../data/menu'

export interface MenuData {
	categories: Category[]
	items: MenuItem[]
}

export interface CategoryData {
	category: Category | undefined
	items: MenuItem[]
}

// Fetch menu data from real API
const fetchMenu = async (): Promise<MenuData> => {
	// Fetch both categories and products in parallel from real API
	const [categoriesResponse, productsResponse] = await Promise.all([
		api.menu.getCategories(),
		api.menu.getProducts(),
	])

	// Transform Poster categories to our format
	const categories: Category[] = (categoriesResponse.response || [])
		.filter((cat) => {
			// Check if category is visible in at least one spot
			return (
				Array.isArray(cat.visible) &&
				cat.visible.some((spot) => spot.visible === 1)
			)
		})
		.map((cat) => ({
			id: cat.category_id,
			name: cat.category_name,
		}))
		.sort((a, b) => a.name.localeCompare(b.name))

	// Create a mapping from category ID to category name for easier lookup
	const categoryIdToName: Record<string, string> = {}
	categories.forEach((cat) => {
		categoryIdToName[cat.id] = cat.name.toLowerCase()
	})

	// Transform Poster products to our format
	const items: MenuItem[] = (productsResponse.response || [])
		.filter((product) => {
			// Only include visible products
			return product.spots.some((spot) => spot.visible === '1')
		})
		.map((product) => {
			// Get the first price from the price record (usually spot_id "1")
			const firstPrice = product.price ? Object.values(product.price)[0] : '0'

			// Map category based on actual category name from API
			const categoryName =
				categoryIdToName[product.menu_category_id]?.toLowerCase() || ''
			let mappedCategory: MenuItem['category'] = 'coffee' // default

			if (categoryName.includes('café') || categoryName.includes('coffee')) {
				mappedCategory = 'coffee'
			} else if (categoryName.includes('matcha')) {
				mappedCategory = 'tea' // Matcha is a type of tea
			} else if (
				categoryName.includes('té') ||
				categoryName.includes('tea') ||
				categoryName.includes('tisana')
			) {
				mappedCategory = 'tea'
			} else if (
				categoryName.includes('alimento') ||
				categoryName.includes('food')
			) {
				mappedCategory = 'pastries' // Food items mapped to pastries for now
			}

			return {
				id: product.product_id,
				name: product.product_name,
				description: product.product_production_description || '',
				category: mappedCategory,
				price: parseFloat(firstPrice) / 100, // Poster returns price in cents
				image: product.photo || undefined,
				// Mark items as popular if they have modifications (indicates customization)
				isPopular: Boolean(product.group_modifications?.length),
			}
		})

	return { categories, items }
}

// Query options for fetching all menu data
export const menuQueryOptions = queryOptions({
	queryKey: ['menu'] as const,
	queryFn: fetchMenu,
	// Data will be cached for 10 minutes
	staleTime: 1000 * 60 * 10,
	// Keep in cache for 1 hour
	gcTime: 1000 * 60 * 60,
})

// Query options for fetching category-specific data
export const menuCategoryQueryOptions = (categoryId: string) =>
	queryOptions({
		queryKey: ['menu', 'category', categoryId] as const,
		queryFn: async (): Promise<CategoryData> => {
			const menu = await fetchMenu()
			return {
				category: menu.categories.find(
					(cat: Category) => cat.id === categoryId,
				),
				items: menu.items.filter((item) => {
					// For now, filter by the mapped category type
					// In production, you might want to filter by actual category_id
					return item.category === categoryId
				}),
			}
		},
		enabled: Boolean(categoryId), // Only run if categoryId is provided
		// Inherit staleTime from parent query
		staleTime: 1000 * 60 * 10,
		gcTime: 1000 * 60 * 60,
	})

// Additional query options for prefetching or other operations
export const menuPrefetchOptions = {
	all: menuQueryOptions,
	category: (categoryId: string) => menuCategoryQueryOptions(categoryId),
}
