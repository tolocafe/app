import Tabs from '@/components/Tabs'
import { useLingui } from '@lingui/react/macro'

import { Colors } from '@/lib/constants/colors'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'
import { Platform } from 'react-native'

export default function TabLayout() {
	const colorScheme = useColorScheme()
	const { t } = useLingui()

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				// @ts-ignore valid type
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="(menu)"
				options={{
					title: t`Menu`,
					tabBarIcon: Platform.select({
						ios: () => ({ sfSymbol: 'house' }),
					}),
				}}
			/>
			<Tabs.Screen
				name="orders"
				options={{
					title: t`Orders`,
					tabBarIcon: Platform.select({
						ios: () => ({ sfSymbol: 'bag' }),
					}),
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: t`More`,
					tabBarIcon: Platform.select({
						ios: () => ({ sfSymbol: 'ellipsis' }),
					}),
				}}
			/>
		</Tabs>
	)
}
