import { Stack } from 'expo-router'
import { t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'

export default function OrdersLayout() {
	const { i18n } = useLingui()

	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: t(i18n)`Orders` }} />
		</Stack>
	)
}
