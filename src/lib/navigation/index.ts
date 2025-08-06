import { Platform } from 'react-native'

export const defaultStackScreenOptions = Platform.select({
	ios: {
		headerTransparent: true,
		headerLargeTitle: true,
	},
})
