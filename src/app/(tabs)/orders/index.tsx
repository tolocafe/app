import { useAuth } from '@/lib/hooks/use-auth'
import NotSignedIn from '@/components/NotSignedIn'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { Text, View, ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Colors } from '@/lib/constants/colors'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'

export default function Orders() {
	const { isAuthenticated, user } = useAuth()
	const { t } = useLingui()
	const colorScheme = useColorScheme()

	if (!isAuthenticated) {
		return <NotSignedIn />
	}

	return (
		<>
			<Head>
				<title>{t`Orders`}</title>
			</Head>
			<ScrollView
				style={[
					styles.container,
					{ backgroundColor: Colors[colorScheme ?? 'light'].background },
				]}
			>
				<View style={styles.header}>
					<Text
						style={[
							styles.title,
							{ color: Colors[colorScheme ?? 'light'].text },
						]}
					>
						<Trans>Your Orders</Trans>
					</Text>
					{user?.fullName && (
						<Text
							style={[
								styles.subtitle,
								{ color: Colors[colorScheme ?? 'light'].text },
							]}
						>
							<Trans>Welcome back, {user.fullName}!</Trans>
						</Text>
					)}
				</View>

				<View style={styles.ordersContainer}>
					<Text
						style={[
							styles.emptyState,
							{ color: Colors[colorScheme ?? 'light'].text },
						]}
					>
						<Trans>No orders yet</Trans>
					</Text>
					<Text
						style={[
							styles.emptyStateSubtitle,
							{ color: Colors[colorScheme ?? 'light'].text },
						]}
					>
						<Trans>Your order history will appear here</Trans>
					</Text>
				</View>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		marginBottom: 32,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.8,
	},
	ordersContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
	},
	emptyState: {
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 8,
	},
	emptyStateSubtitle: {
		fontSize: 14,
		textAlign: 'center',
		opacity: 0.6,
	},
}))
