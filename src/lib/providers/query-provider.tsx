import NetInfo from '@react-native-community/netinfo'
import { focusManager, onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import React, { ReactNode, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { persister, queryClient } from '@/lib/query-client'

// Set up focus manager for React Native
focusManager.setEventListener((handleFocus) => {
	const subscription = AppState.addEventListener(
		'change',
		(state: AppStateStatus) => {
			handleFocus(state === 'active')
		},
	)

	return () => {
		subscription.remove()
	}
})

// Set up online manager for React Native
onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		setOnline(Boolean(state.isConnected))
	})
})

interface QueryProviderProps {
	children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
	// Initialize online status on mount
	useEffect(() => {
		NetInfo.fetch().then((state) => {
			onlineManager.setOnline(Boolean(state.isConnected))
		})
	}, [])

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
			onSuccess={() => {
				console.log('Query cache restored from MMKV')
			}}
		>
			{children}
		</PersistQueryClientProvider>
	)
}
