import { useAuth } from '@/lib/hooks/use-auth'
import NotSignedIn from '@/components/NotSignedIn'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { Text, View, ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function Orders() {
	const { isAuthenticated, user } = useAuth()
	const { t } = useLingui()

	if (!isAuthenticated) {
		return <NotSignedIn />
	}

	return (
		<>
			<Head>
				<title>{t`Orders`}</title>
			</Head>
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>
						<Trans>Your Orders</Trans>
					</Text>
					{user?.fullName && (
						<Text style={styles.subtitle}>
							<Trans>Welcome back, {user.fullName}!</Trans>
						</Text>
					)}
				</View>

				<View style={styles.ordersContainer}>
					<Text style={styles.emptyState}>
						<Trans>No orders yet</Trans>
					</Text>
					<Text style={styles.emptyStateSubtitle}>
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
		padding: theme.spacing.lg,
		backgroundColor: theme.colors.background,
	},
	header: {
		marginBottom: theme.spacing.xl,
	},
	title: {
		fontSize: theme.fontSizes.xxxl,
		fontWeight: theme.fontWeights.bold,
		marginBottom: theme.spacing.sm,
		color: theme.colors.text,
	},
	subtitle: {
		fontSize: theme.fontSizes.md,
		opacity: 0.8,
		color: theme.colors.text,
	},
	ordersContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: theme.spacing.xxl,
	},
	emptyState: {
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.semibold,
		textAlign: 'center',
		marginBottom: theme.spacing.sm,
		color: theme.colors.text,
	},
	emptyStateSubtitle: {
		fontSize: theme.fontSizes.sm,
		textAlign: 'center',
		opacity: 0.6,
		color: theme.colors.text,
	},
}))
