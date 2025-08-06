import { router, useLocalSearchParams } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Trans } from '@lingui/react/macro'
import { AuthPhone } from '@/components/AuthPhone'

export default function SignInModal() {
	const { itemName } = useLocalSearchParams<{ itemName?: string }>()

	const handleSignInSuccess = () => {
		router.back()
	}

	const handleClose = () => {
		router.back()
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
					<Text style={styles.closeButtonText}>✕</Text>
				</TouchableOpacity>
			</View>

			{itemName && (
				<View style={styles.messageContainer}>
					<Text style={styles.message}>
						<Trans>Sign in to add &ldquo;{itemName}&rdquo; to your bag</Trans>
					</Text>
				</View>
			)}

			<View style={styles.content}>
				<AuthPhone />
			</View>
		</View>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
		paddingTop: theme.spacing.lg,
		paddingBottom: theme.spacing.xxl,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingHorizontal: theme.spacing.lg,
		marginBottom: theme.spacing.md,
	},
	closeButton: {
		width: theme.spacing.xl,
		height: theme.spacing.xl,
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButtonText: {
		fontSize: theme.fontSizes.lg,
		fontWeight: theme.fontWeights.bold,
		color: theme.colors.text,
	},
	messageContainer: {
		paddingHorizontal: theme.spacing.lg,
		marginBottom: theme.spacing.lg,
	},
	message: {
		fontSize: theme.fontSizes.md,
		textAlign: 'center',
		lineHeight: theme.fontSizes.xxl,
		color: theme.colors.text,
	},
	content: {
		flex: 1,
	},
}))
