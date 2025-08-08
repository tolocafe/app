import { useState, useEffect } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { router, useLocalSearchParams } from 'expo-router'
import { View, TouchableOpacity, TextInput, Alert } from 'react-native'
import { Text, H2, Paragraph } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
	useOrderData,
	useUpdateItem,
	useRemoveItem,
	useSetCustomerNote,
	useSubmitOrder,
	useClearOrder,
} from '@/lib/stores/order-store'
import type { Order, OrderItem } from '@/lib/stores/order-store'
import { productQueryOptions } from '@/lib/queries/product'
import Ionicons from '@expo/vector-icons/Ionicons'
import { selfQueryOptions } from '@/lib/queries/auth'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

export default function OrderDetail() {
	const { t } = useLingui()
	const { id, current } = useLocalSearchParams<{
		id: string
		current?: string
	}>()
	const { currentOrder, orders } = useOrderData()
	const updateItem = useUpdateItem()
	const removeItem = useRemoveItem()
	const setCustomerNote = useSetCustomerNote()
	const submitOrder = useSubmitOrder()
	const clearOrder = useClearOrder()
	const queryClient = useQueryClient()
	const { data: user } = useQuery(selfQueryOptions)

	// Helpers to get product details from query cache
	const getProductName = (productId: string): string => {
		const productData = queryClient.getQueryData(
			productQueryOptions(productId).queryKey,
		)
		return productData?.response?.product_name || `Product ID: ${productId}`
	}

	const getProductCategory = (productId: string): string | null => {
		const productData = queryClient.getQueryData(
			productQueryOptions(productId).queryKey,
		)
		return productData?.response?.category_name || null
	}

	const getProductPrice = (productId: string): string | null => {
		const productData = queryClient.getQueryData(
			productQueryOptions(productId).queryKey,
		)
		const product = productData?.response
		if (!product) return null
		const priceRaw = Object.values(product.price)[0] || '0'
		return `$${parseFloat(priceRaw).toFixed(2)}`
	}

	const [customerNote, setCustomerNoteLocal] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isCurrentOrder = current === 'true'
	const order: Order | undefined = isCurrentOrder
		? (currentOrder ?? undefined)
		: orders.find((o) => o.id === id)

	useEffect(() => {
		if (order?.customerNote) {
			setCustomerNoteLocal(order.customerNote)
		}
	}, [order?.customerNote])

	const handleQuantityChange = (productId: string, quantity: number) => {
		if (!isCurrentOrder) return
		updateItem(productId, quantity)
	}

	const handleRemoveItem = (productId: string) => {
		if (!isCurrentOrder) return
		removeItem(productId)
	}

	const handleNoteChange = (note: string) => {
		setCustomerNoteLocal(note)
		if (isCurrentOrder) {
			setCustomerNote(note)
		}
	}

	const handleSubmitOrder = async () => {
		if (!order || !isCurrentOrder) return

		try {
			setIsSubmitting(true)
			await submitOrder()
			Alert.alert(
				t`Order Submitted`,
				t`Your order has been submitted successfully!`,
				[
					{
						text: t`OK`,
						onPress: () => router.replace('/(tabs)/orders'),
					},
				],
			)
		} catch {
			Alert.alert(t`Error`, t`Failed to submit order. Please try again.`)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleClearOrder = () => {
		if (!isCurrentOrder) return

		Alert.alert(
			t`Clear Order`,
			t`Are you sure you want to clear this order? This action cannot be undone.`,
			[
				{ text: t`Cancel`, style: 'cancel' },
				{
					text: t`Clear`,
					style: 'destructive',
					onPress: () => {
						clearOrder()
						router.back()
					},
				},
			],
		)
	}

	const renderOrderItem = (item: OrderItem, index: number) => (
		<View key={`${item.productId}-${index}`} style={styles.orderItem}>
			<View style={styles.itemHeader}>
				<Paragraph style={styles.itemName}>
					{getProductName(item.productId)}
				</Paragraph>
				{isCurrentOrder && (
					<TouchableOpacity
						onPress={() => handleRemoveItem(item.productId)}
						style={styles.removeButton}
					>
						<Ionicons name="trash-outline" size={20} color="#ff4444" />
					</TouchableOpacity>
				)}
			</View>

			<View style={styles.itemDetails}>
				<View style={styles.quantityContainer}>
					{isCurrentOrder ? (
						<>
							<TouchableOpacity
								onPress={() =>
									handleQuantityChange(item.productId, item.quantity - 1)
								}
								style={styles.quantityButton}
								disabled={item.quantity <= 1}
							>
								<Ionicons
									name="remove"
									size={20}
									color={item.quantity <= 1 ? '#ccc' : '#333'}
								/>
							</TouchableOpacity>
							<Text style={styles.quantity}>{item.quantity}</Text>
							<TouchableOpacity
								onPress={() =>
									handleQuantityChange(item.productId, item.quantity + 1)
								}
								style={styles.quantityButton}
							>
								<Ionicons name="add" size={20} color="#333" />
							</TouchableOpacity>
						</>
					) : (
						<Paragraph style={styles.quantityLabel}>
							<Trans>Qty: {item.quantity}</Trans>
						</Paragraph>
					)}
				</View>
				<Paragraph style={styles.itemPrice}>
					{getProductPrice(item.productId) ?? t`Unavailable`}
				</Paragraph>
			</View>

			{getProductCategory(item.productId) && (
				<Paragraph style={styles.itemMeta}>
					{getProductCategory(item.productId)}
				</Paragraph>
			)}

			{item.modifications && item.modifications.length > 0 && (
				<View style={styles.modifications}>
					{item.modifications.map((mod, modIndex) => (
						<Paragraph key={modIndex} style={styles.modificationText}>
							+ {mod.name} (+${mod.price.toFixed(2)})
						</Paragraph>
					))}
				</View>
			)}
		</View>
	)

	if (!order) {
		return (
			<>
				<Head>
					<title>{t`Order Not Found`}</title>
				</Head>
				<View style={styles.container}>
					<View style={styles.emptyContainer}>
						<Paragraph style={styles.emptyText}>
							<Trans>The requested order could not be found.</Trans>
						</Paragraph>
					</View>
				</View>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>
					{isCurrentOrder ? t`Current Order` : t`Order #${order.id.slice(-6)}`}
				</title>
			</Head>
			<ScreenContainer>
				<View style={styles.orderInfo}>
					<Paragraph style={styles.orderDate}>
						{new Date(order.createdAt).toLocaleDateString()}
					</Paragraph>
					<Paragraph style={styles.orderStatus}>
						{order.status === 'draft' && <Trans>Draft</Trans>}
						{order.status === 'submitted' && <Trans>Submitted</Trans>}
						{order.status === 'confirmed' && <Trans>Confirmed</Trans>}
						{order.status === 'completed' && <Trans>Completed</Trans>}
						{order.status === 'cancelled' && <Trans>Cancelled</Trans>}
					</Paragraph>
				</View>
				{user && (
					<View style={styles.walletBar}>
						<Paragraph style={styles.walletLabel}>
							<Trans>Wallet Balance</Trans>
						</Paragraph>
						<Paragraph style={styles.walletValue}>
							${(Number(user.ewallet ?? '0') / 100).toFixed(2)}
						</Paragraph>
					</View>
				)}

				<View style={styles.itemsSection}>
					<H2 style={styles.sectionTitle}>
						<Trans>Order Items</Trans>
					</H2>
					{order.items.map(renderOrderItem)}
				</View>

				<View style={styles.noteSection}>
					<H2 style={styles.sectionTitle}>
						<Trans>Customer Note</Trans>
					</H2>
					<TextInput
						style={styles.noteInput}
						multiline
						numberOfLines={3}
						value={customerNote}
						onChangeText={handleNoteChange}
						placeholder={t`Add any special instructions...`}
						editable={isCurrentOrder}
					/>
				</View>

				<View style={styles.totalSection}>
					<View style={styles.totalRow}>
						<Paragraph style={styles.totalLabel}>
							<Trans>Total</Trans>
						</Paragraph>
						<Paragraph style={styles.totalAmount}>
							<Trans>Calculated at checkout</Trans>
						</Paragraph>
					</View>
				</View>

				{isCurrentOrder && (
					<View style={styles.actionButtons}>
						<Button onPress={handleClearOrder} variant="surface">
							<Trans>Clear Order</Trans>
						</Button>

						<Button
							onPress={handleSubmitOrder}
							disabled={isSubmitting || order.items.length === 0}
						>
							{isSubmitting ? (
								<Trans>Submitting...</Trans>
							) : (
								<Trans>Submit Order</Trans>
							)}
						</Button>
					</View>
				)}
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
	},
	orderInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.layout.screenPadding,
	},
	orderDate: {
		color: theme.colors.textSecondary,
	},
	orderStatus: {
		color: theme.colors.primary,
	},
	walletBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.layout.screenPadding,
		paddingVertical: theme.spacing.sm,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: theme.colors.border,
		backgroundColor: theme.colors.surface,
	},
	walletLabel: {
		color: theme.colors.textSecondary,
	},
	walletValue: {
		color: theme.colors.primary,
		fontWeight: theme.fontWeights.semibold,
	},
	itemsSection: {
		padding: theme.layout.screenPadding,
	},
	sectionTitle: {
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.semibold,
		marginBottom: theme.spacing.md,
		color: theme.colors.text,
	},
	orderItem: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.md,
	},
	itemHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.sm,
	},
	itemName: {
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.medium,
		color: theme.colors.text,
		flex: 1,
	},
	removeButton: {
		padding: theme.spacing.xs,
	},
	itemDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	itemMeta: {
		marginTop: theme.spacing.xs,
		color: theme.colors.textSecondary,
	},
	quantityContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	quantityButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: theme.colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	quantity: {
		marginHorizontal: theme.spacing.md,
		minWidth: 30,
		textAlign: 'center',
		color: theme.colors.text,
	},
	quantityLabel: {
		color: theme.colors.textSecondary,
	},
	itemPrice: {
		color: theme.colors.text,
	},
	modifications: {
		marginTop: theme.spacing.sm,
		paddingTop: theme.spacing.sm,
		borderTopWidth: 1,
		borderTopColor: theme.colors.border,
	},
	modificationText: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
	},
	noteSection: {
		padding: theme.layout.screenPadding,
	},
	noteInput: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.md,
		fontSize: theme.fontSizes.md,
		color: theme.colors.text,
		borderWidth: 1,
		borderColor: theme.colors.border,
		minHeight: 80,
		textAlignVertical: 'top',
	},
	totalSection: {
		padding: theme.layout.screenPadding,
		borderTopWidth: 1,
		borderTopColor: theme.colors.border,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	totalLabel: {
		color: theme.colors.text,
	},
	totalAmount: {
		color: theme.colors.primary,
	},
	actionButtons: {
		flexDirection: 'row',
		padding: theme.layout.screenPadding,
		gap: theme.spacing.md,
	},

	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.xl,
	},
	emptyText: {
		color: theme.colors.textSecondary,
		textAlign: 'center',
	},
}))
