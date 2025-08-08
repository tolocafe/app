import { useEffect, useState } from 'react'
import { Alert, TextInput, TouchableOpacity, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'
import { H2, Paragraph, Text } from '@/components/Text'
import { selfQueryOptions } from '@/lib/queries/auth'
import { productQueryOptions } from '@/lib/queries/product'
import {
	useClearOrder,
	useOrderData,
	useRemoveItem,
	useSetCustomerNote,
	useSubmitOrder,
	useUpdateItem,
} from '@/lib/stores/order-store'

import type { Order, OrderItem } from '@/lib/stores/order-store'

export default function OrderDetail() {
	const { t } = useLingui()
	const { current, id } = useLocalSearchParams<{
		current?: string
		id: string
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
		return productData?.response.product_name || `Product ID: ${productId}`
	}

	const getProductCategory = (productId: string): null | string => {
		const productData = queryClient.getQueryData(
			productQueryOptions(productId).queryKey,
		)
		return productData?.response.category_name || null
	}

	const getProductPrice = (productId: string): null | string => {
		const productData = queryClient.getQueryData(
			productQueryOptions(productId).queryKey,
		)
		const product = productData?.response
		if (!product) return null
		const priceRaw = Object.values(product.price)[0] || '0'
		return `$${Number.parseFloat(priceRaw).toFixed(2)}`
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
						onPress: () => router.replace('/(tabs)/orders'),
						text: t`OK`,
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
				{ style: 'cancel', text: t`Cancel` },
				{
					onPress: () => {
						clearOrder()
						router.back()
					},
					style: 'destructive',
					text: t`Clear`,
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
						<Ionicons color="#ff4444" name="trash-outline" size={20} />
					</TouchableOpacity>
				)}
			</View>

			<View style={styles.itemDetails}>
				<View style={styles.quantityContainer}>
					{isCurrentOrder ? (
						<>
							<TouchableOpacity
								disabled={item.quantity <= 1}
								onPress={() =>
									handleQuantityChange(item.productId, item.quantity - 1)
								}
								style={styles.quantityButton}
							>
								<Ionicons
									color={item.quantity <= 1 ? '#ccc' : '#333'}
									name="remove"
									size={20}
								/>
							</TouchableOpacity>
							<Text style={styles.quantity}>{item.quantity}</Text>
							<TouchableOpacity
								onPress={() =>
									handleQuantityChange(item.productId, item.quantity + 1)
								}
								style={styles.quantityButton}
							>
								<Ionicons color="#333" name="add" size={20} />
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
					{item.modifications.map((module_, moduleIndex) => (
						<Paragraph key={moduleIndex} style={styles.modificationText}>
							+ {module_.name} (+${module_.price.toFixed(2)})
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
					{order.items.map((item, index) => renderOrderItem(item, index))}
				</View>

				<View style={styles.noteSection}>
					<H2 style={styles.sectionTitle}>
						<Trans>Customer Note</Trans>
					</H2>
					<TextInput
						editable={isCurrentOrder}
						multiline
						numberOfLines={3}
						onChangeText={handleNoteChange}
						placeholder={t`Add any special instructions...`}
						style={styles.noteInput}
						value={customerNote}
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
							disabled={isSubmitting || order.items.length === 0}
							onPress={handleSubmitOrder}
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
	actionButtons: {
		flexDirection: 'row',
		gap: theme.spacing.md,
		padding: theme.layout.screenPadding,
	},
	container: {
		flex: 1,
	},
	emptyContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		padding: theme.spacing.xl,
	},
	emptyText: {
		color: theme.colors.textSecondary,
		textAlign: 'center',
	},
	itemDetails: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	itemHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: theme.spacing.sm,
	},
	itemMeta: {
		color: theme.colors.textSecondary,
		marginTop: theme.spacing.xs,
	},
	itemName: {
		color: theme.colors.text,
		flex: 1,
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.medium,
	},
	itemPrice: {
		color: theme.colors.text,
	},
	itemsSection: {
		padding: theme.layout.screenPadding,
	},
	modifications: {
		borderTopColor: theme.colors.border,
		borderTopWidth: 1,
		marginTop: theme.spacing.sm,
		paddingTop: theme.spacing.sm,
	},
	modificationText: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
	},
	noteInput: {
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		color: theme.colors.text,
		fontSize: theme.fontSizes.md,
		minHeight: 80,
		padding: theme.spacing.md,
		textAlignVertical: 'top',
	},
	noteSection: {
		padding: theme.layout.screenPadding,
	},
	orderDate: {
		color: theme.colors.textSecondary,
	},
	orderInfo: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: theme.layout.screenPadding,
	},
	orderItem: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.md,
		padding: theme.spacing.md,
	},
	orderStatus: {
		color: theme.colors.primary,
	},
	quantity: {
		color: theme.colors.text,
		marginHorizontal: theme.spacing.md,
		minWidth: 30,
		textAlign: 'center',
	},
	quantityButton: {
		alignItems: 'center',
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: 16,
		borderWidth: 1,
		height: 32,
		justifyContent: 'center',
		width: 32,
	},
	quantityContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	quantityLabel: {
		color: theme.colors.textSecondary,
	},
	removeButton: {
		padding: theme.spacing.xs,
	},
	sectionTitle: {
		color: theme.colors.text,
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.semibold,
		marginBottom: theme.spacing.md,
	},
	totalAmount: {
		color: theme.colors.primary,
	},
	totalLabel: {
		color: theme.colors.text,
	},
	totalRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	totalSection: {
		borderTopColor: theme.colors.border,
		borderTopWidth: 1,
		padding: theme.layout.screenPadding,
	},
	walletBar: {
		alignItems: 'center',
		backgroundColor: theme.colors.surface,
		borderBottomWidth: 1,
		borderColor: theme.colors.border,
		borderTopWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: theme.layout.screenPadding,
		paddingVertical: theme.spacing.sm,
	},

	walletLabel: {
		color: theme.colors.textSecondary,
	},
	walletValue: {
		color: theme.colors.primary,
		fontWeight: theme.fontWeights.semibold,
	},
}))
