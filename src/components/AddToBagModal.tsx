import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Trans, t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Colors } from '@/lib/constants/colors'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'
import { useAuth } from '@/lib/hooks/use-auth'

interface AddToBagModalProps {
	visible: boolean
	onClose: () => void
	itemName: string
}

export default function AddToBagModal({
	visible,
	onClose,
	itemName,
}: AddToBagModalProps) {
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
				onClose()
			}
		} catch (error: any) {
			if (error.code === 'ERR_CANCELED') {
				// User canceled the sign-in flow
				return
			}
			// Handle error silently or show a toast
		}
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<View
					style={[
						styles.modal,
						{ backgroundColor: Colors[colorScheme ?? 'light'].background },
					]}
				>
					<Pressable onPress={(e) => e.stopPropagation()}>
						<View style={styles.header}>
							<Text
								style={[
									styles.title,
									{ color: Colors[colorScheme ?? 'light'].text },
								]}
							>
								<Trans>Sign In Required</Trans>
							</Text>
							<TouchableOpacity onPress={onClose} style={styles.closeButton}>
								<Text
									style={[
										styles.closeButtonText,
										{ color: Colors[colorScheme ?? 'light'].text },
									]}
								>
									✕
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.content}>
							<Text
								style={[
									styles.message,
									{ color: Colors[colorScheme ?? 'light'].text },
								]}
							>
								<Trans>Sign in to add "{itemName}" to your bag</Trans>
							</Text>

							<AppleAuthentication.AppleAuthenticationButton
								buttonType={
									AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
								}
								buttonStyle={
									colorScheme === 'dark'
										? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
										: AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
								}
								cornerRadius={8}
								style={styles.appleButton}
								onPress={handleAppleSignIn}
							/>

							<TouchableOpacity onPress={onClose} style={styles.cancelButton}>
								<Text
									style={[
										styles.cancelButtonText,
										{ color: Colors[colorScheme ?? 'light'].text },
									]}
								>
									<Trans>Maybe Later</Trans>
								</Text>
							</TouchableOpacity>
						</View>
					</Pressable>
				</View>
			</Pressable>
		</Modal>
	)
}

const styles = StyleSheet.create((theme) => ({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modal: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 20,
		paddingBottom: 40,
		paddingHorizontal: 24,
		minHeight: 300,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	closeButton: {
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	content: {
		alignItems: 'center',
	},
	message: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 32,
		lineHeight: 24,
	},
	appleButton: {
		width: 250,
		height: 44,
		marginBottom: 16,
	},
	cancelButton: {
		paddingVertical: 12,
		paddingHorizontal: 24,
	},
	cancelButtonText: {
		fontSize: 16,
		opacity: 0.7,
	},
}))
