'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  HeartIcon, 
  MicrophoneIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t, locale } = useLanguage()

  // Don't automatically redirect - let users choose
  // Removed automatic redirect to dashboard

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-medical-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Healthcare AI Assistant
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              {session ? (
                <>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('navigation.dashboard')}
                  </button>
                  <button
                    onClick={() => router.push('/profile')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('navigation.profile')}
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('common.login')}
                  </button>
                  <button
                    onClick={() => router.push('/auth/register')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t('common.signup')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {locale === 'fr' ? (
              <>
                Révolutionnez votre
                <span className="text-primary-600 block">pratique médicale</span>
              </>
            ) : (
              <>
                Revolutionize your
                <span className="text-primary-600 block">medical practice</span>
              </>
            )}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {locale === 'fr' 
              ? "Solution SaaS alimentée par l'IA pour les professionnels de santé. Transcription en temps réel, notes structurées, codage médical automatique et génération de documents sécurisés."
              : "AI-powered SaaS solution for healthcare professionals. Real-time transcription, structured notes, automatic medical coding and secure document generation."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  {t('dashboard.title')}
                </button>
                <button
                  onClick={() => router.push('/consultation/new')}
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  {t('consultations.newConsultation')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  {locale === 'fr' ? 'Commencer gratuitement' : 'Start for free'}
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  {locale === 'fr' ? 'Se connecter' : 'Sign in'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <MicrophoneIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Transcription en temps réel' : 'Real-time Transcription'}
            </h3>
            <p className="text-gray-600">
              {locale === 'fr' 
                ? 'Transcription automatique des consultations avec l\'IA Whisper pour une précision optimale.'
                : 'Automatic consultation transcription with Whisper AI for optimal accuracy.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <DocumentTextIcon className="h-12 w-12 text-medical-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Notes structurées SOAP/DAP' : 'Structured SOAP/DAP Notes'}
            </h3>
            <p className="text-gray-600">
              {locale === 'fr' 
                ? 'Génération automatique de notes médicales structurées selon votre spécialité.'
                : 'Automatic generation of structured medical notes according to your specialty.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ChartBarIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Codage médical automatique' : 'Automatic Medical Coding'}
            </h3>
            <p className="text-gray-600">
              {locale === 'fr' 
                ? 'Suggestions automatiques de codes NGAP/CCAM/ICD-10/DSM-5 selon votre spécialité.'
                : 'Automatic suggestions for NGAP/CCAM/ICD-10/DSM-5 codes according to your specialty.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <DocumentTextIcon className="h-12 w-12 text-medical-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Génération de documents' : 'Document Generation'}
            </h3>
            <p className="text-gray-600">
              {locale === 'fr' 
                ? 'Création automatique d\'ordonnances, lettres et rapports avec validation médicale.'
                : 'Automatic creation of prescriptions, letters and reports with medical validation.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ShieldCheckIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Sécurité & Conformité' : 'Security & Compliance'}
            </h3>
            <p className="text-gray-600">
              {locale === 'fr' 
                ? 'Hébergement HDS certifié, chiffrement AES-256 et conformité GDPR.'
                : 'Certified HDS hosting, AES-256 encryption and GDPR compliance.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ClockIcon className="h-12 w-12 text-medical-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Gain de temps' : 'Time Savings'}
            </h3>
            <p className="text-gray-600">
              {locale === 'fr' 
                ? 'Réduction significative du temps administratif pour plus de temps patient.'
                : 'Significant reduction in administrative time for more patient time.'
              }
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Sécurité et Confidentialité' : 'Security and Privacy'}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'fr' 
                ? "Toutes les données sont chiffrées et stockées de manière sécurisée. L'IA assiste mais ne remplace jamais le jugement médical du praticien, qui reste seul responsable de ses décisions."
                : "All data is encrypted and stored securely. AI assists but never replaces medical judgment of the practitioner, who remains solely responsible for their decisions."
              }
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Healthcare AI Assistant. {locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
            <p className="mt-2 text-sm">
              {locale === 'fr' 
                ? 'Solution certifiée HDS • Conforme GDPR • Hébergement France/EU'
                : 'Certified HDS Solution • GDPR Compliant • France/EU Hosting'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}