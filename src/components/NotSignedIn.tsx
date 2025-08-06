import * as AppleAuthentication from 'expo-apple-authentication'
import { t, Trans } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { Alert, Text, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useAuth } from '@/lib/hooks/use-auth'
import { Colors } from '@/lib/constants/colors'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'

export default function NotSignedIn() {
	const { i18n } = useLingui()
	const { signIn } = useAuth()
	const colorScheme = useColorScheme()

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
			}
		} catch (error: any) {
			if (error.code === 'ERR_CANCELED') {
				// User canceled the sign-in flow
				return
			}
			Alert.alert(
				t(i18n)`Sign In Error`,
				t(i18n)`There was an error signing in. Please try again.`,
			)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text
					style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}
				>
					<Trans>Sign In Required</Trans>
				</Text>
				<Text
					style={[
						styles.subtitle,
						{ color: Colors[colorScheme ?? 'light'].text },
					]}
				>
					<Trans>Please sign in to access this feature</Trans>
				</Text>
				<AppleAuthentication.AppleAuthenticationButton
					buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
					buttonStyle={
						colorScheme === 'dark'
							? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
							: AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
					}
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
		padding: 20,
	},
	content: {
		alignItems: 'center',
		maxWidth: 300,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 32,
		opacity: 0.8,
	},
	appleButton: {
		width: 200,
		height: 44,
	},
}))
