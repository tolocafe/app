import { StyleSheet } from 'react-native-unistyles'

const lightTheme = {
	borderRadius: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		full: 9999,
	} as const,
	colors: {
		background: '#F8F8F1',
		border: '#E0E0E0',
		error: '#D32F2F',
		primary: '#3D6039',
		surface: '#FFFFFF',
		text: '#0C0C0C',
		textSecondary: '#666666',
	},
	fontSizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		xxl: 24,
		xxxl: 32,
	} as const,
	fontWeights: {
		regular: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	} as const,
	spacing: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		xxl: 32,
	} as const,
	layout: {
		screenPadding: 16,
	} as const,
	typography: {
		body: {
			fontSize: 16,
			fontWeight: '400',
		},
		caption: {
			fontSize: 14,
			fontWeight: '400',
		},
		h1: {
			fontSize: 32,
			fontWeight: '700',
		},
		h2: {
			fontSize: 24,
			fontWeight: '600',
		},
		h3: {
			fontSize: 20,
			fontWeight: '600',
		},
		h4: {
			fontSize: 18,
			fontWeight: '600',
		},
		button: {
			fontSize: 14,
			fontWeight: '600',
			letterSpacing: 0.5,
		},
	} as const,
}

const darkTheme = {
	...lightTheme,
	colors: {
		background: '#121212',
		border: '#333333',
		error: '#EF5350',
		primary: '#8BC34A',
		surface: '#1E1E1E',
		text: '#FFFFFF',
		textSecondary: '#B0B0B0',
	} satisfies (typeof lightTheme)['colors'],
}

const breakpoints = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	superLarge: 2000,
	tvLike: 4000,
} as const

const themes = {
	dark: darkTheme,
	light: lightTheme,
}

StyleSheet.configure({
	breakpoints,
	settings: { adaptiveThemes: true },
	themes,
})

type AppBreakpoints = typeof breakpoints
type AppThemes = typeof themes

declare module 'react-native-unistyles' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface UnistylesBreakpoints extends AppBreakpoints {}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface UnistylesThemes extends AppThemes {}
}
