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
			// Default cache settings for all queries
			staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
			gcTime: 1000 * 60 * 60, // 1 hour - keep in cache for 1 hour when unused
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			networkMode: 'offlineFirst', // Important for mobile apps
		},
		mutations: {
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			networkMode: 'offlineFirst',
		},
	},
})
