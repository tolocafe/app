import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { MMKV } from 'react-native-mmkv'

// Create MMKV storage instance for TanStack Query
const queryStorage = new MMKV({
	id: 'tolo-query-cache',
})

// Create storage adapter for TanStack Query
export const storage = {
	setItem: (key: string, value: string) => {
		queryStorage.set(key, value)
	},
	getItem: (key: string) => {
		const value = queryStorage.getString(key)
		return value ?? null
	},
	removeItem: (key: string) => {
		queryStorage.delete(key)
	},
}

// Create the persister
export const persister = createSyncStoragePersister({
	storage,
	key: 'REACT_QUERY_OFFLINE_CACHE',
})

// Create and export the query client
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Stale-while-revalidate configuration for mobile apps
			staleTime: 1000 * 60 * 30, // 30 minutes - data is fresh for 30 minutes
			gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for 24 hours when unused
			
			// Retry configuration optimized for mobile networks
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			
			// Network mode optimized for offline-first mobile experience
			networkMode: 'offlineFirst', // Important for mobile apps
			
			// Refetch behavior optimized for mobile
			refetchOnWindowFocus: true, // Refetch when app comes to foreground
			refetchOnReconnect: true, // Refetch when network reconnects
			refetchOnMount: true, // Refetch when component mounts (if stale)
			
			// Background refetch settings
			refetchInterval: false, // No automatic polling by default
			refetchIntervalInBackground: false, // Don't refetch in background
		},
		mutations: {
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			networkMode: 'offlineFirst',
		},
	},
})
