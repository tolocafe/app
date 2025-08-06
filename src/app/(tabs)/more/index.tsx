import { useLanguage } from '@/lib/contexts/language-context'
import { clearAllCache } from '@/lib/queries'
import { Trans } from '@lingui/react/macro'
import Head from 'expo-router/head'
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

export default function More() {
	const { currentLanguage, changeLanguage } = useLanguage()
	const [isClearingCache, setIsClearingCache] = useState(false)

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
			'This will clear all cached data including menu items and preferences. The app will reload fresh data from the server. Continue?',
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
						<Trans>About TOLO</Trans>
					</Text>
					<View style={styles.card}>
						<Text style={styles.aboutText}>
							<Trans>
								A neighborhood coffee shop dedicated to serving the finest
								locally-roasted coffee. We create a warm, welcoming space where
								community comes together over exceptional coffee.
							</Trans>
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						<Trans>Settings</Trans>
					</Text>
					<View style={styles.card}>
						<Text style={styles.settingLabel}>
							<Trans>Language</Trans>
						</Text>
						<View style={styles.languageContainer}>
							<TouchableOpacity
								style={[
									styles.languageButton,
									currentLanguage === 'en' && styles.languageButtonActive,
								]}
								onPress={() => changeLanguage('en')}
							>
								<Text
									style={[
										styles.languageButtonText,
										currentLanguage === 'en' && styles.languageButtonTextActive,
									]}
								>
									English
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.languageButton,
									currentLanguage === 'es' && styles.languageButtonActive,
								]}
								onPress={() => changeLanguage('es')}
							>
								<Text
									style={[
										styles.languageButtonText,
										currentLanguage === 'es' && styles.languageButtonTextActive,
									]}
								>
									Español
								</Text>
							</TouchableOpacity>
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
	aboutText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.textSecondary,
		lineHeight: 24,
	},
	settingLabel: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
	languageContainer: {
		flexDirection: 'row',
		gap: theme.spacing.sm,
	},
	languageButton: {
		flex: 1,
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.md,
		borderRadius: theme.borderRadius.sm,
		backgroundColor: theme.colors.background,
		alignItems: 'center',
	},
	languageButtonActive: {
		backgroundColor: theme.colors.primary,
	},
	languageButtonText: {
		fontSize: theme.typography.body.fontSize,
		color: theme.colors.text,
	},
	languageButtonTextActive: {
		color: theme.colors.surface,
		fontWeight: theme.typography.body.fontWeight,
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
}))
