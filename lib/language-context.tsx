'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Locale, getTranslations, Translations } from './i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  translations: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr') // Default to French as per requirements
  
  const translations = getTranslations(locale)
  
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('healthcare-ai-locale', locale)
  }, [locale])

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('healthcare-ai-locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
      setLocale(savedLocale)
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}