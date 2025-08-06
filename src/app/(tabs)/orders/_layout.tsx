import { Stack } from 'expo-router'
import { useLingui } from '@lingui/react/macro'
import { defaultStackScreenOptions } from '@/lib/navigation'

export default function OrdersLayout() {
	const { t } = useLingui()

	return (
		<Stack screenOptions={defaultStackScreenOptions}>
			<Stack.Screen name="index" options={{ title: t`Orders` }} />
		</Stack>
	)
}
