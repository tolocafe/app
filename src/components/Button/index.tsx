import { Pressable, View } from 'react-native'
import { Text } from '@/components/Text'
import type { ReactNode } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

type ButtonVariant = 'primary' | 'surface'

export interface ButtonProps {
	children: ReactNode
	onPress?: (event: GestureResponderEvent) => void
	disabled?: boolean
	variant?: ButtonVariant
	accessibilityLabel?: string
	testID?: string
}

export function Button({
	children,
	onPress,
	disabled = false,
	variant = 'primary',
	accessibilityLabel,
	testID,
}: ButtonProps) {
	const isPrimary = variant === 'primary'

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			testID={testID}
			disabled={disabled}
			onPress={onPress}
			style={({ pressed }) => [
				styles.button,
				isPrimary ? styles.buttonPrimary : styles.buttonSurface,
				disabled && styles.buttonDisabled,
				pressed && !disabled && styles.buttonPressed,
			]}
		>
			<View style={styles.contentWrapper}>
				<Text
					style={[
						styles.text,
						isPrimary ? styles.textOnPrimary : styles.textOnSurface,
					]}
					numberOfLines={1}
				>
					{children}
				</Text>
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create((theme) => ({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: theme.borderRadius.lg,
	},
	buttonPrimary: {
		backgroundColor: theme.colors.primary,
	},
	buttonSurface: {
		backgroundColor: theme.colors.surface,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonPressed: {
		opacity: 0.85,
	},
	contentWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing.xs,
	},
	text: {
		textTransform: 'uppercase',
		...theme.typography.button,
	},
	textOnPrimary: {
		color: theme.colors.surface,
	},
	textOnSurface: {
		color: theme.colors.text,
	},
}))
