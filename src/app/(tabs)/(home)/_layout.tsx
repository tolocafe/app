import { useLingui } from '@lingui/react/macro'
import { Stack } from 'expo-router'

import { defaultStackScreenOptions } from '@/lib/navigation'

export const unstable_settings = {
	initialRouteName: 'index',
}

export default function HomeLayout() {
	const { t } = useLingui()

	return (
		<Stack screenOptions={defaultStackScreenOptions}>
			<Stack.Screen name="index" options={{ title: t`Menu` }} />
			<Stack.Screen
				name="[id]"
				options={{ headerTransparent: true, title: '' }}
			/>
		</Stack>
	)
}
