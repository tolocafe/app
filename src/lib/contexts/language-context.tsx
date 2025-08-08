import { i18n } from '@lingui/core'
import { createContext, useContext, useEffect, useState } from 'react'
import { MMKV } from 'react-native-mmkv'
import * as Sentry from '@sentry/react-native'

type Language = 'en' | 'es'

interface LanguageContextType {
	currentLanguage: Language
	changeLanguage: (language: Language) => Promise<void>
	isReady: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
)

const storage = new MMKV()
const LANGUAGE_KEY = 'tolo_language'

/**
 * Loads and activates language messages
 */
async function loadLanguageMessages(language: Language): Promise<void> {
	try {
		if (language === 'es') {
			const { messages } = await import('@/lib/locales/es/messages.js')
			i18n.load('es', messages)
			i18n.activate('es')
		} else {
			const { messages } = await import('@/lib/locales/en/messages.js')
			i18n.load('en', messages)
			i18n.activate('en')
		}
	} catch (error) {
		Sentry.captureException(error, {
			tags: { feature: 'i18n', operation: 'loadLanguageMessages' },
			extra: { language },
		})
		throw error
	}
}

interface LanguageProviderProps {
	children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
	const [currentLanguage, setCurrentLanguage] = useState<Language>('es')
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		// Initialize i18n on mount
		const initializeLanguage = async () => {
			try {
				// Get stored language or default to 'es' (Spanish)
				const storedLanguage = storage.getString(LANGUAGE_KEY) as
					| Language
					| undefined
				const language =
					storedLanguage === 'es' || storedLanguage === 'en'
						? storedLanguage
						: 'es'

				await loadLanguageMessages(language)
				setCurrentLanguage(language)
				setIsReady(true)
			} catch (error) {
				Sentry.captureException(error, {
					tags: { feature: 'i18n', operation: 'initializeLanguage' },
				})

				// Fallback to Spanish if something goes wrong
				try {
					await loadLanguageMessages('es')
					setCurrentLanguage('es')
				} catch (fallbackError) {
					Sentry.captureException(fallbackError, {
						tags: { feature: 'i18n', operation: 'initializeLanguageFallback' },
					})
				}
				setIsReady(true)
			}
		}

		initializeLanguage()
	}, [])

	const changeLanguage = async (language: Language) => {
		try {
			storage.set(LANGUAGE_KEY, language)
			await loadLanguageMessages(language)
			setCurrentLanguage(language)
		} catch (error) {
			Sentry.captureException(error, {
				tags: { feature: 'i18n', operation: 'changeLanguage' },
				extra: { targetLanguage: language, currentLanguage },
			})
		}
	}

	// Don't render children until i18n is initialized
	if (!isReady) {
		return null
	}

	return (
		<LanguageContext.Provider
			value={{ currentLanguage, changeLanguage, isReady }}
		>
			{children}
		</LanguageContext.Provider>
	)
}

export function useLanguage() {
	const context = useContext(LanguageContext)
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context
}
