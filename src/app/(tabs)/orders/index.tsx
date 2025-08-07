import { useMMKVString } from 'react-native-mmkv'
import { STORAGE_KEYS } from '@/lib/constants/storage'
import { useQuery } from '@tanstack/react-query'
import { userProfileQueryOptions } from '@/lib/queries/auth'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { router } from 'expo-router'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function Orders() {
	const [token] = useMMKVString(STORAGE_KEYS.AUTH_SESSION)
	const isAuthenticated = Boolean(token)
	const { data: user } = useQuery(userProfileQueryOptions)
	const { t } = useLingui()

	const handleSignIn = () => {
		router.push('/sign-in')
	}

	if (!isAuthenticated) {
		return (
			<>
				<Head>
					<title>{t`Orders`}</title>
				</Head>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={styles.container}
				>
					<View style={styles.signInContainer}>
						<Text style={styles.signInTitle}>
							<Trans>Sign In Required</Trans>
						</Text>
						<Text style={styles.signInSubtitle}>
							<Trans>Please sign in to view your order history</Trans>
						</Text>
						<TouchableOpacity
							style={styles.signInButton}
							onPress={handleSignIn}
						>
							<Text style={styles.signInButtonText}>
								<Trans>Sign In</Trans>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>{t`Orders`}</title>
			</Head>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.container}
			>
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
	signInContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: theme.spacing.xxl,
		paddingHorizontal: theme.spacing.lg,
	},
	signInTitle: {
		fontSize: theme.fontSizes.xl,
		fontWeight: theme.fontWeights.bold,
		textAlign: 'center',
		marginBottom: theme.spacing.md,
		color: theme.colors.text,
	},
	signInSubtitle: {
		fontSize: theme.fontSizes.md,
		textAlign: 'center',
		opacity: 0.7,
		marginBottom: theme.spacing.xl,
		color: theme.colors.text,
		lineHeight: theme.fontSizes.xl,
	},
	signInButton: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.xl,
		borderRadius: theme.borderRadius.md,
		minWidth: 120,
		alignItems: 'center',
	},
	signInButtonText: {
		color: theme.colors.surface,
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.semibold,
	},
}))
