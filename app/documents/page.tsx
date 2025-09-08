'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  DocumentTextIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Document {
  id: string
  title: string
  type: string
  createdAt: string
  consultation?: {
    title: string
    patient?: {
      firstName: string
      lastName: string
    }
  }
  status: 'DRAFT' | 'FINALIZED' | 'SIGNED'
}

export default function DocumentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchDocuments()
    }
  }, [status, router])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.consultation?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.consultation?.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.consultation?.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || document.type === typeFilter
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'PRESCRIPTION': 'Ordonnance',
      'LETTER': 'Lettre',
      'REPORT': 'Rapport',
      'REFERRAL': 'Orientation',
      'CERTIFICATE': 'Certificat'
    }
    return types[type] || type
  }

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'PRESCRIPTION': '💊',
      'LETTER': '📝',
      'REPORT': '📋',
      'REFERRAL': '↗️',
      'CERTIFICATE': '📜'
    }
    return icons[type] || '📄'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mes documents
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gérez vos documents médicaux générés
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/documents/new"
                className="btn-medical"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouveau document
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
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="PRESCRIPTION">Ordonnance</option>
                  <option value="LETTER">Lettre</option>
                  <option value="REPORT">Rapport</option>
                  <option value="REFERRAL">Orientation</option>
                  <option value="CERTIFICATE">Certificat</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="DRAFT">Brouillon</option>
                  <option value="FINALIZED">Finalisé</option>
                  <option value="SIGNED">Signé</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{getTypeIcon(document.type)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {document.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {getTypeLabel(document.type)}
                          </p>
                          {document.consultation && (
                            <p className="text-sm text-gray-500">
                              Consultation: {document.consultation.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            {new Date(document.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        document.status === 'SIGNED' ? 'bg-green-100 text-green-800' :
                        document.status === 'FINALIZED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {document.status === 'SIGNED' ? 'Signé' :
                         document.status === 'FINALIZED' ? 'Finalisé' :
                         'Brouillon'}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-700 p-1">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 p-1">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' ? 
                  'Aucun document ne correspond à vos critères de recherche.' :
                  'Commencez par créer votre premier document.'
                }
              </p>
              {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
                <div className="mt-6">
                  <Link
                    href="/documents/new"
                    className="btn-medical"
                  >
                    Nouveau document
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