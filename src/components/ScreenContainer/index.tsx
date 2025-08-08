import type { ReactNode } from 'react'
import type { ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export type ScreenContainerProps = Omit<
	ScrollViewProps,
	'contentInsetAdjustmentBehavior'
> & {
	children: ReactNode
}

export function ScreenContainer({
	children,
	contentContainerStyle,
	style,
	...rest
}: ScreenContainerProps) {
	return (
		<ScrollView
			contentContainerStyle={contentContainerStyle}
			contentInsetAdjustmentBehavior="automatic"
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
