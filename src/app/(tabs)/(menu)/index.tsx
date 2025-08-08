import {
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	View,
} from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import Head from 'expo-router/head'
import Animated from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'
import { H2, H3, Paragraph } from '@/components/Text'
import { POSTER_BASE_URL } from '@/lib/api'
import { selfQueryOptions } from '@/lib/queries/auth'
import {
	categoriesQueryOptions,
	productsQueryOptions,
} from '@/lib/queries/menu'
import { useAddItem } from '@/lib/stores/order-store'
import { formatPosterPrice } from '@/lib/utils/price'

import type { PosterCategory, PosterProduct } from '@/lib/api'

export default function Menu() {
	const { t } = useLingui()
	const addItem = useAddItem()
	const { data: user } = useQuery(selfQueryOptions)
	const isAuthenticated = Boolean(user)

	const { data: menu, error, isFetching } = useQuery(productsQueryOptions)
	const { data: categories } = useQuery(categoriesQueryOptions)

	const handleAddToBag = (item: PosterProduct) => {
		if (isAuthenticated) {
			addItem({ productId: item.product_id, quantity: 1 })
		} else {
			router.push({
				params: { itemName: item.product_name },
				pathname: '/sign-in',
			})
		}
	}

	const renderMenuItem = ({ item }: { item: PosterProduct }) => {
		const firstPrice = Object.values(item.price)[0]

		return (
			<Link href={`/(tabs)/(menu)/${item.product_id}`}>
				<View style={styles.menuItem}>
					<Animated.View
						sharedTransitionTag={`menu-item-${item.product_id}`}
						style={styles.menuItemImageContainer}
					>
						{item.photo ? (
							<Image
								contentFit="cover"
								source={{
									uri: `${POSTER_BASE_URL}${item.photo}`,
								}}
								// keep inline styles
								style={{ height: '100%', width: '100%' }}
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
								{formatPosterPrice(firstPrice)}
							</Paragraph>
							<View style={styles.menuItemActions}>
								<TouchableOpacity
									onPress={(event) => {
										event.stopPropagation()
										handleAddToBag(item)
									}}
									style={styles.addToBagButton}
								>
									<Ionicons color="#fff" name="add" size={24} />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Link>
		)
	}

	const renderCategorySection = (category: PosterCategory) => {
		const categoryItems = menu.filter(
			(item: PosterProduct) => item.menu_category_id === category.category_id,
		)

		if (categoryItems.length === 0) return null

		return (
			<View key={category.category_id} style={styles.categorySection}>
				<H2 style={styles.categoryTitle}>{category.category_name}</H2>
				<FlatList
					contentContainerStyle={styles.categoryItems}
					data={categoryItems}
					horizontal
					keyExtractor={(item) => item.product_id}
					renderItem={renderMenuItem}
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		)
	}

	if (menu.length === 0) {
		if (isFetching) {
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
	}

	return (
		<>
			<Head>
				<title>{t`Menu - TOLO Good Coffee`}</title>
				<meta
					content={t`Discover our homemade coffee menu with espresso, lattes, cappuccinos and delicious sides. TOLO - where good coffee meets you.`}
					name="description"
				/>
				<meta
					content={t`TOLO menu, good coffee, espresso, latte, cappuccino, coffee shop menu`}
					name="keywords"
				/>
				<meta content={t`Menu - TOLO Good Coffee`} property="og:title" />
				<meta
					content={t`Discover our homemade coffee menu with espresso, lattes, cappuccinos and delicious sides.`}
					property="og:description"
				/>
				<meta content="/" property="og:url" />
			</Head>
			<ScreenContainer>
				{categories.map((category) => renderCategorySection(category))}
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	addToBagButton: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.full,
		padding: theme.spacing.sm,
	},
	badge: {
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.sm,
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: 2,
	},
	badges: {
		flexDirection: 'row',
		gap: theme.spacing.xs,
	},
	badgeText: {
		color: theme.colors.surface,
	},
	categoryItems: {
		gap: theme.spacing.md,
		paddingHorizontal: theme.layout.screenPadding,
	},
	categorySection: {
		marginBottom: theme.spacing.xl,
	},
	categoryTitle: {
		color: theme.colors.text,
		marginBottom: theme.spacing.md,
		paddingHorizontal: theme.layout.screenPadding,
	},
	errorContainer: {
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		flex: 1,
		gap: theme.spacing.lg,
		justifyContent: 'center',
		padding: theme.spacing.xl,
	},
	errorText: {
		color: theme.colors.error,
		textAlign: 'center',
	},
	header: {
		alignItems: 'center',
		padding: theme.spacing.lg,
	},
	loadingContainer: {
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		flex: 1,
		gap: theme.spacing.md,
		justifyContent: 'center',
	},
	loadingText: {
		color: theme.colors.textSecondary,
	},

	menuItem: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.lg,
		overflow: 'hidden',
		width: 225,
	},
	menuItemActions: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: theme.spacing.sm,
	},
	menuItemContent: {
		padding: theme.spacing.md,
	},

	menuItemDescription: {
		color: theme.colors.textSecondary,
	},
	menuItemFooter: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: theme.spacing.md,
	},
	menuItemHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.xs,
	},
	menuItemImage: {
		height: 225,
		width: '100%',
	},
	menuItemImageContainer: {
		backgroundColor: theme.colors.border,
		height: 225,
		width: '100%',
	},

	menuItemPrice: {
		color: theme.colors.primary,
	},

	subtitle: {
		color: theme.colors.textSecondary,
		marginTop: theme.spacing.xs,
	},

	theme,
	title: {
		color: theme.colors.primary,
	},
}))
