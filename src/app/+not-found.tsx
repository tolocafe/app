import '@/lib/styles/unistyles'

import { Link, Stack } from 'expo-router'
import Head from 'expo-router/head'
import { View } from 'react-native'
import { H1, Text } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'

export default function NotFoundScreen() {
	return (
		<>
			<Head>
				<title>Página No Encontrada - TOLO</title>
				<meta
					name="description"
					content="Oops, esta página no existe. Regresa a TOLO para disfrutar de nuestro buen café y descubrir todo lo que tenemos para ti."
				/>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View style={styles.container}>
				<H1 style={styles.title}>This screen does not exist.</H1>
				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>Go to home screen!</Text>
				</Link>
			</View>
		</>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.layout.screenPadding,
		backgroundColor: theme.colors.background,
	},
	title: {
		fontSize: theme.fontSizes.xl,
		fontWeight: theme.fontWeights.bold,
		color: theme.colors.text,
	},
	link: {
		marginTop: theme.spacing.md,
		paddingVertical: theme.spacing.md,
	},
	linkText: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.primary,
	},
}))
