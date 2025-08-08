import ky from 'ky'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { STORAGE_KEYS } from '@/lib/constants/storage'
import { BASE_URL } from '@/lib/api'

const isWeb = Platform.OS === 'web'

/**
 * Gets the current auth token from platform-appropriate storage
 * - Web: returns null (auth handled via HttpOnly cookie)
 * - Native: reads token from SecureStore
 */
async function getAuthToken(): Promise<string | null> {
	if (isWeb) return null
	try {
		const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_SESSION)
		return token ?? null
	} catch {
		return null
	}
}

/**
 * Public HTTP client - no authentication required
 * Use for endpoints that don't require user authentication
 */
export const publicClient = ky.create({
	prefixUrl: `${BASE_URL}/api`,
	headers: { 'Content-Type': 'application/json' },
	credentials: 'include',
	hooks: {
		afterResponse: [
			async (request, _options, response) => {
				// On native, persist the token after verifying OTP
				if (isWeb) return response

				try {
					if (request.url.includes('/auth/verify-otp')) {
						const data = await response
							.clone()
							.json()
							.catch(() => null)
						const token: unknown = data?.token
						if (typeof token === 'string' && token.length > 0) {
							await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_SESSION, token)
						}
					}
				} catch {
					// noop
				}

				return response
			},
		],
	},
})

/**
 * Private HTTP client - automatic auth token injection
 * Use for endpoints that require user authentication
 */
export const privateClient = ky.create({
	prefixUrl: `${BASE_URL}/api`,
	headers: {
		'Content-Type': 'application/json',
	},
	credentials: 'include',
	hooks: {
		beforeRequest: [
			async (request) => {
				// Web uses HttpOnly cookie; native uses Authorization header
				if (isWeb) return request

				const token = await getAuthToken()
				if (!token) throw new Error('No auth token found')
				request.headers.set('Authorization', `Bearer ${token}`)

				return request
			},
		],
	},
})
