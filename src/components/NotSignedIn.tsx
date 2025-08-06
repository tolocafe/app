import * as AppleAuthentication from 'expo-apple-authentication'
import { Trans, useLingui } from '@lingui/react/macro'
import { Alert, Text, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useAuth } from '@/lib/hooks/use-auth'

interface NotSignedInProps {
	onSignIn?: () => void
}

export default function NotSignedIn({ onSignIn }: NotSignedInProps = {}) {
	const { t } = useLingui()
	const { signIn } = useAuth()

	const handleAppleSignIn = async () => {
		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			})

			if (credential.identityToken) {
				const authUser = {
					id: credential.user,
					email: credential.email,
					fullName: credential.fullName
						? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
						: null,
					identityToken: credential.identityToken,
					authorizationCode: credential.authorizationCode || undefined,
				}
				signIn(authUser)
				onSignIn?.()
			}
		} catch (error: any) {
			console.log(error)
			if (error.code === 'ERR_CANCELED') {
				// User canceled the sign-in flow
				return
			}
			Alert.alert(
				t`Sign In Error`,
				t`There was an error signing in. Please try again.`,
			)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>
					<Trans>Sign In Required</Trans>
				</Text>
				<Text style={styles.subtitle}>
					<Trans>Please sign in to access this feature</Trans>
				</Text>
				<AppleAuthentication.AppleAuthenticationButton
					buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
					buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
					cornerRadius={8}
					style={styles.appleButton}
					onPress={handleAppleSignIn}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.lg,
	},
	content: {
		alignItems: 'center',
		maxWidth: 300,
	},
	title: {
		fontSize: theme.fontSizes.xxl,
		fontWeight: theme.fontWeights.bold,
		textAlign: 'center',
		marginBottom: theme.spacing.sm,
		color: theme.colors.text,
	},
	subtitle: {
		fontSize: theme.fontSizes.md,
		textAlign: 'center',
		marginBottom: theme.spacing.xl,
		opacity: 0.8,
		color: theme.colors.text,
	},
	appleButton: {
		width: 200,
		height: 44,
	},
}))
