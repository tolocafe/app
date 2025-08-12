import { useLocalSearchParams } from 'expo-router'

import ScreenContainer from '@/components/ScreenContainer'
import { Text } from '@/components/Text'

export default function OrderDetail() {
	const { id } = useLocalSearchParams<{ id: string }>()

	return (
		<ScreenContainer>
			<Text>OrderDetail {id}</Text>
		</ScreenContainer>
	)
}
