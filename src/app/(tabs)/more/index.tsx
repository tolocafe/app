import { useLanguage } from '@/lib/contexts/language-context'
import { clearAllCache } from '@/lib/queries/cache-utils'
import { useMMKVString } from 'react-native-mmkv'
import { STORAGE_KEYS } from '@/lib/constants/storage'
import { useQuery } from '@tanstack/react-query'
import { userProfileQueryOptions } from '@/lib/queries/auth'
import { Trans } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { router } from 'expo-router'
import { useState } from 'react'
import {
	Alert,
	Linking,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import * as DropdownMenu from 'zeego/dropdown-menu'

export default function More() {
	const { currentLanguage, changeLanguage } = useLanguage()
	const [token, setToken] = useMMKVString(STORAGE_KEYS.AUTH_SESSION)
	const isAuthenticated = Boolean(token)
	const { data: user, isLoading: isLoadingUser } = useQuery(
		userProfileQueryOptions,
	)
	const [isClearingCache, setIsClearingCache] = useState(false)

	const handleSignIn = () => {
		router.push('/sign-in')
	}

	const handleSignOut = () => {
		Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Sign Out',
				style: 'destructive',
				onPress: async () => {
					// Clear token storage
					setToken(undefined)

					// Clear query cache
					await clearAllCache()
				},
			},
		])
	}

	const handleCall = () => {
		Linking.openURL('tel:+14155551234')
	}

	const handleDirections = () => {
		const address = '123 Coffee Street, San Francisco, CA 94105'
		const url = `https://maps.apple.com/?address=${encodeURIComponent(address)}`
		Linking.openURL(url)
	}

	const handleWebsite = () => {
		Linking.openURL('https://tolocoffee.com')
	}

	const handleInstagram = () => {
		Linking.openURL('https://instagram.com/tolocoffee')
	}

	const handleClearCache = () => {
		Alert.alert(
			'Clear Cache',
			'This will clear all cached data including menu items. The app will reload fresh data from the server. Continue?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Clear Cache',
					style: 'destructive',
					onPress: async () => {
						setIsClearingCache(true)
						try {
							await clearAllCache()
							Alert.alert(
								'Cache Cleared',
								'All cached data has been cleared successfully.',
								[{ text: 'OK' }],
							)
						} catch (error) {
							console.error('Failed to clear cache:', error)
							Alert.alert('Error', 'Failed to clear cache. Please try again.', [
								{ text: 'OK' },
							])
						} finally {
							setIsClearingCache(false)
						}
					},
				},
			],
		)
	}

	return (
		<>
			<Head>
				<title>Visítanos - TOLO Buen Café</title>
				<meta
					name="description"
					content="Ven a conocer TOLO en 123 Coffee Street, San Francisco. Aquí encontrarás nuestros horarios, cómo contactarnos y conectarte con nuestra comunidad cafetera."
				/>
				<meta
					name="keywords"
					content="TOLO ubicación, horarios TOLO, contacto TOLO, buen café San Francisco, cafetería barrio"
				/>
				<meta property="og:title" content="Visítanos - TOLO Buen Café" />
				<meta
					property="og:description"
					content="Ven a conocer TOLO en 123 Coffee Street, San Francisco. Aquí encontrarás nuestra comunidad cafetera."
				/>
				<meta property="og:url" content="/more" />
			</Head>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				contentInsetAdjustmentBehavior="automatic"
			>
				{/* User Information Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						<Trans>Account</Trans>
					</Text>
					<View style={styles.card}>
						{isAuthenticated ? (
							<>
								{isLoadingUser ? (
									<View style={styles.userInfoLoading}>
										<Text style={styles.userInfoText}>
											<Trans>Loading user information...</Trans>
										</Text>
									</View>
								) : user ? (
									<>
										<View style={styles.userInfo}>
											<Text style={styles.userInfoLabel}>
												<Trans>Phone</Trans>
											</Text>
											<Text style={styles.userInfoValue}>
												{user.phone || <Trans>Not provided</Trans>}
											</Text>
										</View>

										{user.name && (
											<>
												<View style={styles.userInfoDivider} />
												<View style={styles.userInfo}>
													<Text style={styles.userInfoLabel}>
														<Trans>Name</Trans>
													</Text>
													<Text style={styles.userInfoValue}>{user.name}</Text>
												</View>
											</>
										)}

										{user.email && (
											<>
												<View style={styles.userInfoDivider} />
												<View style={styles.userInfo}>
													<Text style={styles.userInfoLabel}>
														<Trans>Email</Trans>
													</Text>
													<Text style={styles.userInfoValue}>{user.email}</Text>
												</View>
											</>
										)}

										<View style={styles.userInfoDivider} />
										<TouchableOpacity
											style={styles.signOutButton}
											onPress={handleSignOut}
										>
											<Text style={styles.signOutButtonText}>
												<Trans>Sign Out</Trans>
											</Text>
										</TouchableOpacity>
									</>
								) : (
									<View style={styles.userInfoError}>
										<Text style={styles.userInfoText}>
											<Trans>Unable to load user information</Trans>
										</Text>
									</View>
								)}
							</>
						) : (
							<>
								<Text style={styles.signInPrompt}>
									<Trans>
										Sign in to view your account information and access
										personalized features.
									</Trans>
								</Text>
								<TouchableOpacity
									style={styles.signInButton}
									onPress={handleSignIn}
								>
									<Text style={styles.signInButtonText}>
										<Trans>Sign In</Trans>
									</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						<Trans>Visit Us</Trans>
					</Text>
					<View style={styles.card}>
						<Text style={styles.cardTitle}>
							<Trans>TOLO Coffee Shop</Trans>
						</Text>
						<Text style={styles.cardText}>123 Coffee Street</Text>
						<Text style={styles.cardText}>San Francisco, CA 94105</Text>

						<View style={styles.hoursContainer}>
							<Text style={styles.hoursTitle}>
								<Trans>Hours</Trans>
							</Text>
							<View style={styles.hoursRow}>
								<Text style={styles.dayText}>
									<Trans>Monday - Friday</Trans>
								</Text>
								<Text style={styles.hoursText}>6:00 AM - 8:00 PM</Text>
							</View>
							<View style={styles.hoursRow}>
								<Text style={styles.dayText}>
									<Trans>Saturday</Trans>
								</Text>
								<Text style={styles.hoursText}>7:00 AM - 9:00 PM</Text>
							</View>
							<View style={styles.hoursRow}>
								<Text style={styles.dayText}>
									<Trans>Sunday</Trans>
								</Text>
								<Text style={styles.hoursText}>7:00 AM - 7:00 PM</Text>
							</View>
						</View>

						<TouchableOpacity style={styles.button} onPress={handleDirections}>
							<Text style={styles.buttonText}>
								<Trans>Get Directions</Trans>
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						<Trans>Connect</Trans>
					</Text>
					<View style={styles.card}>
						<TouchableOpacity style={styles.contactButton} onPress={handleCall}>
							<Text style={styles.contactButtonText}>
								<Trans>Call (415) 555-1234</Trans>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.contactButton}
							onPress={handleWebsite}
						>
							<Text style={styles.contactButtonText}>
								<Trans>Visit tolocoffee.com</Trans>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.contactButton}
							onPress={handleInstagram}
						>
							<Text style={styles.contactButtonText}>
								<Trans>Follow @tolocoffee</Trans>
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						<Trans>Settings</Trans>
					</Text>
					<View style={styles.card}>
						<View style={styles.settingRow}>
							<Text style={styles.settingLabel}>
								<Trans>Language</Trans>
							</Text>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<View style={styles.languageDropdownTrigger}>
										<Text style={styles.languageDropdownText}>
											{currentLanguage === 'en' ? 'English' : 'Español'}
										</Text>
										<Text style={styles.languageDropdownArrow}>▼</Text>
									</View>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item
										key="en"
										onSelect={() => changeLanguage('en')}
									>
										<DropdownMenu.ItemTitle>English</DropdownMenu.ItemTitle>
									</DropdownMenu.Item>
									<DropdownMenu.Item
										key="es"
										onSelect={() => changeLanguage('es')}
									>
										<DropdownMenu.ItemTitle>Español</DropdownMenu.ItemTitle>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</View>

						<View style={styles.settingDivider} />

						<TouchableOpacity
							style={[
								styles.clearCacheButton,
								isClearingCache && styles.clearCacheButtonDisabled,
							]}
							onPress={handleClearCache}
							disabled={isClearingCache}
						>
							<Text
								style={[
									styles.clearCacheText,
									isClearingCache && styles.clearCacheTextDisabled,
								]}
							>
								{isClearingCache ? (
									<Trans>Clearing Cache...</Trans>
								) : (
									<Trans>Clear Cache</Trans>
								)}
							</Text>
						</TouchableOpacity>
						<Text style={styles.clearCacheDescription}>
							<Trans>
								Clear all cached data and reload fresh content from the server.
							</Trans>
						</Text>
					</View>
				</View>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create((theme, rt) => ({
	scrollContent: {
		paddingBottom: theme.spacing.xl,
	},
	section: {
		paddingHorizontal: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},
	sectionTitle: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: theme.typography.h2.fontWeight,
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	card: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.lg,
		padding: theme.spacing.lg,
	},
	cardTitle: {
		fontSize: theme.typography.h3.fontSize,
		fontWeight: theme.typography.h3.fontWeight,
		color: theme.colors.text,
		marginBottom: theme.spacing.xs,
	},
	cardText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
		lineHeight: 22,
		marginBottom: theme.spacing.xs,
	},
	button: {
		marginTop: theme.spacing.lg,
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
	},
	buttonText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	hoursContainer: {
		marginTop: theme.spacing.lg,
		marginBottom: theme.spacing.sm,
	},
	hoursTitle: {
		...theme.typography.h4,
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	hoursRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: theme.spacing.xs,
	},
	dayText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.text,
	},
	hoursText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
	},
	contactButton: {
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.sm,
		marginBottom: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
		backgroundColor: theme.colors.background,
	},
	contactButtonText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.primary,
		fontWeight: theme.typography.body.fontWeight,
		textAlign: 'center',
	},

	settingLabel: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
		color: theme.colors.text,
	},
	settingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.sm,
	},
	languageDropdownTrigger: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.md,
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.sm,
		borderWidth: 1,
		borderColor: theme.colors.border,
		minWidth: 120,
	},
	languageDropdownText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.text,
		flex: 1,
	},
	languageDropdownArrow: {
		fontSize: 12,
		color: theme.colors.textSecondary,
		marginLeft: theme.spacing.sm,
	},
	settingDivider: {
		height: 1,
		backgroundColor: theme.colors.border,
		marginVertical: theme.spacing.lg,
	},
	clearCacheButton: {
		backgroundColor: theme.colors.error,
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		marginBottom: theme.spacing.sm,
	},
	clearCacheButtonDisabled: {
		backgroundColor: theme.colors.border,
	},
	clearCacheText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	clearCacheTextDisabled: {
		color: theme.colors.textSecondary,
	},
	clearCacheDescription: {
		fontSize: theme.typography.caption.fontSize,
		color: theme.colors.textSecondary,
		lineHeight: 18,
		textAlign: 'center',
	},
	// User Information Styles
	userInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: theme.spacing.sm,
	},
	userInfoLabel: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.text,
		fontWeight: theme.typography.body.fontWeight,
		flex: 1,
	},
	userInfoValue: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
		textAlign: 'right',
		flex: 2,
	},
	userInfoDivider: {
		height: 1,
		backgroundColor: theme.colors.border,
		marginVertical: theme.spacing.xs,
	},
	userInfoLoading: {
		paddingVertical: theme.spacing.lg,
		alignItems: 'center',
	},
	userInfoError: {
		paddingVertical: theme.spacing.lg,
		alignItems: 'center',
	},
	userInfoText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
		textAlign: 'center',
	},
	signInPrompt: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
		lineHeight: 22,
		textAlign: 'center',
		marginBottom: theme.spacing.lg,
	},
	signInButton: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
	},
	signInButtonText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	signOutButton: {
		backgroundColor: theme.colors.error,
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		marginTop: theme.spacing.sm,
	},
	signOutButtonText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
}))
