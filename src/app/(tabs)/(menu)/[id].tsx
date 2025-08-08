import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useLocalSearchParams, router } from 'expo-router'
import Head from 'expo-router/head'
import { Image } from 'expo-image'
import Animated from 'react-native-reanimated'
import { useQueryClient } from '@tanstack/react-query'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Text, H1, H2, H3, Paragraph, Label } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import { productQueryOptions } from '@/lib/queries/product'
import { POSTER_BASE_URL } from '@/lib/api'
import { useAddItem } from '@/lib/stores/order-store'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

export default function MenuItemDetail() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const [quantity, setQuantity] = useState(1)
	const addItem = useAddItem()
	const queryClient = useQueryClient()

	// Get data from query cache
	const productData = queryClient.getQueryData(
		productQueryOptions(id || '').queryKey,
	)
	const product = productData?.response
	const isLoading = false // Data is from cache, so no loading state
	const error = null // Data is from cache, so no error state

	const handleClose = () => {
		router.back()
	}

	const handleAddToOrder = () => {
		if (!product) return

		addItem({
			productId: product.product_id,
			quantity,
		})
	}

	const incrementQuantity = () => setQuantity((prev) => prev + 1)
	const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

	if (isLoading) {
		return (
			<ScreenContainer>
				<ActivityIndicator size="large" />
				<Paragraph style={styles.loadingText}>
					<Trans>Loading product details...</Trans>
				</Paragraph>
			</ScreenContainer>
		)
	}

	if (error || !product) {
		return (
			<ScreenContainer>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
						<Text style={styles.closeButtonText}>✕</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.content}>
					<H1 style={styles.title}>
						<Trans>Product not found</Trans>
					</H1>
					<Paragraph style={styles.description}>
						<Trans>The requested product could not be loaded.</Trans>
					</Paragraph>
				</View>
			</ScreenContainer>
		)
	}

	// Get the first available price (usually for the main spot)
	const price = Object.values(product.price)[0] || '0'
	const hasImage = product.photo_origin || product.photo

	return (
		<>
			<Head>
				<title>{product.product_name} - TOLO Good Coffee</title>
			</Head>
			<ScreenContainer>
				<Animated.View
					sharedTransitionTag={`menu-item-${product.product_id}`}
					style={styles.heroImageContainer}
				>
					{hasImage ? (
						<Image
							source={{
								uri: `${POSTER_BASE_URL}${product.photo_origin || product.photo}`,
							}}
							style={styles.heroImage}
							contentFit="cover"
							transition={200}
						/>
					) : (
						<View style={styles.heroImage} />
					)}
					<View style={styles.titleOverlay}>
						<H1 style={styles.titleOverlayText}>{product.product_name}</H1>
					</View>
				</Animated.View>

				<View style={styles.content}>
					<H2 style={styles.price}>${parseFloat(price).toFixed(2)}</H2>

					{product.product_production_description && (
						<Paragraph style={styles.description}>
							{product.product_production_description}
						</Paragraph>
					)}

					<View style={styles.badges}>
						{product.category_name && (
							<View style={styles.badge}>
								<Text style={styles.badgeText}>{product.category_name}</Text>
							</View>
						)}
						{product.cooking_time && product.cooking_time !== '0' && (
							<View style={[styles.badge, styles.timeBadge]}>
								<Text style={styles.badgeText}>
									<Trans>{product.cooking_time} min</Trans>
								</Text>
							</View>
						)}
					</View>

					{product.ingredients && product.ingredients.length > 0 && (
						<View style={styles.ingredientsSection}>
							<H3 style={styles.sectionTitle}>
								<Trans>Ingredients</Trans>
							</H3>
							{product.ingredients.slice(0, 5).map((ingredient) => (
								<Paragraph
									key={ingredient.ingredient_id}
									style={styles.ingredient}
								>
									• {ingredient.ingredient_name}
								</Paragraph>
							))}
						</View>
					)}

					{/* Quantity Controls */}
					<View style={styles.quantitySection}>
						<Label style={styles.quantityLabel}>
							<Trans>Quantity</Trans>
						</Label>
						<View style={styles.quantityControls}>
							<TouchableOpacity
								style={styles.quantityButton}
								onPress={decrementQuantity}
							>
								<Ionicons name="remove" size={20} color="#333" />
							</TouchableOpacity>
							<Label style={styles.quantityText}>{quantity}</Label>
							<TouchableOpacity
								style={styles.quantityButton}
								onPress={incrementQuantity}
							>
								<Ionicons name="add" size={20} color="#333" />
							</TouchableOpacity>
						</View>
					</View>

					<Button onPress={handleAddToOrder}>
						<Trans>
							Add to Order - ${(parseFloat(price) * quantity).toFixed(2)}
						</Trans>
					</Button>
				</View>
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	heroImageContainer: {
		width: '100%',
		height: 300,
		backgroundColor: theme.colors.border,
		position: 'relative',
	},
	heroImage: {
		width: '100%',
		height: 300,
	},
	titleOverlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		padding: theme.spacing.lg,
	},
	titleOverlayText: {
		color: '#FFFFFF',
	},
	placeholderImage: {
		backgroundColor: theme.colors.border,
	},
	header: {
		position: 'absolute',
		top: 40,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: theme.spacing.lg,
		zIndex: 1,
	},
	closeButton: {
		width: theme.spacing.xl,
		height: theme.spacing.xl,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.full,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	closeButtonText: {
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.bold,
		color: theme.colors.text,
	},
	content: {
		padding: theme.layout.screenPadding,
	},
	title: {
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	price: {
		color: theme.colors.primary,
		marginBottom: theme.spacing.lg,
	},
	description: {
		color: theme.colors.text,
		marginBottom: theme.spacing.lg,
	},
	badges: {
		flexDirection: 'row',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.xl,
	},
	badge: {
		backgroundColor: theme.colors.primary,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
	},
	popularBadge: {
		backgroundColor: theme.colors.primary,
	},
	badgeText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.surface,
	},
	quantitySection: {
		marginBottom: theme.spacing.lg,
	},
	quantityLabel: {
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	quantityControls: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing.lg,
	},
	quantityButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: theme.colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	quantityText: {
		color: theme.colors.text,
		minWidth: 40,
		textAlign: 'center',
	},

	loadingText: {
		color: theme.colors.textSecondary,
	},
	timeBadge: {
		backgroundColor: theme.colors.primary,
	},
	ingredientsSection: {
		marginBottom: theme.spacing.xl,
	},
	sectionTitle: {
		color: theme.colors.text,
		marginBottom: theme.spacing.md,
	},
	ingredient: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
		paddingLeft: theme.spacing.sm,
	},
}))
