import { Stack } from 'expo-router'
import { t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'

export default function MenuLayout() {
	const { i18n } = useLingui()

	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: t(i18n)`Menu` }} />
		</Stack>
	)
}
