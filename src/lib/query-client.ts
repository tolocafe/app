import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { MMKV } from 'react-native-mmkv'

const queryStore = new MMKV({
	id: 'query-store',
})

export const storage = {
	removeItem: (key: string) => queryStore.delete(key),
	getItem: (key: string) => queryStore.getString(key) ?? null,
	setItem: (key: string, value: string) => queryStore.set(key, value),
}

// Create the persister
export const persister = createAsyncStoragePersister({
	storage,
	key: 'REACT_QUERY_OFFLINE_CACHE',
})

// Create and export the query client
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0, // 5 minutes - data is fresh for 5 minutes
			gcTime: 1000 * 60 * 60, // 1 hour - keep in cache for 1 hour when unused
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			networkMode: 'offlineFirst',
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		},
		mutations: {
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			networkMode: 'offlineFirst',
		},
	},
})
