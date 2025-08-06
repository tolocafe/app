import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'

export interface UpdateState {
	isChecking: boolean
	isDownloading: boolean
	isUpdateAvailable: boolean
	error: string | null
}

export function useUpdates() {
	const [state, setState] = useState<UpdateState>({
		isChecking: false,
		isDownloading: false,
		isUpdateAvailable: false,
		error: null,
	})

	const checkForUpdates = async () => {
		if (!Updates.isEnabled || __DEV__) {
			return
		}

		try {
			setState(prev => ({ ...prev, isChecking: true, error: null }))
			
			const update = await Updates.checkForUpdateAsync()
			
			setState(prev => ({ 
				...prev, 
				isChecking: false,
				isUpdateAvailable: update.isAvailable 
			}))

			if (update.isAvailable) {
				setState(prev => ({ ...prev, isDownloading: true }))
				await Updates.fetchUpdateAsync()
				setState(prev => ({ ...prev, isDownloading: false }))
				// Automatically reload the app with the new update
				await Updates.reloadAsync()
			}
		} catch (error) {
			setState(prev => ({ 
				...prev, 
				isChecking: false, 
				isDownloading: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred'
			}))
		}
	}

	const reloadApp = async () => {
		try {
			await Updates.reloadAsync()
		} catch (error) {
			setState(prev => ({ 
				...prev, 
				error: error instanceof Error ? error.message : 'Failed to reload app'
			}))
		}
	}

	// Check for updates on mount
	useEffect(() => {
		checkForUpdates()
	}, [])

	return {
		...state,
		checkForUpdates,
		reloadApp,
		runtimeVersion: Updates.runtimeVersion,
		updateId: Updates.updateId,
		createdAt: Updates.createdAt,
		channel: Updates.channel,
	}
}