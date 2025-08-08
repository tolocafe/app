import { Trans } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { Linking, View } from 'react-native'
import { H2 } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

export default function Connect() {
	const handleCall = () => {
		Linking.openURL('tel:+14155551234')
	}

	const handleWebsite = () => {
		Linking.openURL('https://tolo.cafe')
	}

	const handleInstagram = () => {
		Linking.openURL('https://instagram.com/tolo.cafe')
	}

	return (
		<>
			<Head>
				<title>Connect - TOLO Buen Café</title>
				<meta
					name="description"
					content="Connect with TOLO: call, website, Instagram."
				/>
				<meta property="og:title" content="Connect - TOLO Buen Café" />
				<meta property="og:url" content="/more/connect" />
			</Head>
			<ScreenContainer contentContainerStyle={styles.scrollContent}>
				<View style={styles.section}>
					<H2 style={styles.sectionTitle}>
						<Trans>Connect</Trans>
					</H2>
					<View style={styles.card}>
						<Button onPress={handleCall}>
							<Trans>Call (415) 555-1234</Trans>
						</Button>
						<Button onPress={handleWebsite}>
							<Trans>Visit tolocoffee.com</Trans>
						</Button>
						<Button onPress={handleInstagram}>
							<Trans>Follow @tolocoffee</Trans>
						</Button>
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
}))
