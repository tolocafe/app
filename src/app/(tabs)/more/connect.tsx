import { Linking, View } from 'react-native'

import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ScreenContainer } from '@/components/ScreenContainer'
import { H2 } from '@/components/Text'

const handleCall = () => {
	void Linking.openURL('tel:+14155551234')
}

const handleWebsite = () => {
	void Linking.openURL('https://tolo.cafe')
}

const handleInstagram = () => {
	void Linking.openURL('https://instagram.com/tolo.cafe')
}

export default function Connect() {
	const { t } = useLingui()
	return (
		<>
			<Head>
				<title>{t`Connect - TOLO Buen Café`}</title>
				<meta
					content={t`Connect with TOLO: call, website, Instagram.`}
					name="description"
				/>
				<meta content={t`Connect - TOLO Buen Café`} property="og:title" />
				<meta content="/more/connect" property="og:url" />
			</Head>
			<ScreenContainer contentContainerStyle={styles.scrollContent}>
				<View style={styles.section}>
					<H2 style={styles.sectionTitle}>
						<Trans>Connect</Trans>
					</H2>
					<Card>
						<Button onPress={handleCall}>
							<Trans>Call (415) 555-1234</Trans>
						</Button>
						<Button onPress={handleWebsite}>
							<Trans>Visit tolocoffee.com</Trans>
						</Button>
						<Button onPress={handleInstagram}>
							<Trans>Follow @tolocoffee</Trans>
						</Button>
					</Card>
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
		marginBottom: theme.spacing.lg,
		paddingHorizontal: theme.layout.screenPadding,
	},
	sectionTitle: {
		color: theme.colors.text,
		marginBottom: theme.spacing.sm,
	},
}))
