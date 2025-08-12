import { Platform } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import { useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'

import Tabs from '@/components/Tabs'
import { Colors } from '@/lib/constants/colors'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'
import { useOrderStats } from '@/lib/stores/order-store'

export default function TabLayout() {
	const colorScheme = useColorScheme()
	const { t } = useLingui()
	const { totalItems } = useOrderStats()

	return (
		<>
			<Head>
				<meta content="true" property="expo:handoff" />
			</Head>
			<Tabs
				screenOptions={{
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore - bottom-tabs library has incomplete type definitions
					headerShown: false,
					minimizeBehavior: 'automatic',
					tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				}}
			>
				<Tabs.Screen
					name="(home)"
					options={{
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore - bottom-tabs library has incomplete type definitions
						tabBarIcon: ({ focused }: { focused: boolean }) => {
							if (Platform.OS === 'ios') {
								return { sfSymbol: 'house' }
							}

							return (
								<Ionicons
									color={
										focused
											? Colors[colorScheme ?? 'light'].tint
											: Colors[colorScheme ?? 'light'].tabIconDefault
									}
									name={focused ? 'restaurant' : 'restaurant-outline'}
									size={24}
								/>
							)
						},
						title: t`Home`,
					}}
				/>
				<Tabs.Screen
					name="orders"
					options={{
						tabBarBadge: totalItems > 0 ? totalItems.toString() : undefined,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore - bottom-tabs library has incomplete type definitions
						tabBarIcon({ focused }: { focused: boolean }) {
							if (Platform.OS === 'ios') {
								return { sfSymbol: 'bag' }
							}

							return (
								<Ionicons
									color={
										focused
											? Colors[colorScheme ?? 'light'].tint
											: Colors[colorScheme ?? 'light'].tabIconDefault
									}
									name={focused ? 'receipt' : 'receipt-outline'}
									size={24}
								/>
							)
						},
						title: t`Orders`,
					}}
				/>
				<Tabs.Screen
					name="more"
					options={{
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore - bottom-tabs library has incomplete type definitions
						tabBarIcon: ({ focused }: { focused: boolean }) => {
							if (Platform.OS === 'ios') {
								return { sfSymbol: 'ellipsis' }
							}
							return (
								<Ionicons
									color={
										focused
											? Colors[colorScheme ?? 'light'].tint
											: Colors[colorScheme ?? 'light'].tabIconDefault
									}
									name="ellipsis-horizontal"
									size={24}
								/>
							)
						},
						title: t`More`,
					}}
				/>
			</Tabs>
		</>
	)
}
