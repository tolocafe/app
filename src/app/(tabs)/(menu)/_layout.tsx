import { Stack } from 'expo-router'
import { useLingui } from '@lingui/react/macro'
import { defaultStackScreenOptions } from '@/lib/navigation'

export default function MenuLayout() {
	const { t } = useLingui()

	return (
		<Stack screenOptions={defaultStackScreenOptions}>
			<Stack.Screen name="index" options={{ title: t`Menu` }} />
			<Stack.Screen
				name="[id]"
				options={{ title: '', headerTransparent: true }}
			/>
		</Stack>
	)
}
