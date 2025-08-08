import { useLanguage } from '@/lib/contexts/language-context'
import { clearAllCache } from '@/lib/queries/cache-utils'
import * as SecureStore from 'expo-secure-store'
import { useQuery } from '@tanstack/react-query'
import { selfQueryOptions } from '@/lib/queries/auth'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Platform, TouchableOpacity, View } from 'react-native'
import { Text, H2, Paragraph, Label } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

export default function More() {
	const { t } = useLingui()
	const { currentLanguage, changeLanguage } = useLanguage()
	const { data: user, isLoading: isLoadingUser } = useQuery(selfQueryOptions)
	const [isClearingCache, setIsClearingCache] = useState(false)

	const handleSignIn = () => {
		router.push('/sign-in')
	}

	const handleSignOut = () => {
		Alert.alert(t`Sign Out`, t`Are you sure you want to sign out?`, [
			{
				text: t`Cancel`,
				style: 'cancel',
			},
			{
				text: t`Sign Out`,
				style: 'destructive',
				onPress: async () => {
					// Clear SecureStore token on native (web uses cookie)
					if (Platform.OS !== 'web') {
						await SecureStore.deleteItemAsync('auth_session')
					}

					// Clear query cache
					await clearAllCache()
				},
			},
		])
	}

	const handleClearCache = () => {
		Alert.alert(
			t`Clear Cache`,
			t`This will clear all cached data including menu items. The app will reload fresh data from the server. Continue?`,
			[
				{
					text: t`Cancel`,
					style: 'cancel',
				},
				{
					text: t`Clear Cache`,
					style: 'destructive',
					onPress: async () => {
						setIsClearingCache(true)
						try {
							await clearAllCache()
							Alert.alert(
								t`Cache Cleared`,
								t`All cached data has been cleared successfully.`,
								[{ text: t`OK` }],
							)
						} catch (error) {
							console.error('Failed to clear cache:', error)
							Alert.alert(
								t`Error`,
								t`Failed to clear cache. Please try again.`,
								[{ text: t`OK` }],
							)
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
				<title>More - TOLO</title>
				<meta name="description" content="Settings and information for TOLO." />
				<meta property="og:title" content="More - TOLO" />
				<meta property="og:url" content="/more" />
			</Head>
			<ScreenContainer contentContainerStyle={styles.scrollContent}>
				{/* User Information Section */}
				<View style={styles.section}>
					<H2 style={styles.sectionTitle}>
						<Trans>Account</Trans>
					</H2>
					<View style={styles.card}>
						{Boolean(user) ? (
							<>
								{isLoadingUser ? (
									<View style={styles.userInfoLoading}>
										<Paragraph style={styles.userInfoText}>
											<Trans>Loading user information...</Trans>
										</Paragraph>
									</View>
								) : user ? (
									<>
										<View style={styles.userInfo}>
											<Label style={styles.userInfoLabel}>
												<Trans>Phone</Trans>
											</Label>
											<Text style={styles.userInfoValue}>
												{user.phone || <Trans>Not provided</Trans>}
											</Text>
										</View>

										{user.name && (
											<>
												<View style={styles.userInfoDivider} />
												<View style={styles.userInfo}>
													<Label style={styles.userInfoLabel}>
														<Trans>Name</Trans>
													</Label>
													<Text style={styles.userInfoValue}>{user.name}</Text>
												</View>
											</>
										)}

										{user.email && (
											<>
												<View style={styles.userInfoDivider} />
												<View style={styles.userInfo}>
													<Label style={styles.userInfoLabel}>
														<Trans>Email</Trans>
													</Label>
													<Text style={styles.userInfoValue}>{user.email}</Text>
												</View>
											</>
										)}

										<View style={styles.userInfoDivider} />
										<Button onPress={handleSignOut}>
											<Trans>Sign Out</Trans>
										</Button>
									</>
								) : (
									<View style={styles.userInfoError}>
										<Paragraph style={styles.userInfoText}>
											<Trans>Unable to load user information</Trans>
										</Paragraph>
									</View>
								)}
							</>
						) : (
							<>
								<Paragraph style={styles.signInPrompt}>
									<Trans>
										Sign in to view your account information and access
										personalized features.
									</Trans>
								</Paragraph>
								<Button onPress={handleSignIn}>
									<Trans>Sign In</Trans>
								</Button>
							</>
						)}
					</View>
				</View>

				<View style={styles.section}>
					<H2 style={styles.sectionTitle}>
						<Trans>Settings</Trans>
					</H2>
					<View style={styles.card}>
						<View style={styles.settingRow}>
							<Label style={styles.settingLabel}>
								<Trans>Language</Trans>
							</Label>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<View style={styles.languageDropdownTrigger}>
										<Label style={styles.languageDropdownText}>
											{currentLanguage === 'en' ? 'English' : 'Español'}
										</Label>
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

						{/* Simple list entries that navigate to detail screens */}
						<TouchableOpacity
							style={styles.settingRow}
							onPress={() => router.push('/more/profile')}
						>
							<Label style={styles.settingLabel}>
								<Trans>Profile</Trans>
							</Label>
							<Text style={styles.caret}>›</Text>
						</TouchableOpacity>
						<View style={styles.settingDivider} />

						<TouchableOpacity
							style={styles.settingRow}
							onPress={() => router.push('/more/visit-us')}
						>
							<Label style={styles.settingLabel}>
								<Trans>Visit Us</Trans>
							</Label>
							<Text style={styles.caret}>›</Text>
						</TouchableOpacity>
						<View style={styles.settingDivider} />
						<TouchableOpacity
							style={styles.settingRow}
							onPress={() => router.push('/more/connect')}
						>
							<Label style={styles.settingLabel}>
								<Trans>Connect</Trans>
							</Label>
							<Text style={styles.caret}>›</Text>
						</TouchableOpacity>

						<Button onPress={handleClearCache} disabled={isClearingCache}>
							{isClearingCache ? (
								<Trans>Clearing Cache...</Trans>
							) : (
								<Trans>Clear Cache</Trans>
							)}
						</Button>
						<Paragraph style={styles.clearCacheDescription}>
							<Trans>
								Clear all cached data and reload fresh content from the server.
							</Trans>
						</Paragraph>
					</View>
				</View>
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	scrollContent: {
		paddingBottom: theme.spacing.xl,
	},
	section: {
		paddingHorizontal: theme.layout.screenPadding,
		marginBottom: theme.spacing.lg,
	},
	sectionTitle: {
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
		color: theme.colors.text,
	},
	settingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: theme.spacing.md,
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
		marginVertical: 0,
	},
	clearCacheButton: {
		backgroundColor: theme.colors.primary,
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
	caret: {
		color: theme.colors.textSecondary,
		fontSize: 30,
		marginLeft: theme.spacing.sm,
	},
	// User Information Styles
	userInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: theme.spacing.sm,
	},
	userInfoLabel: {
		color: theme.colors.text,
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
		color: theme.colors.textSecondary,
		textAlign: 'center',
	},
	signInPrompt: {
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
		backgroundColor: theme.colors.primary,
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
