import '@/lib/styles/unistyles'

import { View } from 'react-native'

import { Link, Stack } from 'expo-router'
import Head from 'expo-router/head'
import { StyleSheet } from 'react-native-unistyles'
import { Trans, useLingui } from '@lingui/react/macro'

import { H1, Text } from '@/components/Text'

export default function NotFoundScreen() {
	const { t } = useLingui()
	return (
		<>
			<Head>
				<title>{t`Página No Encontrada - TOLO`}</title>
				<meta
					content={t`Oops, esta página no existe. Regresa a TOLO para disfrutar de nuestro buen café y descubrir todo lo que tenemos para ti.`}
					name="description"
				/>
				<meta content="noindex, nofollow" name="robots" />
			</Head>
			<Stack.Screen options={{ title: t`Oops!` }} />
			<View style={styles.container}>
				<H1 style={styles.title}>
					<Trans>This screen does not exist.</Trans>
				</H1>
				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>
						<Trans>Go to home screen!</Trans>
					</Text>
				</Link>
			</View>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		flex: 1,
		justifyContent: 'center',
		padding: theme.layout.screenPadding,
	},
	link: {
		marginTop: theme.spacing.md,
		paddingVertical: theme.spacing.md,
	},
	linkText: {
		color: theme.colors.primary,
		fontSize: theme.fontSizes.md,
	},
	title: {
		color: theme.colors.text,
		fontSize: theme.fontSizes.xl,
		fontWeight: theme.fontWeights.bold,
	},
}))
