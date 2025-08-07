import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import {
	Text,
	TouchableOpacity,
	View,
	TextInput,
	Pressable,
	Alert,
	Platform,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Trans } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	requestOtpMutationOptions,
	verifyOtpMutationOptions,
} from '@/lib/queries/auth'
import { useMMKVString } from 'react-native-mmkv'
import { STORAGE_KEYS } from '@/lib/constants/storage'

export default function SignInModal() {
	const { itemName } = useLocalSearchParams<{ itemName?: string }>()
	const [stage, setStage] = useState<'phone' | 'code'>('phone')
	const [phone, setPhone] = useState('')
	const [code, setCode] = useState('')
	const queryClient = useQueryClient()
	const [, setToken] = useMMKVString(STORAGE_KEYS.AUTH_SESSION)

	const requestOtpMutation = useMutation(requestOtpMutationOptions)
	const verifyOtpMutation = useMutation({
		...verifyOtpMutationOptions,
		onSuccess: (data) => {
			setToken(data.token)
			queryClient.invalidateQueries({ queryKey: ['self'] })

			router.replace('/')
		},
	})

	const handleClose = () => {
		router.back()
	}

	const sendCode = async () => {
		if (!phone.trim()) {
			Alert.alert('Error', 'Please enter a phone number')
			return
		}

		try {
			await requestOtpMutation.mutateAsync({ phone: phone.trim() })
			setStage('code')
		} catch (error: any) {
			Alert.alert('Error', error.message || 'Failed to send code')
		}
	}

	const handleVerify = async () => {
		if (!code.trim()) {
			Alert.alert('Error', 'Please enter the verification code')
			return
		}

		try {
			await verifyOtpMutation.mutateAsync({
				phone: phone.trim(),
				code: code.trim(),
				sessionName: Platform.OS,
			})
		} catch (error: any) {
			Alert.alert('Error', error.message || 'Invalid verification code')
		}
	}

	const handleGoBack = () => {
		setStage('phone')
		setCode('')
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
				<View style={styles.authContainer}>
					{stage === 'phone' ? (
						<>
							<Text style={styles.title}>
								<Trans>Sign in with your phone</Trans>
							</Text>
							<Text style={styles.subtitle}>
								<Trans>We&apos;ll send you a verification code</Trans>
							</Text>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>
									<Trans>Phone number</Trans>
								</Text>
								<TextInput
									style={styles.input}
									value={phone}
									onChangeText={setPhone}
									keyboardType="phone-pad"
									placeholder="+1234567890"
									autoComplete="tel"
									textContentType="telephoneNumber"
								/>
							</View>

							<Pressable
								style={[
									styles.button,
									requestOtpMutation.isPending && styles.buttonDisabled,
								]}
								onPress={sendCode}
								disabled={requestOtpMutation.isPending}
							>
								<Text style={styles.buttonText}>
									{requestOtpMutation.isPending ? (
										<Trans>Sending...</Trans>
									) : (
										<Trans>Send Code</Trans>
									)}
								</Text>
							</Pressable>
						</>
					) : (
						<>
							<Text style={styles.title}>
								<Trans>Enter verification code</Trans>
							</Text>
							<Text style={styles.subtitle}>
								<Trans>We sent a code to {phone}</Trans>
							</Text>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>
									<Trans>Verification code</Trans>
								</Text>
								<TextInput
									style={styles.input}
									value={code}
									onChangeText={setCode}
									keyboardType="number-pad"
									placeholder="123456"
									maxLength={6}
									autoComplete="sms-otp"
									textContentType="oneTimeCode"
								/>
							</View>

							<Pressable
								style={[
									styles.button,
									verifyOtpMutation.isPending && styles.buttonDisabled,
								]}
								onPress={handleVerify}
								disabled={verifyOtpMutation.isPending}
							>
								<Text style={styles.buttonText}>
									{verifyOtpMutation.isPending ? (
										<Trans>Verifying...</Trans>
									) : (
										<Trans>Verify</Trans>
									)}
								</Text>
							</Pressable>

							<Pressable style={styles.backButton} onPress={handleGoBack}>
								<Text style={styles.backButtonText}>
									<Trans>← Change phone number</Trans>
								</Text>
							</Pressable>
						</>
					)}
				</View>
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
	authContainer: {
		gap: theme.spacing.lg,
		padding: theme.spacing.lg,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: theme.colors.text,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: theme.colors.textSecondary,
		textAlign: 'center',
		marginBottom: theme.spacing.md,
	},
	inputContainer: {
		gap: theme.spacing.sm,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: theme.colors.text,
	},
	input: {
		borderWidth: 1,
		borderColor: theme.colors.border,
		backgroundColor: theme.colors.surface,
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		fontSize: 16,
		color: theme.colors.text,
	},
	button: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		marginTop: theme.spacing.md,
	},
	buttonDisabled: {
		backgroundColor: theme.colors.textSecondary,
		opacity: 0.6,
	},
	buttonText: {
		color: theme.colors.surface,
		fontSize: 16,
		fontWeight: '600',
	},
	backButton: {
		alignItems: 'center',
		padding: theme.spacing.sm,
		marginTop: theme.spacing.md,
	},
	backButtonText: {
		color: theme.colors.primary,
		fontSize: 14,
	},
}))
