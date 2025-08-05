import { i18n } from '@lingui/core'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { MMKV } from 'react-native-mmkv'

type Language = 'en' | 'es'

interface LanguageContextType {
  currentLanguage: Language
  changeLanguage: (language: Language) => Promise<void>
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
)

const storage = new MMKV()
const LANGUAGE_KEY = 'tolo_language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  useEffect(() => {
    loadStoredLanguage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadStoredLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY)
      if (storedLanguage === 'es' || storedLanguage === 'en') {
        await changeLanguage(storedLanguage)
      }
    } catch (error) {
      console.warn('Failed to load stored language:', error)
    }
  }

  const changeLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language)

      if (language === 'es') {
        const { messages } = await import('../locales/es/messages.js')
        i18n.load('es', messages)
        i18n.activate('es')
      } else {
        const { messages } = await import('../locales/en/messages.js')
        i18n.load('en', messages)
        i18n.activate('en')
      }

      setCurrentLanguage(language)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
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
