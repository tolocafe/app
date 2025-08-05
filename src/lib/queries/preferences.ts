import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { MMKV } from 'react-native-mmkv'

// Create a dedicated MMKV instance for user preferences
const preferencesStorage = new MMKV({
	id: 'tolo-preferences',
})

export interface UserPreferences {
	favoriteItems: string[]
	defaultStore: string | null
	notificationsEnabled: boolean
	language: 'en' | 'es'
}

// Function to read preferences from storage
const fetchPreferences = async (): Promise<UserPreferences> => {
	// Read from MMKV
	const preferences: UserPreferences = {
		favoriteItems: JSON.parse(
			preferencesStorage.getString('favoriteItems') ?? '[]',
		),
		defaultStore: JSON.parse(
			preferencesStorage.getString('defaultStore') ?? 'null',
		),
		notificationsEnabled: JSON.parse(
			preferencesStorage.getString('notificationsEnabled') ?? 'true',
		),
		language: JSON.parse(preferencesStorage.getString('language') ?? '"en"'),
	}

	return preferences
}

// Function to save preferences to storage
const savePreferences = async (preferences: Partial<UserPreferences>) => {
	// Save locally to MMKV
	Object.entries(preferences).forEach(([key, value]) => {
		preferencesStorage.set(key, JSON.stringify(value))
	})

	// In production, also sync to backend:
	// const response = await fetch('https://api.tolo.com/preferences', {
	//   method: 'POST',
	//   headers: { 'Content-Type': 'application/json' },
	//   body: JSON.stringify(preferences),
	// });
	// return response.json();

	return preferences
}

export const preferencesQueryOptions = queryOptions({
	queryKey: ['preferences'] as const,
	queryFn: fetchPreferences,
	// Preferences should never become stale
	staleTime: Infinity,
	// Keep in cache forever
	gcTime: Infinity,
})

export const preferencesMutationOptions = mutationOptions({
	mutationFn: savePreferences,
	onSuccess: (data, _variables, context) => {
		// Success handling will be done in the hook
		// This allows for custom success handlers per usage
		return data
	},
	onError: (error) => {
		console.error('Failed to save preferences:', error)
	},
})

export const toggleFavoriteMutationOptions = (itemId: string) =>
	mutationOptions({
		mutationFn: async (currentPreferences: UserPreferences) => {
			const favoriteItems = currentPreferences.favoriteItems.includes(itemId)
				? currentPreferences.favoriteItems.filter((id) => id !== itemId)
				: [...currentPreferences.favoriteItems, itemId]

			return savePreferences({ favoriteItems })
		},
	})

export const updateLanguageMutationOptions = mutationOptions({
	mutationFn: async (language: 'en' | 'es') => {
		return savePreferences({ language })
	},
})

export const updateNotificationsMutationOptions = mutationOptions({
	mutationFn: async (enabled: boolean) => {
		return savePreferences({ notificationsEnabled: enabled })
	},
})

export const setDefaultStoreMutationOptions = mutationOptions({
	mutationFn: async (storeId: string | null) => {
		return savePreferences({ defaultStore: storeId })
	},
})
