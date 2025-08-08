import type { ComponentProps } from 'react'
import { ScrollView } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export type Props = ComponentProps<typeof ScrollView>

export function ScreenContainer({
	children,
	contentInsetAdjustmentBehavior = 'automatic',
	style,
	...rest
}: Props) {
	return (
		<ScrollView
			contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
			style={[styles.container, style]}
			{...rest}
		>
			{children}
		</ScrollView>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		backgroundColor: theme.colors.background,
		flex: 1,
	},
}))

export default ScreenContainer
