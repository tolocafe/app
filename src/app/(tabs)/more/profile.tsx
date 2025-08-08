import { useMemo } from 'react'
import { TextInput, View } from 'react-native'

import { Trans, useLingui } from '@lingui/react/macro'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Head from 'expo-router/head'
import { StyleSheet } from 'react-native-unistyles'
import { z } from 'zod/v4'

import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'
import { Label, Text } from '@/components/Text'
import {
	selfQueryOptions,
	updateClientMutationOptions,
} from '@/lib/queries/auth'

import type { ClientData } from '@/lib/api'

export default function ProfileScreen() {
	const { t } = useLingui()
	const queryClient = useQueryClient()

	const { data: user } = useQuery(selfQueryOptions)

	const nameSchema = z
		.string()
		.trim()
		.min(1, t`Please enter your name`)

	const emailSchema = z.email(t`Enter a valid email`).trim()

	const form = useForm({
		defaultValues: {
			client_name: getFullName(user?.firstname, user?.lastname),
			email: user?.email || '',
		},
	})

	const isDirty = useMemo(
		() =>
			getFullName(user?.firstname, user?.lastname) !==
				form.state.values.client_name ||
			(user?.email ?? '') !== form.state.values.email,
		[
			user?.firstname,
			user?.lastname,
			user?.email,
			form.state.values.client_name,
			form.state.values.email,
		],
	)

	const updateMutation = useMutation({
		...updateClientMutationOptions(user?.client_id ?? ''),
		onSuccess(updated: ClientData) {
			queryClient.setQueryData(selfQueryOptions.queryKey, updated)
		},
	})

	const handleSave = async () => {
		if (!user?.client_id || !isDirty) return
		await updateMutation.mutateAsync({
			email: form.state.values.email,
			name: form.state.values.client_name,
		})
	}

	const balanceCents = Number(user?.ewallet ?? '0')
	const balance = (balanceCents / 100).toFixed(2)

	return (
		<>
			<Head>
				<title>{t`Profile`}</title>
			</Head>
			<ScreenContainer>
				<View style={styles.card}>
					<Label style={styles.sectionTitle}>
						<Trans>Personal Information</Trans>
					</Label>

					<View style={styles.row}>
						<Label style={styles.label}>
							<Trans>First name</Trans>
						</Label>
						<form.Field
							name="client_name"
							validators={{
								onChange: ({ value }) => {
									const result = nameSchema.safeParse(value)
									if (!result.success) return result.error.issues[0]?.message
								},
							}}
						>
							{(field) => (
								<TextInput
									autoCapitalize="words"
									onBlur={field.handleBlur}
									onChangeText={field.handleChange}
									placeholder={t`Enter your first name`}
									style={styles.input}
									value={field.state.value}
								/>
							)}
						</form.Field>
					</View>

					<View style={styles.row}>
						<Label style={styles.label}>
							<Trans>Email</Trans>
						</Label>
						<form.Field
							name="email"
							validators={{
								onChange: ({ value }) => {
									const result = emailSchema.safeParse(value)
									if (!result.success) return result.error.issues[0]?.message
								},
							}}
						>
							{(field) => (
								<TextInput
									autoCapitalize="none"
									autoCorrect={false}
									keyboardType="email-address"
									onBlur={field.handleBlur}
									onChangeText={field.handleChange}
									placeholder={t`name@example.com`}
									style={styles.input}
									value={field.state.value}
								/>
							)}
						</form.Field>
					</View>

					<Button
						disabled={!isDirty || updateMutation.isPending}
						onPress={handleSave}
					>
						{updateMutation.isPending ? (
							<Trans>Saving...</Trans>
						) : (
							<Trans>Save</Trans>
						)}
					</Button>
				</View>

				<View style={styles.card}>
					<Label style={styles.sectionTitle}>
						<Trans>Wallet</Trans>
					</Label>
					<View style={styles.balanceRow}>
						<Label style={styles.balanceLabel}>
							<Trans>Balance</Trans>
						</Label>
						<Text style={styles.balanceValue}>${balance}</Text>
					</View>
				</View>
			</ScreenContainer>
		</>
	)
}

function getFullName(
	firstname: string | undefined,
	lastname: string | undefined,
) {
	return `${firstname}${lastname ? ` ${lastname}` : ''}`
}

const styles = StyleSheet.create((theme) => ({
	balanceLabel: {
		color: theme.colors.text,
	},
	balanceRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	balanceValue: {
		color: theme.colors.primary,
		fontSize: theme.fontSizes.xl,
		fontWeight: theme.fontWeights.bold,
	},
	card: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.lg,
		margin: theme.layout.screenPadding,
		padding: theme.spacing.lg,
	},
	container: {
		flex: 1,
	},
	input: {
		backgroundColor: theme.colors.background,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		color: theme.colors.text,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
	},

	label: {
		color: theme.colors.text,
		marginBottom: theme.spacing.xs,
	},
	row: {
		marginBottom: theme.spacing.md,
	},
	sectionTitle: {
		color: theme.colors.text,
		marginBottom: theme.spacing.md,
	},
}))
