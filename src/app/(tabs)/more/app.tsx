import { useState } from 'react'
import { Alert, View } from 'react-native'

import { Trans, useLingui } from '@lingui/react/macro'
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import Head from 'expo-router/head'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ScreenContainer } from '@/components/ScreenContainer'
import { H2, Label, Paragraph, Text } from '@/components/Text'
import { useUpdates } from '@/lib/hooks/use-updates'
import { clearAllCache } from '@/lib/queries/cache-utils'

const getStringOrFallback = (value: unknown, fallback: string): string =>
	typeof value === 'string' ? value : fallback

export default function AppInfoScreen() {
	const { t } = useLingui()
	const updates = useUpdates()
	const [isClearingCache, setIsClearingCache] = useState(false)

	const appVersion = getStringOrFallback(nativeApplicationVersion, '0')
	const buildVersion = getStringOrFallback(nativeBuildVersion, '0')

	const channel = updates.channel ?? (__DEV__ ? 'development' : 'N/A')
	const runtimeVersion = updates.runtimeVersion ?? 'N/A'
	const updateId = updates.updateId ?? 'N/A'
	const createdAt = updates.createdAt

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
				<title>{t`App - TOLO`}</title>
				<meta
					content={t`View app information like version and update channel, and clear cached data.`}
					name="description"
				/>
				<meta content={t`App - TOLO`} property="og:title" />
				<meta content="/more/app" property="og:url" />
			</Head>
			<ScreenContainer contentContainerStyle={styles.scrollContent}>
				<View style={styles.section}>
					<H2 style={styles.sectionTitle}>
						<Trans>App Information</Trans>
					</H2>
					<Card>
						<View style={styles.row}>
							<Label style={styles.label}>
								<Trans>Version</Trans>
							</Label>
							<Text style={styles.value}>
								{appVersion} ({buildVersion})
							</Text>
						</View>
						<View style={styles.divider} />
						<View style={styles.row}>
							<Label style={styles.label}>
								<Trans>Update Channel</Trans>
							</Label>
							<Text style={styles.value}>{channel}</Text>
						</View>
						<View style={styles.divider} />
						<View style={styles.row}>
							<Label style={styles.label}>
								<Trans>Runtime Version</Trans>
							</Label>
							<Text style={styles.value}>{runtimeVersion}</Text>
						</View>
						{Boolean(updateId) && (
							<>
								<View style={styles.divider} />
								<View style={styles.row}>
									<Label style={styles.label}>
										<Trans>Update ID</Trans>
									</Label>
									<Text style={styles.value}>{updateId}</Text>
								</View>
							</>
						)}
						{createdAt ? (
							<>
								<View style={styles.divider} />
								<View style={styles.row}>
									<Label style={styles.label}>
										<Trans>Update Created At</Trans>
									</Label>
									<Text style={styles.value}>
										{new Date(createdAt).toLocaleString()}
									</Text>
								</View>
							</>
						) : null}
					</Card>
				</View>

				<View style={styles.section}>
					<H2 style={styles.sectionTitle}>
						<Trans>Maintenance</Trans>
					</H2>
					<Card>
						<Paragraph style={styles.description}>
							<Trans>
								Clear the app cache to remove stored data and reload fresh
								content on next use.
							</Trans>
						</Paragraph>
						<Button disabled={isClearingCache} onPress={handleClearCache}>
							{isClearingCache ? (
								<Trans>Clearing Cache...</Trans>
							) : (
								<Trans>Clear Cache</Trans>
							)}
						</Button>
					</Card>
				</View>
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
	},
	description: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.sm,
	},
	divider: {
		backgroundColor: theme.colors.border,
		height: 1,
		marginVertical: 0,
	},
	label: {
		color: theme.colors.text,
		flex: 1,
	},
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	value: {
		color: theme.colors.textSecondary,
		flex: 2,
		fontSize: theme.typography.body.fontSize,
		textAlign: 'right',
	},
}))
