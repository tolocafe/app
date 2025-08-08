import { useState } from 'react'
import { Alert, Platform, TouchableOpacity, View } from 'react-native'

import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import Head from 'expo-router/head'
import * as SecureStore from 'expo-secure-store'
import { StyleSheet } from 'react-native-unistyles'
import * as DropdownMenu from 'zeego/dropdown-menu'

import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'
import { H2, Label, Paragraph, Text } from '@/components/Text'
import { useLanguage } from '@/lib/contexts/language-context'
import { selfQueryOptions } from '@/lib/queries/auth'
import { clearAllCache } from '@/lib/queries/cache-utils'

const handleSignIn = () => {
	router.push('/sign-in')
}

export default function More() {
	const { t } = useLingui()
	const { changeLanguage, currentLanguage } = useLanguage()
	const { data: user, isLoading: isLoadingUser } = useQuery(selfQueryOptions)
	const [isClearingCache, setIsClearingCache] = useState(false)

	const handleSignOut = () => {
		Alert.alert(t`Sign Out`, t`Are you sure you want to sign out?`, [
			{
				style: 'cancel',
				text: t`Cancel`,
			},
			{
				onPress: async () => {
					// Clear SecureStore token on native (web uses cookie)
					if (Platform.OS !== 'web') {
						await SecureStore.deleteItemAsync('auth_session')
					}

					// Clear query cache
					await clearAllCache()
				},
				style: 'destructive',
				text: t`Sign Out`,
			},
		])
	}

	const handleClearCache = () => {
		Alert.alert(
			t`Clear Cache`,
			t`This will clear all cached data including menu items. The app will reload fresh data from the server. Continue?`,
			[
				{
					style: 'cancel',
					text: t`Cancel`,
				},
				{
					onPress: async () => {
						setIsClearingCache(true)
						try {
							await clearAllCache()
							Alert.alert(
								t`Cache Cleared`,
								t`All cached data has been cleared successfully.`,
								[{ text: t`OK` }],
							)
						} catch {
							Alert.alert(
								t`Error`,
								t`Failed to clear cache. Please try again.`,
								[{ text: t`OK` }],
							)
						} finally {
							setIsClearingCache(false)
						}
					},
					style: 'destructive',
					text: t`Clear Cache`,
				},
			],
		)
	}

	return (
		<>
			<Head>
				<title>More - TOLO</title>
				<meta content="Settings and information for TOLO." name="description" />
				<meta content="More - TOLO" property="og:title" />
				<meta content="/more" property="og:url" />
			</Head>
			<ScreenContainer contentContainerStyle={styles.scrollContent}>
				{/* User Information Section */}
				<View style={styles.section}>
					<H2 style={styles.sectionTitle}>
						<Trans>Account</Trans>
					</H2>
					<View style={styles.card}>
						{user ? (
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
						) : isLoadingUser ? (
							<View style={styles.userInfoLoading}>
								<Paragraph style={styles.userInfoText}>
									<Trans>Loading user information...</Trans>
								</Paragraph>
							</View>
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
							onPress={() => router.push('/more/profile')}
							style={styles.settingRow}
						>
							<Label style={styles.settingLabel}>
								<Trans>Profile</Trans>
							</Label>
							<Text style={styles.caret}>›</Text>
						</TouchableOpacity>
						<View style={styles.settingDivider} />

						<TouchableOpacity
							onPress={() => router.push('/more/visit-us')}
							style={styles.settingRow}
						>
							<Label style={styles.settingLabel}>
								<Trans>Visit Us</Trans>
							</Label>
							<Text style={styles.caret}>›</Text>
						</TouchableOpacity>
						<View style={styles.settingDivider} />
						<TouchableOpacity
							onPress={() => router.push('/more/connect')}
							style={styles.settingRow}
						>
							<Label style={styles.settingLabel}>
								<Trans>Connect</Trans>
							</Label>
							<Text style={styles.caret}>›</Text>
						</TouchableOpacity>

						<Button disabled={isClearingCache} onPress={handleClearCache}>
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
	button: {
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		marginTop: theme.spacing.lg,
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.md,
	},
	buttonText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	card: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.lg,
		padding: theme.spacing.lg,
	},
	cardText: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.body.fontSize,
		lineHeight: 22,
		marginBottom: theme.spacing.xs,
	},
	cardTitle: {
		color: theme.colors.text,
		fontSize: theme.typography.h3.fontSize,
		fontWeight: theme.typography.h3.fontWeight,
		marginBottom: theme.spacing.xs,
	},
	caret: {
		color: theme.colors.textSecondary,
		fontSize: 30,
		marginLeft: theme.spacing.sm,
	},
	clearCacheButton: {
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.sm,
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.md,
	},
	clearCacheButtonDisabled: {
		backgroundColor: theme.colors.border,
	},
	clearCacheDescription: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.caption.fontSize,
		lineHeight: 18,
		textAlign: 'center',
	},
	clearCacheText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	clearCacheTextDisabled: {
		color: theme.colors.textSecondary,
	},
	contactButton: {
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.sm,
		marginBottom: theme.spacing.xs,
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.md,
	},
	contactButtonText: {
		color: theme.colors.primary,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
		textAlign: 'center',
	},
	dayText: {
		color: theme.colors.text,
		fontSize: theme.typography.body.fontSize,
	},
	hoursContainer: {
		marginBottom: theme.spacing.sm,
		marginTop: theme.spacing.lg,
	},

	hoursRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: theme.spacing.xs,
	},
	hoursText: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.body.fontSize,
	},
	hoursTitle: {
		...theme.typography.h4,
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	languageDropdownArrow: {
		color: theme.colors.textSecondary,
		fontSize: 12,
		marginLeft: theme.spacing.sm,
	},
	languageDropdownText: {
		color: theme.colors.text,
		flex: 1,
	},
	languageDropdownTrigger: {
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.sm,
		borderWidth: 1,
		flexDirection: 'row',
		minWidth: 120,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
	},
	scrollContent: {
		paddingBottom: theme.spacing.xl,
	},
	section: {
		marginBottom: theme.spacing.lg,
		paddingHorizontal: theme.layout.screenPadding,
	},
	sectionTitle: {
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	settingDivider: {
		backgroundColor: theme.colors.border,
		height: 1,
		marginVertical: 0,
	},
	settingLabel: {
		color: theme.colors.text,
	},
	settingRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: theme.spacing.md,
	},
	signInButton: {
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.md,
	},
	signInButtonText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	signInPrompt: {
		color: theme.colors.textSecondary,
		lineHeight: 22,
		marginBottom: theme.spacing.lg,
		textAlign: 'center',
	},
	signOutButton: {
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		marginTop: theme.spacing.sm,
		paddingHorizontal: theme.spacing.lg,
		paddingVertical: theme.spacing.md,
	},
	signOutButtonText: {
		color: theme.colors.surface,
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	// User Information Styles
	userInfo: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: theme.spacing.sm,
	},
	userInfoDivider: {
		backgroundColor: theme.colors.border,
		height: 1,
		marginVertical: theme.spacing.xs,
	},
	userInfoError: {
		alignItems: 'center',
		paddingVertical: theme.spacing.lg,
	},
	userInfoLabel: {
		color: theme.colors.text,
		flex: 1,
	},
	userInfoLoading: {
		alignItems: 'center',
		paddingVertical: theme.spacing.lg,
	},
	userInfoText: {
		color: theme.colors.textSecondary,
		textAlign: 'center',
	},
	userInfoValue: {
		color: theme.colors.textSecondary,
		flex: 2,
		fontSize: theme.typography.body.fontSize,
		textAlign: 'right',
	},
}))
