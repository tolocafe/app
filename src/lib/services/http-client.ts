import ky from 'ky'
import { MMKV } from 'react-native-mmkv'
import { STORAGE_KEYS } from '@/lib/constants/storage'
import { BASE_URL } from '@/lib/api'

const storage = new MMKV()

/**
 * Gets the current auth token from storage
 */
function getAuthToken(): string | null {
	return storage.getString(STORAGE_KEYS.AUTH_SESSION) || null
}

/**
 * Public HTTP client - no authentication required
 * Use for endpoints that don't require user authentication
 */
export const publicClient = ky.create({
	prefixUrl: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
})

/**
 * Private HTTP client - automatic auth token injection
 * Use for endpoints that require user authentication
 */
export const privateClient = ky.create({
	prefixUrl: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	hooks: {
		beforeRequest: [
			(request) => {
				const token = getAuthToken()

				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`)
				}
			},
		],
	},
})
