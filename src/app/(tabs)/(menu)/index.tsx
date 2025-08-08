import {
	categoriesQueryOptions,
	productsQueryOptions,
} from '@/lib/queries/menu'
import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import Head from 'expo-router/head'
import { Link, router } from 'expo-router'
import { Image } from 'expo-image'
import Animated from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import {
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	View,
} from 'react-native'
import { H2, H3, Paragraph } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import { selfQueryOptions } from '@/lib/queries/auth'
import { POSTER_BASE_URL, PosterCategory, PosterProduct } from '@/lib/api'
import { useAddItem } from '@/lib/stores/order-store'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

export default function Menu() {
	const { t } = useLingui()
	const addItem = useAddItem()
	const { data: user } = useQuery(selfQueryOptions)
	const isAuthenticated = Boolean(user)

	const { data: menuData, isLoading, error } = useQuery(productsQueryOptions)
	const { data: categoriesData } = useQuery(categoriesQueryOptions)

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
				<Paragraph style={styles.loadingText}>
					<Trans>Loading menu...</Trans>
				</Paragraph>
			</View>
		)
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Paragraph style={styles.errorText}>
					<Trans>Failed to load menu. Please try again.</Trans>
				</Paragraph>
				<Button>
					<Trans>Retry</Trans>
				</Button>
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
			// Add item to order with default quantity of 1
			addItem({
				productId: item.product_id,
				quantity: 1,
			})
		}
	}

	const renderMenuItem = ({ item }: { item: PosterProduct }) => {
		const firstPrice = item.price ? Object.values(item.price)[0] : '0'

		return (
			<Link href={`/(tabs)/(menu)/${item.product_id}`}>
				<View style={styles.menuItem}>
					<Animated.View
						style={styles.menuItemImageContainer}
						sharedTransitionTag={`menu-item-${item.product_id}`}
					>
						{item.photo ? (
							<Image
								source={{
									uri: `${POSTER_BASE_URL}${item.photo}`,
								}}
								// keep inline styles
								style={{ width: '100%', height: '100%' }}
								contentFit="cover"
								transition={200}
							/>
						) : (
							<View style={styles.menuItemImage} />
						)}
					</Animated.View>
					<View style={styles.menuItemContent}>
						<View style={styles.menuItemHeader}>
							<H3>{item.product_name}</H3>
						</View>
						<Paragraph style={styles.menuItemDescription}>
							{item.product_production_description}
						</Paragraph>
						<View style={styles.menuItemFooter}>
							<Paragraph style={styles.menuItemPrice}>
								${(parseFloat(firstPrice) / 100).toFixed(2)}
							</Paragraph>
							<View style={styles.menuItemActions}>
								<TouchableOpacity
									style={styles.addToBagButton}
									onPress={(e) => {
										e.stopPropagation()
										handleAddToBag(item)
									}}
								>
									<Ionicons name="add" size={24} color="#fff" />
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
				<H2 style={styles.categoryTitle}>{category.category_name}</H2>
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
					content={t`Discover our homemade coffee menu with espresso, lattes, cappuccinos and delicious sides. TOLO - where good coffee meets you.`}
				/>
				<meta
					name="keywords"
					content={t`TOLO menu, good coffee, espresso, latte, cappuccino, coffee shop menu`}
				/>
				<meta property="og:title" content={t`Menu - TOLO Good Coffee`} />
				<meta
					property="og:description"
					content={t`Discover our homemade coffee menu with espresso, lattes, cappuccinos and delicious sides.`}
				/>
				<meta property="og:url" content="/" />
			</Head>
			<ScreenContainer>
				{categories.map((category) => renderCategorySection(category))}
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	header: {
		padding: theme.spacing.lg,
		alignItems: 'center',
	},
	title: {
		color: theme.colors.primary,
	},
	subtitle: {
		color: theme.colors.textSecondary,
		marginTop: theme.spacing.xs,
	},
	categorySection: {
		marginBottom: theme.spacing.xl,
	},
	categoryTitle: {
		color: theme.colors.text,
		paddingHorizontal: theme.layout.screenPadding,
		marginBottom: theme.spacing.md,
	},
	categoryItems: {
		paddingHorizontal: theme.layout.screenPadding,
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

	menuItemDescription: {
		color: theme.colors.textSecondary,
	},
	menuItemPrice: {
		color: theme.colors.primary,
	},
	badge: {
		backgroundColor: theme.colors.primary,
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: 2,
		borderRadius: theme.borderRadius.sm,
	},

	badgeText: {
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
		color: theme.colors.error,
		textAlign: 'center',
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
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.full,
	},
	theme: theme,
}))
