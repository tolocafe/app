import { clearAllCache } from '@/lib/queries/cache-utils'
import { queryClient, persister } from '@/lib/query-client'

// Mock the query client and persister
jest.mock('@/lib/query-client', () => ({
	queryClient: {
		clear: jest.fn(),
	},
	persister: {
		removeClient: jest.fn(),
	},
}))

describe('cache-utils', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		// Suppress console.warn for tests
		jest.spyOn(console, 'warn').mockImplementation(() => {})
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	describe('clearAllCache', () => {
		it('clears both in-memory and persisted cache successfully', async () => {
			;(persister.removeClient as unknown as jest.Mock).mockResolvedValue(
				undefined,
			)

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
			expect(console.warn).toHaveBeenCalledWith(
				'Failed to clear persisted cache:',
				error,
			)
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
