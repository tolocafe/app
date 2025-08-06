import Tabs from '@/components/Tabs'
import { t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'

import { Colors } from '@/lib/constants/colors'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'

export default function TabLayout() {
	const colorScheme = useColorScheme()
	const { i18n } = useLingui()

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
			}}
		>
			<Tabs.Screen name="menu" options={{ title: t(i18n)`Menu` }} />
			<Tabs.Screen name="orders" options={{ title: t(i18n)`Orders` }} />
			<Tabs.Screen name="more" options={{ title: t(i18n)`More` }} />
		</Tabs>
	)
}
