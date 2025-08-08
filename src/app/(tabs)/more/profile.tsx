import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TextInput, View } from 'react-native'
import { Text, Label } from '@/components/Text'
import { StyleSheet } from 'react-native-unistyles'
import { Trans, useLingui } from '@lingui/react/macro'
import Head from 'expo-router/head'
import {
	selfQueryOptions,
	updateClientMutationOptions,
} from '@/lib/queries/auth'
import type { ClientData } from '@/lib/api'
import { Button } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'

function getFullName(
	firstname: string | undefined,
	lastname: string | undefined,
) {
	return `${firstname}${lastname ? ` ${lastname}` : ''}`
}

export default function ProfileScreen() {
	const { t } = useLingui()
	const queryClient = useQueryClient()

	const { data: user } = useQuery(selfQueryOptions)

	const [form, setForm] = useState<{
		client_name: string
		email: string
	}>(() => ({
		client_name: getFullName(user?.firstname, user?.lastname),
		email: user?.email || '',
	}))

	const isDirty = useMemo(() => {
		return (
			getFullName(user?.firstname, user?.lastname) !== form.client_name ||
			(user?.email ?? '') !== form.email
		)
	}, [
		user?.firstname,
		user?.lastname,
		user?.email,
		form.client_name,
		form.email,
	])

	const updateMutation = useMutation({
		...updateClientMutationOptions(user?.client_id ?? ''),
		onSuccess(updated: ClientData) {
			queryClient.setQueryData(selfQueryOptions.queryKey, updated)
		},
	})

	const handleChange = (key: keyof typeof form, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const handleSave = async () => {
		if (!user?.client_id || !isDirty) return
		await updateMutation.mutateAsync({
			name: form.client_name,
			email: form.email,
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
						<TextInput
							style={styles.input}
							value={form.client_name}
							onChangeText={(v) => handleChange('client_name', v)}
							placeholder={t`Enter your first name`}
							autoCapitalize="words"
						/>
					</View>

					<View style={styles.row}>
						<Label style={styles.label}>
							<Trans>Email</Trans>
						</Label>
						<TextInput
							style={styles.input}
							value={form.email}
							onChangeText={(v) => handleChange('email', v)}
							placeholder={t`name@example.com`}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</View>

					<Button
						onPress={handleSave}
						disabled={!isDirty || updateMutation.isPending}
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

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
	},
	card: {
		backgroundColor: theme.colors.surface,
		borderRadius: theme.borderRadius.lg,
		margin: theme.layout.screenPadding,
		padding: theme.spacing.lg,
	},
	sectionTitle: {
		color: theme.colors.text,
		marginBottom: theme.spacing.md,
	},
	row: {
		marginBottom: theme.spacing.md,
	},
	label: {
		color: theme.colors.text,
		marginBottom: theme.spacing.xs,
	},
	input: {
		backgroundColor: theme.colors.background,
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.md,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		color: theme.colors.text,
	},

	balanceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	balanceLabel: {
		color: theme.colors.text,
	},
	balanceValue: {
		color: theme.colors.primary,
		fontSize: theme.fontSizes.xl,
		fontWeight: theme.fontWeights.bold,
	},
}))
