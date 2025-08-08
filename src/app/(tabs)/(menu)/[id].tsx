import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import { Trans } from '@lingui/react/macro'
import { useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import Head from 'expo-router/head'
import Animated from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'
import { H1, H2, H3, Label, Paragraph, Text } from '@/components/Text'
import { POSTER_BASE_URL } from '@/lib/api'
import { productQueryOptions } from '@/lib/queries/product'
import { useAddItem } from '@/lib/stores/order-store'

const handleClose = () => {
	router.back()
}

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

	const handleAddToOrder = () => {
		if (!product) return

		addItem({
			productId: product.product_id,
			quantity,
		})
	}

	const incrementQuantity = () => setQuantity((previous) => previous + 1)
	const decrementQuantity = () =>
		setQuantity((previous) => Math.max(1, previous - 1))

	if (!product) {
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
							contentFit="cover"
							source={{
								uri: `${POSTER_BASE_URL}${product.photo_origin || product.photo}`,
							}}
							style={styles.heroImage}
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
					<H2 style={styles.price}>${Number.parseFloat(price).toFixed(2)}</H2>

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

					{product.ingredients.length > 0 && (
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
								onPress={decrementQuantity}
								style={styles.quantityButton}
							>
								<Ionicons color="#333" name="remove" size={20} />
							</TouchableOpacity>
							<Label style={styles.quantityText}>{quantity}</Label>
							<TouchableOpacity
								onPress={incrementQuantity}
								style={styles.quantityButton}
							>
								<Ionicons color="#333" name="add" size={20} />
							</TouchableOpacity>
						</View>
					</View>

					<Button onPress={handleAddToOrder}>
						<Trans>
							Add to Order - ${(Number.parseFloat(price) * quantity).toFixed(2)}
						</Trans>
					</Button>
				</View>
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	badge: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.sm,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.xs,
	},
	badges: {
		flexDirection: 'row',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.xl,
	},
	badgeText: {
		color: theme.colors.surface,
		fontSize: theme.fontSizes.sm,
		fontWeight: theme.fontWeights.semibold,
	},
	closeButton: {
		alignItems: 'center',
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.full,
		elevation: 5,
		height: theme.spacing.xl,
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		width: theme.spacing.xl,
	},
	closeButtonText: {
		color: theme.colors.text,
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.bold,
	},
	content: {
		padding: theme.layout.screenPadding,
	},
	description: {
		color: theme.colors.text,
		marginBottom: theme.spacing.lg,
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: theme.spacing.lg,
		position: 'absolute',
		right: 0,
		top: 40,
		zIndex: 1,
	},
	heroImage: {
		height: 300,
		width: '100%',
	},
	heroImageContainer: {
		backgroundColor: theme.colors.border,
		height: 300,
		position: 'relative',
		width: '100%',
	},
	ingredient: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
		paddingLeft: theme.spacing.sm,
	},
	ingredientsSection: {
		marginBottom: theme.spacing.xl,
	},
	loadingText: {
		color: theme.colors.textSecondary,
	},
	placeholderImage: {
		backgroundColor: theme.colors.border,
	},
	popularBadge: {
		backgroundColor: theme.colors.primary,
	},
	price: {
		color: theme.colors.primary,
		marginBottom: theme.spacing.lg,
	},
	quantityButton: {
		alignItems: 'center',
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: 20,
		borderWidth: 1,
		height: 40,
		justifyContent: 'center',
		width: 40,
	},
	quantityControls: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: theme.spacing.lg,
		justifyContent: 'center',
	},
	quantityLabel: {
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	quantitySection: {
		marginBottom: theme.spacing.lg,
	},
	quantityText: {
		color: theme.colors.text,
		minWidth: 40,
		textAlign: 'center',
	},

	sectionTitle: {
		color: theme.colors.text,
		marginBottom: theme.spacing.md,
	},
	timeBadge: {
		backgroundColor: theme.colors.primary,
	},
	title: {
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	titleOverlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		bottom: 0,
		left: 0,
		padding: theme.spacing.lg,
		position: 'absolute',
		right: 0,
	},
	titleOverlayText: {
		color: '#FFFFFF',
	},
}))
