# API Migration to Real Endpoints

This document outlines the migration from mock data to real API endpoints using TanStack Query v5 with `queryOptions` pattern.

## Changes Made

### 1. API Types Updated

Generated accurate TypeScript interfaces based on actual API responses:

- **`PosterCategory`** - Complete category structure from `/menu/categories`
- **`PosterProduct`** - Complete product structure from `/menu/products`
- **`PosterIngredient`** - Ingredient details within products
- **`PosterModification`** - Product customization options
- **`PosterModificationGroup`** - Groups of modifications

### 2. Real API Integration

#### Categories Endpoint: `https://app.tolo.cafe/api/menu/categories`

```json
{
	"response": [
		{
			"category_id": "1",
			"category_name": "Café",
			"visible": [{ "spot_id": 1, "visible": 1 }]
		},
		{
			"category_id": "2",
			"category_name": "Matcha",
			"visible": [{ "spot_id": 1, "visible": 1 }]
		},
		{
			"category_id": "3",
			"category_name": "Té y Tisanas",
			"visible": [{ "spot_id": 1, "visible": 1 }]
		},
		{
			"category_id": "4",
			"category_name": "Alimentos",
			"visible": [{ "spot_id": 1, "visible": 1 }]
		}
	]
}
```

#### Products Endpoint: `https://app.tolo.cafe/api/menu/products`

Real products include:

- **Café**: Americano ($45.00), Cappuccino ($60.00), Espresso ($45.00), Flat White ($60.00), Latte ($65.00)
- **Matcha**: (Products in this category)
- **Té y Tisanas**: (Tea products)
- **Alimentos**: (Food items)

### 3. Smart Category Mapping

Implemented intelligent category mapping based on actual API category names:

```typescript
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
} else if (categoryName.includes('alimento') || categoryName.includes('food')) {
	mappedCategory = 'pastries' // Food items mapped to pastries for now
}
```

### 4. Enhanced Product Data

Products now include additional real data:

- **Ingredients**: List of actual ingredients from API
- **Modifications**: Customization options (milk types, etc.)
- **Cooking Time**: Preparation time in seconds
- **Visibility**: Only show products visible in active spots
- **Popular Items**: Marked based on having customization options

### 5. Removed Mock Data

- Deleted all mock data from `src/lib/data/menu.ts`
- Removed `USE_REAL_API` toggle from configuration
- Updated API configuration to always use real endpoints
- File now contains only TypeScript type definitions

### 6. Modern Query Pattern

Using TanStack Query v5 `queryOptions` pattern:

```typescript
// Direct usage without wrapper hooks
const { data: menuData, isLoading, error } = useQuery(menuQueryOptions)

// Prefetching
queryClient.prefetchQuery(menuQueryOptions)

// Cache manipulation
queryClient.setQueryData(menuQueryOptions.queryKey, newData)
```

## API Structure

### Categories

- **ID "1"**: Café (Coffee drinks)
- **ID "2"**: Matcha (Matcha-based drinks)
- **ID "3"**: Té y Tisanas (Teas and herbal teas)
- **ID "4"**: Alimentos (Food items)

### Products

All products include:

- Prices in cents (converted to dollars for display)
- Ingredient lists with measurements
- Customization options (milk types, etc.)
- Cooking/preparation times
- Visibility settings per location

### Price Handling

```typescript
// Prices come as objects with spot_id keys
// { "1": "4500" } = $45.00 for spot 1
const firstPrice = product.price ? Object.values(product.price)[0] : '0'
const priceInDollars = parseFloat(firstPrice) / 100
```

## Benefits

1. **Real Data**: Application now uses actual menu items and categories
2. **Type Safety**: Complete TypeScript coverage of API responses
3. **Performance**: Efficient caching and query management
4. **Flexibility**: Easy to extend with new API endpoints
5. **Maintainability**: Clean separation of concerns

## Environment Configuration

The API automatically uses:

- **Production**: `https://app.tolo.cafe/api` (default)
- **Development**: `http://localhost:8787/api` (when `USE_LOCAL_API=true`)

## Testing

To test the real API integration:

1. Start the application
2. Check network tab for API calls to `https://app.tolo.cafe/api/menu/*`
3. Verify menu items display actual products from the API
4. Test category filtering with real categories

The application is now fully integrated with the real Poster POS API endpoints.
