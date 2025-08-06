import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Trans } from '@lingui/react/macro'
import { Colors } from '@/lib/constants/colors'
import { useColorScheme } from '@/lib/hooks/use-color-scheme'
import NotSignedIn from '@/components/NotSignedIn'

interface SignInModalProps {
	visible: boolean
	onClose: () => void
	itemName?: string
}

export default function SignInModal({
	visible,
	onClose,
	itemName,
}: SignInModalProps) {
	const colorScheme = useColorScheme()

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

						{itemName && (
							<View style={styles.messageContainer}>
								<Text
									style={[
										styles.message,
										{ color: Colors[colorScheme ?? 'light'].text },
									]}
								>
									<Trans>
										Sign in to add &ldquo;{itemName}&rdquo; to your bag
									</Trans>
								</Text>
							</View>
						)}

						<View style={styles.content}>
							<NotSignedIn onSignIn={onClose} />
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
		minHeight: 400,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingHorizontal: 24,
		marginBottom: 16,
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
	messageContainer: {
		paddingHorizontal: 24,
		marginBottom: 24,
	},
	message: {
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 24,
	},
	content: {
		flex: 1,
	},
}))
