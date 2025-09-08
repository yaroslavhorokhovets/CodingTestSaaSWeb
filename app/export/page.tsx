'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ExportFormat } from '@prisma/client'
import { 
  DocumentArrowDownIcon, 
  DocumentTextIcon,
  TableCellsIcon,
  CloudIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { exportSchema, ExportInput } from '@/lib/validation'
import { Consultation, Document } from '@/types'
import { ExportFormat } from '@prisma/client'

const exportFormats = [
  { 
    value: ExportFormat.PDF, 
    label: 'PDF', 
    description: 'Document portable pour impression et archivage',
    icon: DocumentTextIcon,
    color: 'text-red-600'
  },
  { 
    value: ExportFormat.CSV, 
    label: 'CSV', 
    description: 'Fichier de données pour facturation et analyse',
    icon: TableCellsIcon,
    color: 'text-green-600'
  },
  { 
    value: ExportFormat.FHIR, 
    label: 'FHIR', 
    description: 'Standard d\'interopérabilité pour systèmes hospitaliers',
    icon: CloudIcon,
    color: 'text-blue-600'
  },
]

export default function ExportPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const consultationId = searchParams.get('consultationId')
  
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ExportInput>({
    resolver: zodResolver(exportSchema),
  })

  const selectedFormat = watch('format')
  const includeAudio = watch('includeAudio')
  const includeTranscription = watch('includeTranscription')
  const includeNotes = watch('includeNotes')
  const includeDocuments = watch('includeDocuments')

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [consultationsRes, documentsRes, exportsRes] = await Promise.all([
        fetch('/api/consultations'),
        fetch('/api/documents'),
        fetch('/api/exports')
      ])

      if (consultationsRes.ok) {
        const consultationsData = await consultationsRes.json()
        setConsultations(consultationsData.data)
      }

      if (documentsRes.ok) {
        const documentsData = await documentsRes.json()
        setDocuments(documentsData.data)
      }

      if (exportsRes.ok) {
        const exportsData = await exportsRes.json()
        setExportHistory(exportsData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ExportInput) => {
    setIsExporting(true)
    
    try {
      const response = await fetch('/api/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create export')
      }

      const result = await response.json()
      
      // If it's a direct download, trigger it
      if (result.data.downloadUrl) {
        window.open(result.data.downloadUrl, '_blank')
      }
      
      toast.success('Export créé avec succès')
      fetchData() // Refresh export history
      
    } catch (error) {
      console.error('Error creating export:', error)
      toast.error('Erreur lors de la création de l\'export')
    } finally {
      setIsExporting(false)
    }
  }

  const handleFormatChange = (format: string) => {
    setValue('format', format as ExportFormat)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Non autorisé</h2>
          <p className="text-gray-600 mt-2">Veuillez vous connecter pour accéder à cette page.</p>
          <Link href="/auth/login" className="btn-primary mt-4">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Export et archivage</h1>
              <p className="text-sm text-gray-600 mt-1">
                Exportez vos données dans différents formats pour l'interopérabilité
              </p>
            </div>
            <Link href="/dashboard" className="btn-secondary">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Export Configuration */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Format Selection */}
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Format d'export</h2>
                <div className="space-y-4">
                  {exportFormats.map((format) => {
                    const IconComponent = format.icon
                    return (
                      <button
                        key={format.value}
                        type="button"
                        onClick={() => handleFormatChange(format.value)}
                        className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                          selectedFormat === format.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className={`h-6 w-6 ${format.color} mr-3`} />
                          <div>
                            <div className="font-medium text-gray-900">{format.label}</div>
                            <div className="text-sm text-gray-600">{format.description}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <input type="hidden" {...register('format')} />
                {errors.format && (
                  <p className="mt-2 text-sm text-red-600">{errors.format.message}</p>
                )}
              </div>

              {/* Content Selection */}
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contenu à inclure</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      {...register('includeTranscription')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Transcriptions des consultations
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      {...register('includeNotes')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Notes SOAP/DAP
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      {...register('includeDocuments')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Documents générés
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      {...register('includeAudio')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Fichiers audio (si disponibles)
                    </label>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Période</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateRange.start" className="block text-sm font-medium text-gray-700">
                      Date de début
                    </label>
                    <input
                      {...register('dateRange.start')}
                      type="date"
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateRange.end" className="block text-sm font-medium text-gray-700">
                      Date de fin
                    </label>
                    <input
                      {...register('dateRange.end')}
                      type="date"
                      className="input-field mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isExporting || !selectedFormat}
                  className="btn-medical"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Créer l'export
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consultations</span>
                  <span className="text-sm font-medium text-gray-900">{consultations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Documents</span>
                  <span className="text-sm font-medium text-gray-900">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Exports</span>
                  <span className="text-sm font-medium text-gray-900">{exportHistory.length}</span>
                </div>
              </div>
            </div>

            {/* Recent Exports */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Exports récents</h3>
              {exportHistory.length > 0 ? (
                <div className="space-y-3">
                  {exportHistory.slice(0, 5).map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{exportItem.fileName}</p>
                        <p className="text-xs text-gray-500">{exportItem.format}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(exportItem.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun export récent</p>
              )}
            </div>

            {/* Compliance Notice */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    Conformité et sécurité
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Tous les exports respectent les standards HDS et GDPR. 
                    Les données sont chiffrées et traçables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}