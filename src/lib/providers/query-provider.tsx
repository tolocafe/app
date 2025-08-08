import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { AppStateStatus } from 'react-native'
import { AppState } from 'react-native'

import NetInfo from '@react-native-community/netinfo'
import { focusManager, onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

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
onlineManager.setEventListener((setOnline) =>
	NetInfo.addEventListener((state) => {
		setOnline(Boolean(state.isConnected))
	}),
)

type QueryProviderProps = {
	children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
	// Initialize online status on mount
	useEffect(() => {
		void NetInfo.fetch().then((state) => {
			onlineManager.setOnline(Boolean(state.isConnected))
		})
	}, [])

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			{children}
		</PersistQueryClientProvider>
	)
}
