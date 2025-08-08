import { renderHook } from '@testing-library/react-native'
import { useLanguage } from '../language-context'

describe('useLanguage hook', () => {
	it('throws error when useLanguage is used outside provider', () => {
		// Suppress console.error for this test
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

		expect(() => {
			renderHook(() => useLanguage())
		}).toThrow('useLanguage must be used within a LanguageProvider')

		consoleSpy.mockRestore()
	})
})
