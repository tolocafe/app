import type { ReactNode } from 'react'
import type { ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export interface ScreenContainerProps
	extends Omit<ScrollViewProps, 'contentInsetAdjustmentBehavior'> {
	children: ReactNode
}

export function ScreenContainer({
	children,
	style,
	contentContainerStyle,
	...rest
}: ScreenContainerProps) {
	return (
		<ScrollView
			contentInsetAdjustmentBehavior="automatic"
			style={[styles.container, style]}
			contentContainerStyle={contentContainerStyle}
			{...rest}
		>
			{children}
		</ScrollView>
	)
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
}))

export default ScreenContainer
