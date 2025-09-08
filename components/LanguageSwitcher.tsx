'use client'

import { useLanguage } from '@/lib/language-context'
import { LanguageIcon } from '@heroicons/react/24/outline'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'fr' : 'en')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
      title={locale === 'en' ? 'Switch to French' : 'Passer en anglais'}
    >
      <LanguageIcon className="h-4 w-4" />
      <span>{locale === 'en' ? 'FR' : 'EN'}</span>
    </button>
  )
}