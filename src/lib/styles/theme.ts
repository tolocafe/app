export const lightTheme = {
	colors: {
		// Brand colors
		primary: '#8B4513', // Saddle brown - main brand color
		secondary: '#D2691E', // Chocolate - accent color
		tertiary: '#F5DEB3', // Wheat - light accent

		// UI colors
		background: '#FAFAFA',
		surface: '#FFFFFF',
		text: '#1A1A1A',
		textSecondary: '#666666',
		border: '#E0E0E0',

		// Semantic colors
		error: '#DC2626',
		success: '#16A34A',
		warning: '#F59E0B',
		info: '#3B82F6',
	},

	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
		xxl: 48,
	},

	fontSizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 24,
		xxl: 32,
	},

	fontWeights: {
		regular: '400' as const,
		medium: '500' as const,
		semibold: '600' as const,
		bold: '700' as const,
	},

	borderRadius: {
		sm: 4,
		md: 8,
		lg: 12,
		xl: 16,
		full: 9999,
	},

	shadows: {
		sm: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 2,
		},
		md: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 4,
		},
		lg: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.15,
			shadowRadius: 8,
			elevation: 8,
		},
	},
}

export const darkTheme = {
	...lightTheme,
	colors: {
		primary: '#D2691E',
		secondary: '#F5DEB3',
		tertiary: '#8B4513',

		background: '#1A1A1A',
		surface: '#2A2A2A',
		text: '#FAFAFA',
		textSecondary: '#B0B0B0',
		border: '#404040',

		error: '#EF4444',
		success: '#22C55E',
		warning: '#FBBF24',
		info: '#60A5FA',
	},
}
