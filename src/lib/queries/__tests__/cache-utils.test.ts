import { clearAllCache } from '@/lib/queries/cache-utils'
import { persister, queryClient } from '@/lib/query-client'

// Mock the query client and persister
jest.mock('@/lib/query-client', () => ({
	persister: {
		removeClient: jest.fn(),
	},
	queryClient: {
		clear: jest.fn(),
	},
}))

describe('cache-utils', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		// Suppress console.warn for tests
		jest.spyOn(console, 'warn').mockImplementation(() => null)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	describe('clearAllCache', () => {
		it('clears both in-memory and persisted cache successfully', async () => {
			;(persister.removeClient as unknown as jest.Mock).mockResolvedValue(null)

			await clearAllCache()

			expect(queryClient.clear).toHaveBeenCalledTimes(1)
			expect(persister.removeClient).toHaveBeenCalledTimes(1)
		})

		it('handles persister errors gracefully', async () => {
			const error = new Error('Failed to clear persisted cache')
			;(persister.removeClient as unknown as jest.Mock).mockRejectedValue(error)

			await clearAllCache()

			expect(queryClient.clear).toHaveBeenCalledTimes(1)
			expect(persister.removeClient).toHaveBeenCalledTimes(1)
		})

		it('clears in-memory cache even if persister fails', async () => {
			;(persister.removeClient as unknown as jest.Mock).mockRejectedValue(
				new Error('Persister error'),
			)

			await clearAllCache()

			expect(queryClient.clear).toHaveBeenCalledTimes(1)
		})
	})
})
