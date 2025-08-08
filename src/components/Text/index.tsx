import { Text as RNText } from 'react-native'
import type { TextProps as RNTextProps } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export type AppTextProps = RNTextProps & {
	children?: React.ReactNode
}

export function Text({ style, ...rest }: AppTextProps) {
	return <RNText {...rest} style={[styles.text, style]} />
}

export function H1({
	style,
	accessibilityRole = 'header',
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
	style,
	accessibilityRole = 'header',
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
	style,
	accessibilityRole = 'header',
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

export function Paragraph({ style, ...rest }: AppTextProps) {
	return <RNText {...rest} style={[styles.text, styles.paragraph, style]} />
}

export function Label({ style, ...rest }: AppTextProps) {
	return <RNText {...rest} style={[styles.text, styles.label, style]} />
}

const styles = StyleSheet.create((theme) => ({
	text: {
		color: theme.colors.text,
	},
	h1: {
		fontSize: theme.typography.h1.fontSize,
		fontWeight: theme.typography.h1.fontWeight,
	},
	h2: {
		fontSize: theme.typography.h2.fontSize,
		fontWeight: theme.typography.h2.fontWeight,
	},
	h3: {
		fontSize: theme.typography.h3.fontSize,
		fontWeight: theme.typography.h3.fontWeight,
	},
	paragraph: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
		lineHeight: theme.fontSizes.xl,
	},
	label: {
		fontSize: theme.typography.body.fontSize,
		fontWeight: theme.typography.body.fontWeight,
	},
}))
