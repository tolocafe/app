import { categoriesQueryOptions, productsQueryOptions } from '@/lib/queries'
import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import Head from 'expo-router/head'
import { Link, router } from 'expo-router'
import { Image } from 'expo-image'
import Animated from 'react-native-reanimated'
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useAuth } from '@/lib/hooks/use-auth'
import { PosterCategory, PosterProduct } from '@/lib/api/client'

export default function Menu() {
	const { t } = useLingui()
	const { isAuthenticated } = useAuth()

	// Fetch menu data using React Query
	const { data: menuData, isLoading, error } = useQuery(productsQueryOptions)
	const { data: categoriesData } = useQuery(categoriesQueryOptions)

	// Handle loading state
	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
				<Text style={styles.loadingText}>
					<Trans>Loading menu...</Trans>
				</Text>
			</View>
		)
	}

	// Handle error state
	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>
					<Trans>Failed to load menu. Please try again.</Trans>
				</Text>
			</View>
		)
	}

	const categories = categoriesData?.response || []
	const menuItems = menuData?.response || []

	const handleAddToBag = (item: PosterProduct) => {
		if (!isAuthenticated) {
			router.push({
				pathname: '/sign-in',
				params: { itemName: item.product_name },
			})
		} else {
			// TODO: Implement actual add to bag logic
			console.log('Adding to bag:', item.product_name)
		}
	}

	const renderMenuItem = ({ item }: { item: PosterProduct }) => {
		const firstPrice = item.price ? Object.values(item.price)[0] : '0'

		return (
			<Link href={`/(tabs)/(menu)/${item.product_id}`} asChild>
				<View style={styles.menuItem}>
					<Animated.View
						sharedTransitionTag={`menu-item-${item.product_id}`}
						style={styles.menuItemImageContainer}
					>
						{item.photo ? (
							<Image
								source={{ uri: item.photo }}
								style={styles.menuItemImage}
								contentFit="cover"
								transition={200}
							/>
						) : (
							<View style={styles.menuItemImage} />
						)}
					</Animated.View>
					<View style={styles.menuItemContent}>
						<View style={styles.menuItemHeader}>
							<Text style={styles.menuItemName}>{item.product_name}</Text>
							<View style={styles.badges}>
								{item.group_modifications &&
									item.group_modifications.length > 0 && (
										<View style={[styles.badge, styles.popularBadge]}>
											<Text style={styles.badgeText}>
												<Trans>POPULAR</Trans>
											</Text>
										</View>
									)}
							</View>
						</View>
						<Text style={styles.menuItemDescription}>
							{item.product_production_description}
						</Text>
						<View style={styles.menuItemFooter}>
							<Text style={styles.menuItemPrice}>
								${(parseFloat(firstPrice) / 100).toFixed(2)}
							</Text>
							<View style={styles.menuItemActions}>
								<TouchableOpacity
									style={styles.addToBagButton}
									onPress={(e) => {
										e.stopPropagation()
										handleAddToBag(item)
									}}
								>
									<Text style={styles.addToBagButtonText}>
										<Trans>Add to Bag</Trans>
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Link>
		)
	}

	const renderCategorySection = (category: PosterCategory) => {
		const categoryItems = menuItems.filter(
			(item: PosterProduct) => item.menu_category_id === category.category_id,
		)

		if (categoryItems.length === 0) return null

		return (
			<View key={category.category_id} style={styles.categorySection}>
				<Text style={styles.categoryTitle}>{category.category_name}</Text>
				<FlatList
					data={categoryItems}
					renderItem={renderMenuItem}
					keyExtractor={(item) => item.product_id}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.categoryItems}
				/>
			</View>
		)
	}

	return (
		<>
			<Head>
				<title>{t`Menu - TOLO Good Coffee`}</title>
				<meta
					name="description"
					content="Descubre nuestro menú de café casero con espresso, lattes, cappuccinos y deliciosos acompañamientos. TOLO - donde el buen café se encuentra contigo."
				/>
				<meta
					name="keywords"
					content="menú TOLO, buen café, espresso, latte, cappuccino, café casero, menú cafetería"
				/>
				<meta property="og:title" content="Menú - TOLO Buen Café" />
				<meta
					property="og:description"
					content="Descubre nuestro menú de café casero con espresso, lattes, cappuccinos y deliciosos acompañamientos."
				/>
				<meta property="og:url" content="/" />
			</Head>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={styles.container}
			>
				{categories.map((category) => renderCategorySection(category))}
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	header: {
		padding: theme.spacing.lg,
		alignItems: 'center',
	},
	title: {
		fontSize: theme.typography.h1.fontSize,
		fontWeight: theme.typography.h1.fontWeight,
		color: theme.colors.primary,
	},
	subtitle: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
		marginTop: theme.spacing.xs,
	},
	categorySection: {
		marginBottom: theme.spacing.xl,
	},
	categoryTitle: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: theme.typography.h2.fontWeight,
		color: theme.colors.text,
		paddingHorizontal: theme.spacing.md,
		marginBottom: theme.spacing.md,
	},
	categoryItems: {
		paddingHorizontal: theme.spacing.md,
		gap: theme.spacing.md,
	},
	menuItem: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.lg,
		overflow: 'hidden',
		width: 225,
	},
	menuItemImageContainer: {
		width: '100%',
		height: 225,
		backgroundColor: theme.colors.border,
	},
	menuItemImage: {
		width: '100%',
		height: 225,
	},
	menuItemContent: {
		padding: theme.spacing.md,
	},
	menuItemFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: theme.spacing.md,
	},
	menuItemHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.xs,
	},
	menuItemName: {
		fontSize: theme.typography.h3.fontSize,
		fontWeight: theme.typography.h3.fontWeight,
		color: theme.colors.text,
	},
	menuItemDescription: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
	},
	menuItemPrice: {
		fontSize: theme.typography.h3.fontSize,
		fontWeight: theme.typography.h3.fontWeight,
		color: theme.colors.primary,
	},
	badge: {
		backgroundColor: theme.colors.secondary,
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: 2,
		borderRadius: theme.borderRadius.sm,
	},
	popularBadge: {
		backgroundColor: theme.colors.success,
	},
	badgeText: {
		fontSize: theme.typography.caption.fontSize,
		fontWeight: theme.typography.caption.fontWeight,
		color: theme.colors.surface,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		gap: theme.spacing.md,
	},
	loadingText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		padding: theme.spacing.xl,
		gap: theme.spacing.lg,
	},
	errorText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.error,
		textAlign: 'center',
	},
	retryButton: {
		backgroundColor: theme.colors.primary,
		paddingHorizontal: theme.spacing.xl,
		paddingVertical: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
	},
	retryButtonText: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
		color: theme.colors.surface,
	},
	badges: {
		flexDirection: 'row',
		gap: theme.spacing.xs,
	},

	menuItemActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},

	addToBagButton: {
		backgroundColor: theme.colors.primary,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	addToBagButtonText: {
		color: theme.colors.surface,
		fontSize: theme.typography.caption.fontSize,
		fontWeight: theme.typography.caption.fontWeight,
	},
	theme: theme,
}))
