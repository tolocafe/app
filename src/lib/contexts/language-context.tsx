import { i18n } from '@lingui/core'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { MMKV } from 'react-native-mmkv'

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
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

				// Load messages based on language
				if (language === 'es') {
					const { messages } = await import('@/lib/locales/es/messages.js')
					i18n.load('es', messages)
					i18n.activate('es')
				} else {
					const { messages } = await import('@/lib/locales/en/messages.js')
					i18n.load('en', messages)
					i18n.activate('en')
				}

				setCurrentLanguage(language)
				setIsReady(true)
			} catch (error) {
				console.error('Failed to initialize language:', error)
				// Fallback to Spanish if something goes wrong
				const { messages } = await import('@/lib/locales/es/messages.js')
				i18n.load('es', messages)
				i18n.activate('es')
				setCurrentLanguage('es')
				setIsReady(true)
			}
		}

		initializeLanguage()
	}, [])

	const changeLanguage = async (language: Language) => {
		try {
			storage.set(LANGUAGE_KEY, language)

			if (language === 'es') {
				const { messages } = await import('@/lib/locales/es/messages.js')
				i18n.load('es', messages)
				i18n.activate('es')
			} else {
				const { messages } = await import('@/lib/locales/en/messages.js')
				i18n.load('en', messages)
				i18n.activate('en')
			}

			setCurrentLanguage(language)
		} catch (error) {
			console.error('Failed to change language:', error)
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
