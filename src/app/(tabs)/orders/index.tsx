import { TouchableOpacity, View } from 'react-native'

import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import Head from 'expo-router/head'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'
import { H2, H3, Paragraph, Text } from '@/components/Text'
import { selfQueryOptions } from '@/lib/queries/auth'
import { useCurrentOrder, useOrderStats } from '@/lib/stores/order-store'

import type { Order } from '@/lib/stores/order-store'

const handleSignIn = () => {
	router.push('/sign-in')
}

const handleOrderPress = (order: Order) => {
	router.push(`/(tabs)/orders/${order.id}`)
}

export default function Orders() {
	const { data: user } = useQuery(selfQueryOptions)
	const isAuthenticated = Boolean(user)
	const { t } = useLingui()
	const currentOrder = useCurrentOrder()
	const { totalItems } = useOrderStats()

	const handleCurrentOrderPress = () => {
		if (currentOrder) {
			router.push(`/(tabs)/orders/current`)
		}
	}

	const renderOrderItem = ({ item }: { item: Order }) => (
		<TouchableOpacity
			onPress={() => handleOrderPress(item)}
			style={styles.orderCard}
		>
			<View style={styles.orderHeader}>
				<H3>
					<Trans>Order #{item.id.slice(-6)}</Trans>
				</H3>
				<Text style={styles.orderStatus}>
					{item.status === 'draft' && <Trans>Draft</Trans>}
					{item.status === 'submitted' && <Trans>Submitted</Trans>}
					{item.status === 'confirmed' && <Trans>Confirmed</Trans>}
					{item.status === 'completed' && <Trans>Completed</Trans>}
					{item.status === 'cancelled' && <Trans>Cancelled</Trans>}
				</Text>
			</View>
			<Paragraph style={styles.orderItems}>
				<Trans>{item.products.length} items</Trans>
			</Paragraph>
			<Paragraph>
				{item.totalAmount > 0
					? `$${item.totalAmount.toFixed(2)}`
					: t`Total calculated at checkout`}
			</Paragraph>
			<Paragraph style={styles.orderDate}>
				{new Date(item.createdAt).toLocaleDateString()}
			</Paragraph>
		</TouchableOpacity>
	)

	if (!isAuthenticated) {
		return (
			<>
				<Head>
					<title>{t`Orders`}</title>
				</Head>
				<ScreenContainer noScroll>
					<View style={styles.signInContainer}>
						<H2 style={styles.signInTitle}>
							<Trans>Sign In Required</Trans>
						</H2>
						<Paragraph style={styles.signInSubtitle}>
							<Trans>Please sign in to view your order history</Trans>
						</Paragraph>
						<Button onPress={handleSignIn}>
							<Trans>Sign In</Trans>
						</Button>
					</View>
				</ScreenContainer>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>{t`Orders`}</title>
			</Head>
			<ScreenContainer contentContainerStyle={styles.container}>
				<View style={styles.header}>
					{user?.firstname && (
						<Paragraph style={styles.subtitle}>
							<Trans>Welcome back, {user.firstname}!</Trans>
						</Paragraph>
					)}
				</View>

				{/* Current Order in Progress */}
				{currentOrder && (
					<View style={styles.currentOrderSection}>
						<H2 style={styles.sectionTitle}>
							<Trans>In Progress</Trans>
						</H2>
						<TouchableOpacity
							onPress={handleCurrentOrderPress}
							style={styles.currentOrderCard}
						>
							<View style={styles.orderHeader}>
								<H3 style={styles.currentOrderTitle}>
									<Trans>Current Order</Trans>
								</H3>
								<Text style={styles.orderBadge}>
									<Trans>{totalItems} items</Trans>
								</Text>
							</View>
							<Paragraph style={styles.currentOrderText}>
								<Trans>Total calculated at checkout</Trans>
							</Paragraph>
							<Paragraph style={styles.tapToEdit}>
								<Trans>Tap to view and edit</Trans>
							</Paragraph>
						</TouchableOpacity>
					</View>
				)}

				{/* Order History */}
				<View style={styles.ordersContainer}>
					{currentOrder ? (
						<>
							<H2 style={styles.sectionTitle}>
								<Trans>Order History</Trans>
							</H2>
							{renderOrderItem({ item: currentOrder })}
						</>
					) : (
						<>
							<H3 style={styles.emptyState}>
								<Trans>No orders yet</Trans>
							</H3>
							<Paragraph style={styles.emptyStateSubtitle}>
								<Trans>Your order history will appear here</Trans>
							</Paragraph>
						</>
					)}
				</View>
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		padding: theme.layout.screenPadding,
	},
	currentOrderCard: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.lg,
	},
	currentOrderSection: {
		marginBottom: theme.spacing.xl,
	},
	currentOrderText: {
		color: theme.colors.surface,
	},
	currentOrderTitle: {
		color: theme.colors.surface,
	},
	emptyState: {
		textAlign: 'center',
	},
	emptyStateSubtitle: {
		opacity: 0.6,
		textAlign: 'center',
	},
	header: {
		marginBottom: theme.spacing.xl,
	},
	orderBadge: {
		color: theme.colors.surface,
		opacity: 0.9,
	},
	orderCard: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.md,
		padding: theme.spacing.lg,
	},
	orderDate: {
		color: theme.colors.textSecondary,
		marginTop: theme.spacing.xs,
	},
	orderHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: theme.spacing.sm,
	},
	orderItems: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
	},
	ordersContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingVertical: theme.spacing.xxl,
	},
	ordersList: {
		paddingBottom: theme.spacing.xl,
	},
	orderStatus: {
		color: theme.colors.primary,
	},
	sectionTitle: {
		marginBottom: theme.spacing.md,
	},
	signInContainer: {
		alignItems: 'center',
		flex: 1,
		gap: theme.spacing.md,
		justifyContent: 'center',
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.xxl,
	},
	signInSubtitle: {
		color: theme.colors.textSecondary,
		textAlign: 'center',
	},
	signInTitle: {
		textAlign: 'center',
	},
	subtitle: {
		color: theme.colors.textSecondary,
	},
	tapToEdit: {
		color: theme.colors.surface,
		marginTop: theme.spacing.xs,
		opacity: 0.8,
	},
}))
