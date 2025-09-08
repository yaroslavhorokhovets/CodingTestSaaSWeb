'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardStats } from '@/types'
import { 
  MicrophoneIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardStats()
    }
  }, [status, router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, Dr. {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {user.medicalSpecialty} • {user.organization || 'Cabinet privé'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="security-indicator security-secure">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connexion sécurisée
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/consultation/new"
              className="medical-card hover:shadow-medical transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center group-hover:bg-medical-200 transition-colors">
                    <MicrophoneIcon className="h-6 w-6 text-medical-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Nouvelle consultation</h3>
                  <p className="text-sm text-gray-500">Enregistrer et transcrire</p>
                </div>
              </div>
            </Link>

            <Link
              href="/documents/new"
              className="medical-card hover:shadow-medical transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Nouveau document</h3>
                  <p className="text-sm text-gray-500">Prescription, lettre, rapport</p>
                </div>
              </div>
            </Link>

            <Link
              href="/consultations"
              className="medical-card hover:shadow-medical transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Historique</h3>
                  <p className="text-sm text-gray-500">Consultations récentes</p>
                </div>
              </div>
            </Link>

            <Link
              href="/export"
              className="medical-card hover:shadow-medical transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <DocumentArrowDownIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Exporter</h3>
                  <p className="text-sm text-gray-500">PDF, CSV, FHIR</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MicrophoneIcon className="h-8 w-8 text-medical-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Consultations</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalConsultations}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Documents</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalDocuments}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Durée moyenne</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Math.round(stats.averageConsultationDuration / 60)}min
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentArrowDownIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Exports</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalExports}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Activité récente</h2>
          <div className="card">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <PlusIcon className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.type}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité récente</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par créer votre première consultation.
                </p>
                <div className="mt-6">
                  <Link
                    href="/consultation/new"
                    className="btn-medical"
                  >
                    Nouvelle consultation
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-blue-800">
                Assistant IA médical - Informations importantes
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Cet assistant IA vous aide dans la transcription et la structuration de vos consultations.
                  Toutes les suggestions générées par l'IA sont des brouillons qui doivent être validés par vos soins.
                  Vous restez seul responsable des décisions médicales et de la qualité des soins prodigués.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}