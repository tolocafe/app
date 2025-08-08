import { FlatList, TouchableOpacity, View } from 'react-native'
import { Text, H2, H3, Paragraph } from '@/components/Text'
import { useQuery } from '@tanstack/react-query'
import { selfQueryOptions } from '@/lib/queries/auth'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { router } from 'expo-router'

import { StyleSheet } from 'react-native-unistyles'
import { useOrderData, useOrderStats } from '@/lib/stores/order-store'
import type { Order } from '@/lib/stores/order-store'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

export default function Orders() {
	const { data: user } = useQuery(selfQueryOptions)
	const isAuthenticated = Boolean(user)
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
				<Trans>{item.items.length} items</Trans>
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
				<ScreenContainer>
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
							style={styles.currentOrderCard}
							onPress={handleCurrentOrderPress}
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
					{orders.length > 0 ? (
						<>
							<H2 style={styles.sectionTitle}>
								<Trans>Order History</Trans>
							</H2>
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
	header: {
		marginBottom: theme.spacing.xl,
	},
	subtitle: {
		opacity: 0.8,
	},
	ordersContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: theme.spacing.xxl,
	},
	emptyState: {
		textAlign: 'center',
	},
	emptyStateSubtitle: {
		textAlign: 'center',
		opacity: 0.6,
	},
	signInContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: theme.spacing.xxl,
		paddingHorizontal: theme.spacing.lg,
	},
	signInTitle: {
		textAlign: 'center',
		marginBottom: theme.spacing.md,
	},
	signInSubtitle: {
		textAlign: 'center',
		opacity: 0.7,
		marginBottom: theme.spacing.xl,
		lineHeight: theme.fontSizes.xl,
	},
	currentOrderSection: {
		marginBottom: theme.spacing.xl,
	},
	sectionTitle: {
		marginBottom: theme.spacing.md,
	},
	currentOrderCard: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.lg,
	},
	currentOrderTitle: {
		color: theme.colors.surface,
	},
	orderBadge: {
		color: theme.colors.surface,
		opacity: 0.9,
	},
	tapToEdit: {
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
	},
	orderHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.sm,
	},
	orderStatus: {
		color: theme.colors.primary,
	},
	orderItems: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
	},
	orderDate: {
		color: theme.colors.textSecondary,
		marginTop: theme.spacing.xs,
	},
	currentOrderText: {
		color: theme.colors.surface,
	},
}))
