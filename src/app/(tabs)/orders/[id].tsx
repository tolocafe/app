import { useState, useEffect } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { router, useLocalSearchParams } from 'expo-router'
import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Alert,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useQueryClient } from '@tanstack/react-query'
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

	// Helper function to get product name from cache
	const getProductName = (productId: string): string => {
		const productData = queryClient.getQueryData(
			productQueryOptions(productId).queryKey,
		)
		return productData?.response?.product_name || `Product ID: ${productId}`
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
				<Text style={styles.itemName}>{getProductName(item.productId)}</Text>
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
						<Text style={styles.quantityLabel}>
							<Trans>Qty: {item.quantity}</Trans>
						</Text>
					)}
				</View>
			</View>

			{item.modifications && item.modifications.length > 0 && (
				<View style={styles.modifications}>
					{item.modifications.map((mod, modIndex) => (
						<Text key={modIndex} style={styles.modificationText}>
							+ {mod.name} (+${mod.price.toFixed(2)})
						</Text>
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
						<Text style={styles.emptyText}>
							<Trans>The requested order could not be found.</Trans>
						</Text>
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
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.container}
			>
				<View style={styles.orderInfo}>
					<Text style={styles.orderDate}>
						{new Date(order.createdAt).toLocaleDateString()}
					</Text>
					<Text style={styles.orderStatus}>
						{order.status === 'draft' && <Trans>Draft</Trans>}
						{order.status === 'submitted' && <Trans>Submitted</Trans>}
						{order.status === 'confirmed' && <Trans>Confirmed</Trans>}
						{order.status === 'completed' && <Trans>Completed</Trans>}
						{order.status === 'cancelled' && <Trans>Cancelled</Trans>}
					</Text>
				</View>

				<View style={styles.itemsSection}>
					<Text style={styles.sectionTitle}>
						<Trans>Order Items</Trans>
					</Text>
					{order.items.map(renderOrderItem)}
				</View>

				<View style={styles.noteSection}>
					<Text style={styles.sectionTitle}>
						<Trans>Customer Note</Trans>
					</Text>
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
						<Text style={styles.totalLabel}>
							<Trans>Total</Trans>
						</Text>
						<Text style={styles.totalAmount}>
							<Trans>Calculated at checkout</Trans>
						</Text>
					</View>
				</View>

				{isCurrentOrder && (
					<View style={styles.actionButtons}>
						<TouchableOpacity
							onPress={handleClearOrder}
							style={styles.clearButton}
						>
							<Text style={styles.clearButtonText}>
								<Trans>Clear Order</Trans>
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleSubmitOrder}
							style={[
								styles.submitButton,
								(isSubmitting || order.items.length === 0) &&
									styles.submitButtonDisabled,
							]}
							disabled={isSubmitting || order.items.length === 0}
						>
							<Text style={styles.submitButtonText}>
								{isSubmitting ? (
									<Trans>Submitting...</Trans>
								) : (
									<Trans>Submit Order</Trans>
								)}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	orderInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.lg,
	},
	orderDate: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.textSecondary,
	},
	orderStatus: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.primary,
		fontWeight: theme.fontWeights.medium,
	},
	itemsSection: {
		padding: theme.spacing.lg,
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
		borderWidth: 1,
		borderColor: theme.colors.border,
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
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.medium,
		marginHorizontal: theme.spacing.md,
		minWidth: 30,
		textAlign: 'center',
		color: theme.colors.text,
	},
	quantityLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.textSecondary,
	},
	itemPrice: {
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.text,
	},
	modifications: {
		marginTop: theme.spacing.sm,
		paddingTop: theme.spacing.sm,
		borderTopWidth: 1,
		borderTopColor: theme.colors.border,
	},
	modificationText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
	},
	noteSection: {
		padding: theme.spacing.lg,
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
		padding: theme.spacing.lg,
		borderTopWidth: 1,
		borderTopColor: theme.colors.border,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	totalLabel: {
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.text,
	},
	totalAmount: {
		fontSize: theme.fontSizes.xl,
		fontWeight: theme.fontWeights.bold,
		color: theme.colors.primary,
	},
	actionButtons: {
		flexDirection: 'row',
		padding: theme.spacing.lg,
		gap: theme.spacing.md,
	},
	clearButton: {
		flex: 1,
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.md,
		paddingVertical: theme.spacing.md,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	clearButtonText: {
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.medium,
		color: theme.colors.text,
	},
	submitButton: {
		flex: 2,
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		paddingVertical: theme.spacing.md,
		alignItems: 'center',
	},
	submitButtonDisabled: {
		backgroundColor: theme.colors.textSecondary,
		opacity: 0.5,
	},
	submitButtonText: {
		fontSize: theme.fontSizes.md,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.surface,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.xl,
	},
	emptyText: {
		fontSize: theme.fontSizes.lg,
		color: theme.colors.textSecondary,
		textAlign: 'center',
	},
}))
