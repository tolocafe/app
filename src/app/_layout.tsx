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
import 'react-native-reanimated'

import { LanguageProvider } from '@/contexts/LanguageContext'
import { useColorScheme } from '@/hooks/useColorScheme'
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

  return (
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
  )
}

export default Sentry.wrap(RootLayout)
