import { Text as RNText } from 'react-native'
import type { TextProps as RNTextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export type AppTextProps = RNTextProps & {
	children?: React.ReactNode
}

export function H1({
	accessibilityRole = 'header',
	style,
	...rest
}: AppTextProps) {
	return (
		<RNText
			accessibilityRole={accessibilityRole}
			{...rest}
			style={[styles.text, styles.h1, style]}
		/>
	)
}

export function H2({
	accessibilityRole = 'header',
	style,
	...rest
}: AppTextProps) {
	return (
		<RNText
			accessibilityRole={accessibilityRole}
			{...rest}
			style={[styles.text, styles.h2, style]}
		/>
	)
}

export function H3({
	accessibilityRole = 'header',
	style,
	...rest
}: AppTextProps) {
	return (
		<RNText
			accessibilityRole={accessibilityRole}
			{...rest}
			style={[styles.text, styles.h3, style]}
		/>
	)
}

export function H4({
	accessibilityRole = 'header',
	style,
	...rest
}: AppTextProps) {
	return (
		<RNText
			accessibilityRole={accessibilityRole}
			{...rest}
			style={[styles.text, styles.h4, style]}
		/>
	)
}

export function Label({ style, ...rest }: AppTextProps) {
	return <RNText {...rest} style={[styles.text, styles.label, style]} />
}

export function Paragraph({ style, ...rest }: AppTextProps) {
	return <RNText {...rest} style={[styles.text, styles.paragraph, style]} />
}

export function Text({ style, ...rest }: AppTextProps) {
	return <RNText {...rest} style={[styles.text, style]} />
}

const styles = StyleSheet.create((theme) => ({
	h1: {
		color: theme.colors.text,
		fontSize: theme.typography.h1.fontSize,
		fontWeight: theme.typography.h1.fontWeight,
	},
	h2: {
		color: theme.colors.text,
		fontSize: theme.typography.h2.fontSize,
		fontWeight: theme.typography.h2.fontWeight,
	},
	h3: {
		color: theme.colors.text,
		fontSize: theme.typography.h3.fontSize,
		fontWeight: theme.typography.h3.fontWeight,
	},
	h4: {
		color: theme.colors.textSecondary,
		fontSize: theme.typography.h4.fontSize,
		fontWeight: theme.typography.h4.fontWeight,
	},
	label: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
	paragraph: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
		lineHeight: theme.fontSizes.xl,
	},
	text: {
		color: theme.colors.text,
	},
}))
