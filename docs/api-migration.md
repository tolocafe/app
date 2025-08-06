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

## TanStack Query Caching Strategy

The app now uses an optimized **stale-while-revalidate** caching approach designed for mobile applications:

### Key Configuration Changes

#### Global Defaults (query-client.ts)
- **staleTime**: 30 minutes (increased from 5 minutes) - data is considered fresh longer
- **gcTime**: 24 hours (increased from 1 hour) - cache persists longer when unused
- **refetchOnWindowFocus**: true - refetches when app comes to foreground
- **refetchOnReconnect**: true - refetches when network reconnects
- **networkMode**: 'offlineFirst' - optimized for mobile connectivity

#### Per-Query Optimizations

**Categories** (menu.ts):
- staleTime: 1 hour - categories change infrequently
- gcTime: 1 week - long-term caching for stable data

**Products List** (menu.ts):
- staleTime: 15 minutes - balance between freshness and performance
- gcTime: 24 hours - reasonable cache retention

**Individual Products** (product.ts):
- staleTime: 10 minutes - more frequent updates for pricing/availability
- gcTime: 24 hours - standard cache retention

### Benefits of This Approach

1. **Improved Performance**: Users see cached data immediately while fresh data loads in background
2. **Better Mobile Experience**: Longer cache times reduce network requests on mobile
3. **Offline Resilience**: Data remains available when offline for extended periods
4. **Reduced Data Usage**: Less frequent network requests save mobile data
5. **Faster Navigation**: Cached data provides instant navigation between screens

### How It Works

1. **Initial Load**: Data is fetched and cached with timestamp
2. **Subsequent Requests**: 
   - If data is within `staleTime` → serve from cache (no network request)
   - If data is stale but within `gcTime` → serve from cache AND fetch fresh data in background
   - If data is beyond `gcTime` → remove from cache and fetch fresh data

### Usage Examples

```typescript
// Using the optimized query options
const { data: menuData, isLoading, error } = useQuery(menuQueryOptions)

// Prefetching with optimized cache settings
queryClient.prefetchQuery(menuQueryOptions)

// Setting data with cache-aware updates
queryClient.setQueryData(menuQueryOptions.queryKey, newData)
```

### Migration Notes

- Existing queries will automatically benefit from new caching defaults
- No breaking changes to existing API usage
- Query invalidation and mutations work the same way
- DevTools will show longer cache retention times

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
