import { useState } from 'react'
import {
	Alert,
	Platform,
	Pressable,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

import { Trans, useLingui } from '@lingui/react/macro'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { z } from 'zod/v4'

import { Button } from '@/components/Button'
import { H2, Label, Paragraph, Text } from '@/components/Text'
import {
	requestOtpMutationOptions,
	verifyOtpMutationOptions,
} from '@/lib/queries/auth'
import { isValidPhoneNumber } from '@/lib/utils/phone'

const handleClose = () => {
	router.back()
}

export default function SignIn() {
	const { t } = useLingui()
	const { itemName } = useLocalSearchParams<{ itemName?: string }>()
	const [stage, setStage] = useState<'code' | 'phone'>('phone')
	const queryClient = useQueryClient()

	const requestOtpMutation = useMutation(requestOtpMutationOptions)
	const verifyOtpMutation = useMutation({
		...verifyOtpMutationOptions,
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ['self'] })

			router.replace('/')
		},
	})

	// Zod schemas
	const phoneSchema = z
		.string()
		.trim()
		.min(1, t`Please enter a phone number`)
		.refine((value) => isValidPhoneNumber(value), t`Enter a valid phone number`)

	const codeSchema = z
		.string()
		.trim()
		.regex(/^\d{6}$/u, t`The code must be 6 digits`)

	const form = useForm({
		defaultValues: {
			code: '',
			phone: '',
		},
		async onSubmit({ value }) {
			try {
				if (stage === 'phone') {
					await requestOtpMutation.mutateAsync({ phone: value.phone.trim() })
					setStage('code')
					// Reset code field meta/value when moving to next stage
					form.setFieldValue('code', '')
					form.resetField('code')
					return
				}

				await verifyOtpMutation.mutateAsync({
					code: value.code.trim(),
					phone: value.phone.trim(),
					sessionName: Platform.OS,
				})
			} catch (error) {
				if (stage === 'phone') {
					Alert.alert(
						t`Error`,
						(error as Error).message || t`Failed to send code`,
					)
				} else {
					Alert.alert(
						t`Error`,
						(error as Error).message || t`Invalid verification code`,
					)
				}
			}
		},
	})

	const handleGoBack = () => {
		setStage('phone')
		form.setFieldValue('code', '')
		form.resetField('code')
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
								<form.Field
									name="phone"
									validators={{
										onChange: ({ value }) => {
											const result = phoneSchema.safeParse(value)
											if (!result.success)
												return result.error.issues[0]?.message
										},
									}}
								>
									{(field) => (
										<>
											<TextInput
												autoComplete="tel"
												keyboardType="phone-pad"
												onBlur={field.handleBlur}
												onChangeText={field.handleChange}
												placeholder={t`+1234567890`}
												style={styles.input}
												textContentType="telephoneNumber"
												value={field.state.value}
											/>
											{field.state.meta.isTouched &&
											field.state.meta.errors.length > 0 ? (
												<Text style={styles.errorText}>
													{field.state.meta.errors[0]}
												</Text>
											) : null}
										</>
									)}
								</form.Field>
							</View>

							<Button
								disabled={requestOtpMutation.isPending || !form.state.canSubmit}
								onPress={() => form.handleSubmit()}
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
								<Trans>We sent a code to {form.state.values.phone}</Trans>
							</Paragraph>

							<View style={styles.inputContainer}>
								<Label style={styles.label}>
									<Trans>Verification code</Trans>
								</Label>
								<form.Field
									name="code"
									validators={{
										onChange: ({ value }) => {
											const result = codeSchema.safeParse(value)

											if (!result.success)
												return result.error.issues[0]?.message
										},
									}}
								>
									{(field) => (
										<>
											<TextInput
												autoComplete="sms-otp"
												keyboardType="number-pad"
												maxLength={6}
												onBlur={field.handleBlur}
												onChangeText={field.handleChange}
												placeholder={t`123456`}
												style={styles.input}
												textContentType="oneTimeCode"
												value={field.state.value}
											/>
											{field.state.meta.isTouched &&
											field.state.meta.errors.length > 0 ? (
												<Text style={styles.errorText}>
													{field.state.meta.errors[0]}
												</Text>
											) : null}
										</>
									)}
								</form.Field>
							</View>

							<Button
								disabled={verifyOtpMutation.isPending || !form.state.canSubmit}
								onPress={() => form.handleSubmit()}
							>
								{verifyOtpMutation.isPending ? (
									<Trans>Verifying...</Trans>
								) : (
									<Trans>Verify</Trans>
								)}
							</Button>

							<Pressable onPress={handleGoBack} style={styles.backButton}>
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
	authContainer: {
		gap: theme.spacing.md,
	},
	backButton: {
		alignItems: 'center',
		marginTop: theme.spacing.md,
	},
	backButtonText: {
		color: theme.colors.primary,
	},
	closeButton: {
		padding: theme.spacing.sm,
	},
	closeButtonText: {
		color: theme.colors.text,
		fontSize: theme.typography.h3.fontSize,
	},
	container: {
		backgroundColor: theme.colors.background,
		flex: 1,
		padding: theme.layout.screenPadding,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
	},
	errorText: {
		color: theme.colors.error,
		marginTop: theme.spacing.xs,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	input: {
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.sm,
		borderWidth: 1,
		color: theme.colors.text,
		padding: theme.spacing.sm,
	},
	inputContainer: {
		marginBottom: theme.spacing.md,
	},
	label: {
		color: theme.colors.text,
		marginBottom: theme.spacing.xs,
	},
	message: {
		color: theme.colors.textSecondary,
	},
	messageContainer: {
		marginBottom: theme.spacing.md,
		marginTop: theme.spacing.md,
	},
	subtitle: {
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.md,
	},
	title: {
		marginBottom: theme.spacing.xs,
	},
}))
