import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import {
	TouchableOpacity,
	View,
	TextInput,
	Pressable,
	Alert,
	Platform,
} from 'react-native'
import { Text, H2, Paragraph, Label } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	requestOtpMutationOptions,
	verifyOtpMutationOptions,
} from '@/lib/queries/auth'
import { Button } from '@/components/Button'

export default function SignInModal() {
	const { t } = useLingui()
	const { itemName } = useLocalSearchParams<{ itemName?: string }>()
	const [stage, setStage] = useState<'phone' | 'code'>('phone')
	const [phone, setPhone] = useState('')
	const [code, setCode] = useState('')
	const queryClient = useQueryClient()

	const requestOtpMutation = useMutation(requestOtpMutationOptions)
	const verifyOtpMutation = useMutation({
		...verifyOtpMutationOptions,
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['self'] })

			router.replace('/')
		},
	})

	const handleClose = () => {
		router.back()
	}

	const sendCode = async () => {
		if (!phone.trim()) {
			Alert.alert(t`Error`, t`Please enter a phone number`)
			return
		}

		try {
			await requestOtpMutation.mutateAsync({ phone: phone.trim() })
			setStage('code')
		} catch (error: any) {
			Alert.alert(t`Error`, error.message || t`Failed to send code`)
		}
	}

	const handleVerify = async () => {
		if (!code.trim()) {
			Alert.alert(t`Error`, t`Please enter the verification code`)
			return
		}

		try {
			await verifyOtpMutation.mutateAsync({
				phone: phone.trim(),
				code: code.trim(),
				sessionName: Platform.OS,
			})
		} catch (error: any) {
			Alert.alert(t`Error`, error.message || t`Invalid verification code`)
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
					<Paragraph style={styles.message}>
						<Trans>Sign in to add &ldquo;{itemName}&rdquo; to your bag</Trans>
					</Paragraph>
				</View>
			)}

			<View style={styles.content}>
				<View style={styles.authContainer}>
					{stage === 'phone' ? (
						<>
							<H2 style={styles.title}>
								<Trans>Sign in with your phone</Trans>
							</H2>
							<Paragraph style={styles.subtitle}>
								<Trans>We&apos;ll send you a verification code</Trans>
							</Paragraph>

							<View style={styles.inputContainer}>
								<Label style={styles.label}>
									<Trans>Phone number</Trans>
								</Label>
								<TextInput
									style={styles.input}
									value={phone}
									onChangeText={setPhone}
									keyboardType="phone-pad"
									placeholder={t`+1234567890`}
									autoComplete="tel"
									textContentType="telephoneNumber"
								/>
							</View>

							<Button
								onPress={sendCode}
								disabled={requestOtpMutation.isPending}
							>
								{requestOtpMutation.isPending ? (
									<Trans>Sending...</Trans>
								) : (
									<Trans>Send Code</Trans>
								)}
							</Button>
						</>
					) : (
						<>
							<H2 style={styles.title}>
								<Trans>Enter verification code</Trans>
							</H2>
							<Paragraph style={styles.subtitle}>
								<Trans>We sent a code to {phone}</Trans>
							</Paragraph>

							<View style={styles.inputContainer}>
								<Label style={styles.label}>
									<Trans>Verification code</Trans>
								</Label>
								<TextInput
									style={styles.input}
									value={code}
									onChangeText={setCode}
									keyboardType="number-pad"
									placeholder={t`123456`}
									maxLength={6}
									autoComplete="sms-otp"
									textContentType="oneTimeCode"
								/>
							</View>

							<Button
								onPress={handleVerify}
								disabled={verifyOtpMutation.isPending}
							>
								{verifyOtpMutation.isPending ? (
									<Trans>Verifying...</Trans>
								) : (
									<Trans>Verify</Trans>
								)}
							</Button>

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
		padding: theme.layout.screenPadding,
		backgroundColor: theme.colors.background,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	closeButton: {
		padding: theme.spacing.sm,
	},
	closeButtonText: {
		fontSize: theme.typography.h3.fontSize,
		color: theme.colors.text,
	},
	messageContainer: {
		marginTop: theme.spacing.md,
		marginBottom: theme.spacing.md,
	},
	message: {
		color: theme.colors.textSecondary,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
	},
	authContainer: {
		gap: theme.spacing.md,
	},
	title: {
		marginBottom: theme.spacing.xs,
	},
	subtitle: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.md,
	},
	inputContainer: {
		marginBottom: theme.spacing.md,
	},
	label: {
		color: theme.colors.text,
		marginBottom: theme.spacing.xs,
	},
	input: {
		borderWidth: 1,
		borderColor: theme.colors.border,
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.sm,
		color: theme.colors.text,
		backgroundColor: theme.colors.surface,
	},
	backButton: {
		marginTop: theme.spacing.md,
		alignItems: 'center',
	},
	backButtonText: {
		color: theme.colors.primary,
	},
}))
