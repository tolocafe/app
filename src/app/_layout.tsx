import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import { Stack, useNavigationContainerRef } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Updates from 'expo-updates'
import 'react-native-reanimated'

import { LanguageProvider } from '@/lib/contexts/language-context'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'
import { QueryProvider } from '@/lib/providers/query-provider'
import { checkForUpdates } from '@/lib/updates'
import { useEffect } from 'react'

const navigationIntegration = Sentry.reactNavigationIntegration({
	enableTimeToInitialDisplay: true,
})

function RootLayout() {
	const colorScheme = useColorScheme()
	const ref = useNavigationContainerRef()

	useEffect(() => {
		if (ref) {
			navigationIntegration.registerNavigationContainer(ref)
		}
	}, [ref])

	useEffect(() => {
		checkForUpdates()
	}, [])

	return (
		<QueryProvider>
			<LanguageProvider>
				<I18nProvider i18n={i18n}>
					<ThemeProvider
						value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
					>
						<StatusBar style="auto" />
						<Stack>
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
							<Stack.Screen name="+not-found" />
						</Stack>
					</ThemeProvider>
				</I18nProvider>
			</LanguageProvider>
		</QueryProvider>
	)
}

export default Sentry.wrap(RootLayout)
