'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  MicrophoneIcon, 
  DocumentTextIcon, 
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Consultation {
  id: string
  title: string
  createdAt: string
  duration?: number
  patient?: {
    firstName: string
    lastName: string
  }
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DRAFT'
}

export default function ConsultationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchConsultations()
    }
  }, [status, router])

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations')
      if (response.ok) {
        const data = await response.json()
        setConsultations(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
                Historique des consultations
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gérez et consultez vos consultations passées
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/consultation/new"
                className="btn-medical"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvelle consultation
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre ou patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="COMPLETED">Terminées</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DRAFT">Brouillons</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredConsultations.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredConsultations.map((consultation) => (
                <div key={consultation.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center">
                          <MicrophoneIcon className="h-6 w-6 text-medical-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {consultation.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {consultation.patient ? 
                              `${consultation.patient.firstName} ${consultation.patient.lastName}` : 
                              'Patient anonyme'
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(consultation.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                          {consultation.duration && (
                            <div className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {Math.round(consultation.duration / 60)}min
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        consultation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        consultation.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {consultation.status === 'COMPLETED' ? 'Terminée' :
                         consultation.status === 'IN_PROGRESS' ? 'En cours' :
                         'Brouillon'}
                      </span>
                      <Link
                        href={`/consultation/${consultation.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MicrophoneIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune consultation trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' ? 
                  'Aucune consultation ne correspond à vos critères de recherche.' :
                  'Commencez par créer votre première consultation.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <div className="mt-6">
                  <Link
                    href="/consultation/new"
                    className="btn-medical"
                  >
                    Nouvelle consultation
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}