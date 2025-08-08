module.exports = {
	projects: [
		// For utility tests (no React Native components)
		{
			displayName: 'utils',
			testMatch: [
				'<rootDir>/src/lib/utils/**/*.test.ts',
				'<rootDir>/src/lib/hooks/**/*.test.ts',
				'<rootDir>/src/lib/queries/**/*.test.ts',
			],
			testEnvironment: 'node',
			moduleNameMapper: {
				'^@/(.*)$': '<rootDir>/src/$1',
			},
		},
		// For component tests (React Native/Expo components)
		{
			displayName: 'components',
			preset: 'react-native',
			testMatch: [
				'<rootDir>/src/components/**/*.test.tsx',
				'<rootDir>/src/app/**/*.test.tsx',
				'<rootDir>/src/lib/contexts/**/*.test.tsx',
				'<rootDir>/src/lib/hooks/**/*.test.tsx',
			],
			setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
			moduleNameMapper: {
				'^@/(.*)$': '<rootDir>/src/$1',
			},
			transformIgnorePatterns: [
				'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-unistyles|@bottom-tabs|react-native-mmkv|zustand|ky))',
			],
		},
	],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/index.ts',
		'!src/lib/locales/**',
		'!**/__tests__/**',
		'!**/coverage/**',
		'!**/node_modules/**',
	],
}
