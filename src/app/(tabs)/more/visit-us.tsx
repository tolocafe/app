import { Trans } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { Linking, View } from 'react-native'
import { Text, H3, Label } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

export default function VisitUs() {
	const handleDirections = () => {
		const address = '123 Coffee Street, San Francisco, CA 94105'
		const url = `https://maps.apple.com/?address=${encodeURIComponent(address)}`
		Linking.openURL(url)
	}

	return (
		<>
			<Head>
				<title>Visítanos - TOLO Buen Café</title>
				<meta
					name="description"
					content="Ven a conocer TOLO en 123 Coffee Street, San Francisco. Aquí encontrarás nuestros horarios y cómo llegar."
				/>
				<meta property="og:title" content="Visítanos - TOLO Buen Café" />
				<meta property="og:url" content="/more/visit-us" />
			</Head>
			<ScreenContainer>
				<View style={styles.section}>
					<View style={styles.card}>
						<Text style={styles.cardTitle}>
							<Trans>TOLO Coffee Shop</Trans>
						</Text>
						<Label style={styles.cardText}>123 Coffee Street</Label>
						<Label style={styles.cardText}>San Francisco, CA 94105</Label>

						<View style={styles.hoursContainer}>
							<H3 style={styles.hoursTitle}>
								<Trans>Hours</Trans>
							</H3>
							<View style={styles.hoursRow}>
								<Label style={styles.dayText}>
									<Trans>Monday - Friday</Trans>
								</Label>
								<Label style={styles.hoursText}>6:00 AM - 8:00 PM</Label>
							</View>
							<View style={styles.hoursRow}>
								<Label style={styles.dayText}>
									<Trans>Saturday</Trans>
								</Label>
								<Label style={styles.hoursText}>7:00 AM - 9:00 PM</Label>
							</View>
							<View style={styles.hoursRow}>
								<Label style={styles.dayText}>
									<Trans>Sunday</Trans>
								</Label>
								<Label style={styles.hoursText}>7:00 AM - 7:00 PM</Label>
							</View>
						</View>

						<Button onPress={handleDirections}>
							<Trans>Get Directions</Trans>
						</Button>
					</View>
				</View>
			</ScreenContainer>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
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
		color: theme.colors.text,
		marginBottom: theme.spacing.xs,
	},
	cardText: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.xs,
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
		color: theme.colors.text,
	},
	hoursText: {
		color: theme.colors.textSecondary,
	},
}))
