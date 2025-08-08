import '@testing-library/jest-native/extend-expect'

// Additional mocks for libraries not covered by jest-expo

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
	MMKV: jest.fn(() => ({
		getString: jest.fn(),
		set: jest.fn(),
		delete: jest.fn(),
	})),
}))

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
	captureException: jest.fn(),
	captureMessage: jest.fn(),
	wrap: jest.fn((component) => component),
	reactNavigationIntegration: jest.fn(() => ({
		registerNavigationContainer: jest.fn(),
	})),
}))

// Mock react-native-unistyles
jest.mock('react-native-unistyles', () => ({
	StyleSheet: {
		configure: jest.fn(),
		create: jest.fn(() => ({})),
	},
}))

// Mock Lingui
jest.mock('@lingui/core', () => ({
	i18n: {
		load: jest.fn(),
		activate: jest.fn(),
	},
}))

jest.mock('@lingui/react', () => ({
	I18nProvider: ({ children }) => children,
}))

jest.mock('@lingui/react/macro', () => ({
	Trans: ({ children }) => children,
	useLingui: () => ({
		t: (template) => template.join(''),
	}),
}))

// Mock @bottom-tabs/react-navigation
jest.mock('@bottom-tabs/react-navigation', () => ({
	createNativeBottomTabNavigator: () => ({
		Navigator: 'Navigator',
		Screen: 'Screen',
	}),
}))

// Mock Zustand
jest.mock('zustand', () => ({
	create: jest.fn(() => () => ({})),
}))
