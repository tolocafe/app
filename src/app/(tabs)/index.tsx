import { type MenuItem } from '@/lib/data/menu'
import { menuQueryOptions } from '@/lib/queries/menu'
import {
	preferencesMutationOptions,
	preferencesQueryOptions,
	type UserPreferences,
} from '@/lib/queries/preferences'
import { Trans } from '@lingui/react/macro'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Head from 'expo-router/head'
import { useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function Menu() {
	const [selectedCategory, setSelectedCategory] = useState('coffee')
	const queryClient = useQueryClient()

	// Fetch menu data using React Query
	const { data: menuData, isLoading, error } = useQuery(menuQueryOptions)

	// Fetch user preferences
	const { data: preferences } = useQuery(preferencesQueryOptions)
	const preferencesMutation = useMutation({
		...preferencesMutationOptions,
		onSuccess: (data) => {
			// Invalidate any queries that depend on preferences
			queryClient.invalidateQueries({
				queryKey: preferencesQueryOptions.queryKey,
			})

			// Optionally update the cache directly
			queryClient.setQueryData(
				preferencesQueryOptions.queryKey,
				(old: UserPreferences | undefined) =>
					({
						...old,
						...data,
					}) as UserPreferences,
			)
		},
	})

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
				<TouchableOpacity
					style={styles.retryButton}
					onPress={() => {
						// Refetch the query
						queryClient.invalidateQueries({ queryKey: ['menu'] })
					}}
				>
					<Text style={styles.retryButtonText}>
						<Trans>Retry</Trans>
					</Text>
				</TouchableOpacity>
			</View>
		)
	}

	const categories = menuData?.categories || []
	const menuItems = menuData?.items || []
	const filteredItems = menuItems.filter(
		(item: MenuItem) => item.category === selectedCategory,
	)

	const toggleFavorite = (itemId: string) => {
		const currentFavorites = preferences?.favoriteItems || []
		const isFavorite = currentFavorites.includes(itemId)

		const newFavorites = isFavorite
			? currentFavorites.filter((id) => id !== itemId)
			: [...currentFavorites, itemId]

		preferencesMutation.mutate({ favoriteItems: newFavorites })
	}

	const renderMenuItem = ({ item }: { item: MenuItem }) => {
		const isFavorite = preferences?.favoriteItems?.includes(item.id) || false

		return (
			<View style={styles.menuItem}>
				<View style={styles.menuItemContent}>
					<View style={styles.menuItemHeader}>
						<Text style={styles.menuItemName}>{item.name}</Text>
						<View style={styles.badges}>
							{isFavorite && (
								<View style={[styles.badge, styles.favoriteBadge]}>
									<Text style={styles.badgeText}>♥</Text>
								</View>
							)}
							{item.isNew && (
								<View style={styles.badge}>
									<Text style={styles.badgeText}>
										<Trans>NEW</Trans>
									</Text>
								</View>
							)}
							{item.isPopular && (
								<View style={[styles.badge, styles.popularBadge]}>
									<Text style={styles.badgeText}>
										<Trans>POPULAR</Trans>
									</Text>
								</View>
							)}
						</View>
					</View>
					<Text style={styles.menuItemDescription}>{item.description}</Text>
				</View>
				<View style={styles.menuItemActions}>
					<TouchableOpacity onPress={() => toggleFavorite(item.id)}>
						<Text
							style={[
								styles.favoriteButton,
								isFavorite && styles.favoriteActive,
							]}
						>
							{isFavorite ? '♥' : '♡'}
						</Text>
					</TouchableOpacity>
					<Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
				</View>
			</View>
		)
	}

	return (
		<>
			<Head>
				<title>Menú - TOLO Buen Café</title>
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
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.categoriesContainer}
					contentContainerStyle={styles.categoriesContent}
				>
					{categories.map((category: any) => (
						<TouchableOpacity
							key={category.id}
							style={[
								styles.categoryButton,
								selectedCategory === category.id && styles.categoryButtonActive,
							]}
							onPress={() => setSelectedCategory(category.id)}
						>
							<Text
								style={[
									styles.categoryText,
									selectedCategory === category.id && styles.categoryTextActive,
								]}
							>
								{category.name}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				<FlatList
					data={filteredItems}
					renderItem={renderMenuItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.menuList}
					showsVerticalScrollIndicator={false}
				/>
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
	categoriesContainer: {
		maxHeight: 50,
	},
	categoriesContent: {
		paddingHorizontal: theme.spacing.md,
		gap: theme.spacing.sm,
	},
	categoryButton: {
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.full,
		backgroundColor: theme.colors.surface,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	categoryButtonActive: {
		backgroundColor: theme.colors.primary,
		borderColor: theme.colors.primary,
	},
	categoryText: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
		color: theme.colors.text,
	},
	categoryTextActive: {
		color: theme.colors.surface,
	},
	menuList: {
		padding: theme.spacing.md,
	},
	menuItem: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.lg,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.sm,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	menuItemContent: {
		flex: 1,
		marginRight: theme.spacing.md,
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
	favoriteBadge: {
		backgroundColor: theme.colors.error,
	},
	menuItemActions: {
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	favoriteButton: {
		fontSize: 24,
		color: theme.colors.textSecondary,
	},
	favoriteActive: {
		color: theme.colors.error,
	},
	theme: theme,
}))
