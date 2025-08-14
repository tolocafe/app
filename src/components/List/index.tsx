import type { ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import { TouchableOpacity, View } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import { StyleSheet } from 'react-native-unistyles'

import { Card } from '@/components/Card'
import { Label, Text } from '@/components/Text'

export type ListItemProps = {
	accessibilityRole?: 'button' | 'link'
	accessory?: ReactNode
	centered?: boolean
	chevron?: boolean
	children?: ReactNode
	disabled?: boolean
	icon?: ReactNode
	label?: ReactNode
	labelColor?: 'default' | 'primary' | 'secondary'
	onPress?: () => void
	style?: object
	testID?: string
	text?: ReactNode
}

export type ListProps = {
	children: ReactNode
	style?: object
	testID?: string
}

export function List({ children, style, testID }: ListProps) {
	const items = Children.toArray(children).filter(
		(child) => typeof child !== 'boolean',
	)
	return (
		<Card style={style} testID={testID}>
			{items.map((child, index) => {
				const key =
					isValidElement(child) && child.key != null ? child.key : index

				const showDivider = index < items.length - 1

				return (
					<View key={key}>
						{child}
						{showDivider ? <View style={styles.divider} /> : null}
					</View>
				)
			})}
		</Card>
	)
}

export function ListItem({
	accessibilityRole,
	accessory,
	centered = false,
	chevron = false,
	children,
	disabled = false,
	icon,
	label,
	labelColor = 'default',
	onPress,
	style,
	testID,
	text,
}: ListItemProps) {
	const Container = TouchableOpacity
	const showChevron = chevron && !accessory

	return (
		<Container
			accessibilityRole={accessibilityRole}
			disabled={disabled || !onPress}
			onPress={onPress}
			style={[styles.itemRow, centered && styles.itemRowCentered, style]}
			testID={testID}
		>
			{icon ? <View style={styles.leftIconContainer}>{icon}</View> : null}

			{/* Custom content mode */}
			{children ? (
				<View style={styles.customContentContainer}>{children}</View>
			) : (
				<>
					{/* Main content */}
					{centered ? (
						<Label
							style={[
								styles.label,
								styles.centeredLabel,
								labelColorStyles[labelColor],
							]}
						>
							{label}
						</Label>
					) : (
						<>
							<Label style={[styles.label, labelColorStyles[labelColor]]}>
								{label}
							</Label>
							<Text style={styles.valueText}>{text}</Text>
						</>
					)}

					{/* Accessory (custom) or chevron */}
					{accessory ? (
						<View style={styles.accessoryContainer}>{accessory}</View>
					) : showChevron ? (
						<Ionicons
							color={styles.caret.color}
							name="chevron-forward"
							size={20}
						/>
					) : null}
				</>
			)}
		</Container>
	)
}

const styles = StyleSheet.create((theme) => ({
	accessoryContainer: {
		marginLeft: theme.spacing.sm,
	},
	caret: {
		color: theme.colors.textSecondary,
		fontSize: 30,
		marginLeft: theme.spacing.sm,
	},
	centeredLabel: {
		textAlign: 'center',
		width: '100%',
	},
	customContentContainer: {
		flex: 1,
	},
	divider: {
		backgroundColor: theme.colors.border,
		height: 1,
		marginVertical: 0,
	},
	itemRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: theme.spacing.md,
	},
	itemRowCentered: {
		justifyContent: 'center',
	},
	label: {
		color: theme.colors.text,
		flex: 1,
	},
	leftIconContainer: {
		marginRight: theme.spacing.sm,
	},
	valueText: {
		color: theme.colors.textSecondary,
		flex: 2,
		textAlign: 'right',
	},
}))

const labelColorStyles = StyleSheet.create((theme) => ({
	default: {
		color: theme.colors.text,
	},
	primary: {
		color: theme.colors.primary,
	},
	secondary: {
		color: theme.colors.textSecondary,
	},
}))
