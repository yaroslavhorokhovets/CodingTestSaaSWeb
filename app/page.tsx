'use client'

import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
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
            <div className="flex space-x-4">
              {session ? (
                <>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Tableau de bord
                  </button>
                  <button
                    onClick={() => router.push('/profile')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => router.push('/auth/register')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Inscription
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
            Révolutionnez votre
            <span className="text-primary-600 block">pratique médicale</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Solution SaaS alimentée par l'IA pour les professionnels de santé. 
            Transcription en temps réel, notes structurées, codage médical automatique 
            et génération de documents sécurisés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Accéder au tableau de bord
                </button>
                <button
                  onClick={() => router.push('/consultation/new')}
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Nouvelle consultation
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Commencer gratuitement
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Se connecter
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
              Transcription en temps réel
            </h3>
            <p className="text-gray-600">
              Transcription automatique des consultations avec l'IA Whisper pour une précision optimale.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <DocumentTextIcon className="h-12 w-12 text-medical-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Notes structurées SOAP/DAP
            </h3>
            <p className="text-gray-600">
              Génération automatique de notes médicales structurées selon votre spécialité.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ChartBarIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Codage médical automatique
            </h3>
            <p className="text-gray-600">
              Suggestions automatiques de codes NGAP/CCAM/ICD-10/DSM-5 selon votre spécialité.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <DocumentTextIcon className="h-12 w-12 text-medical-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Génération de documents
            </h3>
            <p className="text-gray-600">
              Création automatique d'ordonnances, lettres et rapports avec validation médicale.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ShieldCheckIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sécurité & Conformité
            </h3>
            <p className="text-gray-600">
              Hébergement HDS certifié, chiffrement AES-256 et conformité GDPR.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ClockIcon className="h-12 w-12 text-medical-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gain de temps
            </h3>
            <p className="text-gray-600">
              Réduction significative du temps administratif pour plus de temps patient.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sécurité et Confidentialité
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Toutes les données sont chiffrées et stockées de manière sécurisée. 
              L'IA assiste mais ne remplace jamais le jugement médical du praticien, 
              qui reste seul responsable de ses décisions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Healthcare AI Assistant. Tous droits réservés.</p>
            <p className="mt-2 text-sm">
              Solution certifiée HDS • Conforme GDPR • Hébergement France/EU
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}