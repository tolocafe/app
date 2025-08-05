import { Link, Stack } from 'expo-router'
import Head from 'expo-router/head'
import { StyleSheet, Text, View } from 'react-native'

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
				<Text style={styles.title}>This screen does not exist.</Text>
				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>Go to home screen!</Text>
				</Link>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 16,
		color: '#0a7ea4',
	},
})
