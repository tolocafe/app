import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Trans } from '@lingui/react/macro'
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
	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<View style={styles.modal}>
					<Pressable onPress={(e) => e.stopPropagation()}>
						<View style={styles.header}>
							<TouchableOpacity onPress={onClose} style={styles.closeButton}>
								<Text style={styles.closeButtonText}>✕</Text>
							</TouchableOpacity>
						</View>

						{itemName && (
							<View style={styles.messageContainer}>
								<Text style={styles.message}>
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
		borderTopLeftRadius: theme.borderRadius.xl,
		borderTopRightRadius: theme.borderRadius.xl,
		paddingTop: theme.spacing.lg,
		paddingBottom: theme.spacing.xxl,
		minHeight: 400,
		backgroundColor: theme.colors.background,
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
