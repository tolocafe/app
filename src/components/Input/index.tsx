import type { ComponentProps } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export type InputProps = ComponentProps<typeof RNTextInput> & {
	error?: boolean
}

export function Input({ error = false, style, ...rest }: InputProps) {
	return (
		<RNTextInput
			placeholderTextColor={styles.placeholder.color}
			{...rest}
			style={[
				styles.base,
				error && styles.error,
				rest.multiline && styles.multiline,
				style,
			]}
		/>
	)
}

const styles = StyleSheet.create((theme) => ({
	base: {
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		color: theme.colors.text,
		fontSize: theme.fontSizes.md,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
	},
	error: {
		borderColor: theme.colors.error,
	},
	multiline: {
		minHeight: 80,
		paddingVertical: theme.spacing.md,
		textAlignVertical: 'top',
	},
	placeholder: {
		color: theme.colors.textSecondary,
	},
}))

export default Input
