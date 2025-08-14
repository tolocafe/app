import type { ComponentProps } from 'react'
import { ScrollView, View } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'

export type Props = ComponentProps<typeof ScrollView> & {
	keyboardAware?: boolean
	noScroll?: boolean
}

export function ScreenContainer({
	children,
	contentInsetAdjustmentBehavior = 'automatic',
	keyboardAware = false,
	noScroll = false,
	style,
	...rest
}: Props) {
	if (noScroll) {
		return (
			<View style={[styles.container, style]} {...rest}>
				{children}
			</View>
		)
	}

	if (keyboardAware) {
		return (
			<KeyboardAwareScrollView
				automaticallyAdjustsScrollIndicatorInsets
				contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
				keyboardDismissMode="interactive"
				keyboardShouldPersistTaps="handled"
				style={[styles.container, style]}
				{...rest}
			>
				{children}
			</KeyboardAwareScrollView>
		)
	}

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
