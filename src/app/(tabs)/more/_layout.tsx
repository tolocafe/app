import { Stack } from 'expo-router'
import { useLingui } from '@lingui/react/macro'
import { defaultStackScreenOptions } from '@/lib/navigation'

export const unstable_settings = {
	initialRouteName: 'index',
}

export default function MoreLayout() {
	const { t } = useLingui()

	return (
		<Stack screenOptions={defaultStackScreenOptions}>
			<Stack.Screen name="index" options={{ title: t`More` }} />
			<Stack.Screen name="visit-us" options={{ title: t`Visit Us` }} />
			<Stack.Screen name="connect" options={{ title: t`Connect` }} />
			<Stack.Screen name="profile" options={{ title: t`Profile` }} />
		</Stack>
	)
}
