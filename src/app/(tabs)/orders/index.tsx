import { useMMKVString } from 'react-native-mmkv'
import { STORAGE_KEYS } from '@/lib/constants/storage'
import { useQuery } from '@tanstack/react-query'
import { userProfileQueryOptions } from '@/lib/queries/auth'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { router } from 'expo-router'
import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	FlatList,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useOrderData, useOrderStats } from '@/lib/stores/order-store'
import type { Order } from '@/lib/stores/order-store'

export default function Orders() {
	const [token] = useMMKVString(STORAGE_KEYS.AUTH_SESSION)
	const isAuthenticated = Boolean(token)
	const { data: user } = useQuery(userProfileQueryOptions)
	const { t } = useLingui()
	const { currentOrder, orders } = useOrderData()
	const { totalItems } = useOrderStats()

	const handleSignIn = () => {
		router.push('/sign-in')
	}

	const handleOrderPress = (order: Order) => {
		router.push(`/(tabs)/orders/${order.id}`)
	}

	const handleCurrentOrderPress = () => {
		if (currentOrder) {
			router.push(`/(tabs)/orders/${currentOrder.id}?current=true`)
		}
	}

	const renderOrderItem = ({ item }: { item: Order }) => (
		<TouchableOpacity
			style={styles.orderCard}
			onPress={() => handleOrderPress(item)}
		>
			<View style={styles.orderHeader}>
				<Text style={styles.orderNumber}>
					<Trans>Order #{item.id.slice(-6)}</Trans>
				</Text>
				<Text style={styles.orderStatus}>
					{item.status === 'draft' && <Trans>Draft</Trans>}
					{item.status === 'submitted' && <Trans>Submitted</Trans>}
					{item.status === 'confirmed' && <Trans>Confirmed</Trans>}
					{item.status === 'completed' && <Trans>Completed</Trans>}
					{item.status === 'cancelled' && <Trans>Cancelled</Trans>}
				</Text>
			</View>
			<Text style={styles.orderItems}>
				<Trans>{item.items.length} items</Trans>
			</Text>
			<Text style={styles.orderAmount}>
				{item.totalAmount > 0
					? `$${item.totalAmount.toFixed(2)}`
					: t`Total calculated at checkout`}
			</Text>
			<Text style={styles.orderDate}>
				{new Date(item.createdAt).toLocaleDateString()}
			</Text>
		</TouchableOpacity>
	)

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

				{/* Current Order in Progress */}
				{currentOrder && (
					<View style={styles.currentOrderSection}>
						<Text style={styles.sectionTitle}>
							<Trans>Order in Progress</Trans>
						</Text>
						<TouchableOpacity
							style={styles.currentOrderCard}
							onPress={handleCurrentOrderPress}
						>
							<View style={styles.orderHeader}>
								<Text style={styles.currentOrderTitle}>
									<Trans>Current Order</Trans>
								</Text>
								<Text style={styles.orderBadge}>
									<Trans>{totalItems} items</Trans>
								</Text>
							</View>
							<Text style={styles.orderAmount}>
								<Trans>Total calculated at checkout</Trans>
							</Text>
							<Text style={styles.tapToEdit}>
								<Trans>Tap to view and edit</Trans>
							</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Order History */}
				<View style={styles.ordersContainer}>
					{orders.length > 0 ? (
						<>
							<Text style={styles.sectionTitle}>
								<Trans>Order History</Trans>
							</Text>
							<FlatList
								data={orders}
								renderItem={renderOrderItem}
								keyExtractor={(item) => item.id}
								showsVerticalScrollIndicator={false}
								contentContainerStyle={styles.ordersList}
							/>
						</>
					) : (
						<>
							<Text style={styles.emptyState}>
								<Trans>No orders yet</Trans>
							</Text>
							<Text style={styles.emptyStateSubtitle}>
								<Trans>Your order history will appear here</Trans>
							</Text>
						</>
					)}
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
	currentOrderSection: {
		marginBottom: theme.spacing.xl,
	},
	sectionTitle: {
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.semibold,
		marginBottom: theme.spacing.md,
		color: theme.colors.text,
	},
	currentOrderCard: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.lg,
	},
	currentOrderTitle: {
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.surface,
	},
	orderBadge: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.surface,
		opacity: 0.9,
	},
	tapToEdit: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.surface,
		opacity: 0.8,
		marginTop: theme.spacing.xs,
	},
	ordersList: {
		paddingBottom: theme.spacing.xl,
	},
	orderCard: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.lg,
		marginBottom: theme.spacing.md,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	orderHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.sm,
	},
	orderNumber: {
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.text,
	},
	orderStatus: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.primary,
		fontWeight: theme.fontWeights.medium,
	},
	orderItems: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
	},
	orderAmount: {
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.primary,
		marginBottom: theme.spacing.xs,
	},
	orderDate: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.textSecondary,
		marginTop: theme.spacing.xs,
	},
}))
