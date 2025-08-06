import { Trans } from '@lingui/react/macro'
import { useLocalSearchParams, router } from 'expo-router'
import Head from 'expo-router/head'
import { Image } from 'expo-image'
import Animated from 'react-native-reanimated'
import { useQuery } from '@tanstack/react-query'
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { productQueryOptions } from '@/lib/queries'
import { POSTER_BASE_URL } from '@/lib/config/api'

export default function MenuItemDetail() {
	const { id } = useLocalSearchParams<{ id: string }>()

	// Fetch product details from API
	const {
		data: productData,
		isLoading,
		error,
	} = useQuery(productQueryOptions(id || ''))
	const product = productData?.response

	const handleClose = () => {
		router.back()
	}

	// Loading state
	if (isLoading) {
		return (
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.loadingContainer}
			>
				<ActivityIndicator size="large" />
				<Text style={styles.loadingText}>
					<Trans>Loading product details...</Trans>
				</Text>
			</ScrollView>
		)
	}

	// Error or not found state
	if (error || !product) {
		return (
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.container}
			>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
						<Text style={styles.closeButtonText}>✕</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.content}>
					<Text style={styles.title}>
						<Trans>Product not found</Trans>
					</Text>
					<Text style={styles.description}>
						<Trans>The requested product could not be loaded.</Trans>
					</Text>
				</View>
			</ScrollView>
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
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.container}
			>
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
				</Animated.View>

				<View style={styles.header}>
					<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
						<Text style={styles.closeButtonText}>✕</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.content}>
					<Text style={styles.title}>{product.product_name}</Text>
					<Text style={styles.price}>${parseFloat(price).toFixed(2)}</Text>

					{product.product_production_description && (
						<Text style={styles.description}>
							{product.product_production_description}
						</Text>
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
							<Text style={styles.sectionTitle}>
								<Trans>Ingredients</Trans>
							</Text>
							{product.ingredients.slice(0, 5).map((ingredient) => (
								<Text key={ingredient.ingredient_id} style={styles.ingredient}>
									• {ingredient.ingredient_name}
								</Text>
							))}
						</View>
					)}

					<TouchableOpacity style={styles.addToBagButton}>
						<Text style={styles.addToBagButtonText}>
							<Trans>Add to Bag - ${parseFloat(price).toFixed(2)}</Trans>
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	heroImageContainer: {
		width: '100%',
		height: 300,
		backgroundColor: theme.colors.border,
	},
	heroImage: {
		width: '100%',
		height: 300,
	},
	placeholderImage: {
		backgroundColor: theme.colors.border,
	},
	header: {
		position: 'absolute',
		top: 0,
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
		padding: theme.spacing.lg,
	},
	title: {
		fontSize: theme.fontSizes.xxxl,
		fontWeight: theme.fontWeights.bold,
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	price: {
		fontSize: theme.fontSizes.xl,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.primary,
		marginBottom: theme.spacing.lg,
	},
	description: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.text,
		lineHeight: theme.fontSizes.xl,
		marginBottom: theme.spacing.lg,
	},
	badges: {
		flexDirection: 'row',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.xl,
	},
	badge: {
		backgroundColor: theme.colors.secondary,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
	},
	popularBadge: {
		backgroundColor: theme.colors.success,
	},
	badgeText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.surface,
	},
	addToBagButton: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.lg,
		paddingHorizontal: theme.spacing.xl,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
	},
	addToBagButtonText: {
		color: theme.colors.surface,
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.semibold,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	loadingText: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.textSecondary,
	},
	timeBadge: {
		backgroundColor: theme.colors.accent,
	},
	ingredientsSection: {
		marginBottom: theme.spacing.xl,
	},
	sectionTitle: {
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.semibold,
		color: theme.colors.text,
		marginBottom: theme.spacing.md,
	},
	ingredient: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
		paddingLeft: theme.spacing.sm,
	},
}))
