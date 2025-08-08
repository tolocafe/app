import { Platform } from 'react-native'

export const defaultStackScreenOptions = Platform.select({
	ios: {
		headerLargeTitle: true,
		headerTransparent: true,
	},
})
