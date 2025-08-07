import { queryClient, persister } from '@/lib/query-client'

/**
 * Clears all cached data including in-memory queries and persisted cache
 */
export const clearAllCache = async () => {
	// Clear in-memory cache
	queryClient.clear()

	// Clear persisted cache
	try {
		await persister.removeClient()
	} catch (error) {
		console.warn('Failed to clear persisted cache:', error)
	}
}
