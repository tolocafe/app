import { useEffect } from 'react'
import { Platform } from 'react-native'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import 'react-native-reanimated'
import { Stack, useNavigationContainerRef } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { LanguageProvider } from '@/lib/contexts/language-context'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'
import { useUpdates } from '@/lib/hooks/use-updates'
import { QueryProvider } from '@/lib/providers/query-provider'

const navigationIntegration = Sentry.reactNavigationIntegration({
	enableTimeToInitialDisplay: true,
})

export const unstable_settings = {
	initialRouteName: '(tabs)',
}

function RootLayout() {
	const colorScheme = useColorScheme()
	const ref = useNavigationContainerRef()
	const updates = useUpdates()

	useEffect(() => {
		navigationIntegration.registerNavigationContainer(ref)
	}, [ref])

	// Capture update errors to Sentry instead of console logs
	useEffect(() => {
		if (updates.error) {
			Sentry.captureMessage('Update process completed with error', {
				extra: {
					channel: updates.channel,
					error: updates.error,
					runtimeVersion: updates.runtimeVersion,
					updateId: updates.updateId,
				},
				level: 'error',
				tags: {
					feature: 'expo-updates',
					operation: 'updateStatus',
				},
			})
		}
	}, [updates.channel, updates.error, updates.runtimeVersion, updates.updateId])

	return (
		<QueryProvider>
			<KeyboardProvider statusBarTranslucent={Platform.OS === 'android'}>
				<LanguageProvider>
					<I18nProvider i18n={i18n}>
						<ThemeProvider
							value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
						>
							<StatusBar style="auto" />
							<Stack>
								<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
								<Stack.Screen name="+not-found" />
								<Stack.Screen
									name="sign-in"
									options={{
										animation: Platform.select({
											default: undefined,
											web: 'fade',
										}),
										presentation: Platform.select({
											default: 'modal',
											web: 'transparentModal',
										}),
									}}
								/>
							</Stack>
						</ThemeProvider>
					</I18nProvider>
				</LanguageProvider>
			</KeyboardProvider>
		</QueryProvider>
	)
}

export default Sentry.wrap(RootLayout)
