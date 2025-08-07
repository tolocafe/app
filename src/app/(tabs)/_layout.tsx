import Tabs from '@/components/Tabs'
import { useLingui } from '@lingui/react/macro'
import Ionicons from '@expo/vector-icons/Ionicons'

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
				// @ts-ignore
				headerShown: false,
				minimizeBehavior: 'automatic',
			}}
		>
			<Tabs.Screen
				name="(menu)"
				options={{
					title: t`Menu`,

					// @ts-ignore
					tabBarIcon: ({ focused }: { focused: boolean }) => {
						if (Platform.OS === 'ios') {
							return { sfSymbol: 'house' }
						}
						return (
							<Ionicons
								name={focused ? 'restaurant' : 'restaurant-outline'}
								size={24}
								color={
									focused
										? Colors[colorScheme ?? 'light'].tint
										: Colors[colorScheme ?? 'light'].tabIconDefault
								}
							/>
						)
					},
				}}
			/>
			<Tabs.Screen
				name="orders"
				options={{
					title: t`Orders`,
					tabBarBadge: '1',
					// @ts-ignore
					tabBarIcon: ({ focused }: { focused: boolean }) => {
						if (Platform.OS === 'ios') {
							return { sfSymbol: 'bag' }
						}
						return (
							<Ionicons
								name={focused ? 'receipt' : 'receipt-outline'}
								size={24}
								color={
									focused
										? Colors[colorScheme ?? 'light'].tint
										: Colors[colorScheme ?? 'light'].tabIconDefault
								}
							/>
						)
					},
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: t`More`,
					// @ts-ignore
					tabBarIcon: ({ focused }: { focused: boolean }) => {
						if (Platform.OS === 'ios') {
							return { sfSymbol: 'ellipsis' }
						}
						return (
							<Ionicons
								name="ellipsis-horizontal"
								size={24}
								color={
									focused
										? Colors[colorScheme ?? 'light'].tint
										: Colors[colorScheme ?? 'light'].tabIconDefault
								}
							/>
						)
					},
				}}
			/>
		</Tabs>
	)
}
