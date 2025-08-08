import { Stack } from 'expo-router'
import { useLingui } from '@lingui/react/macro'
import { defaultStackScreenOptions } from '@/lib/navigation'

export const unstable_settings = {
	initialRouteName: 'index',
}

export default function OrdersLayout() {
	const { t } = useLingui()

	return (
		<Stack screenOptions={defaultStackScreenOptions}>
			<Stack.Screen name="index" options={{ title: t`Orders` }} />
			<Stack.Screen name="[id]" options={{ title: t`Order Detail` }} />
		</Stack>
	)
}
