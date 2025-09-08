'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  MicrophoneIcon, 
  DocumentTextIcon, 
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Consultation, SOAPNotes, MedicalCoding } from '@/types'

export default function ConsultationDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string
  
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [soapNotes, setSoapNotes] = useState<SOAPNotes | null>(null)
  const [medicalCoding, setMedicalCoding] = useState<MedicalCoding | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && consultationId) {
      fetchConsultation()
    }
  }, [status, router, consultationId])

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`)
      if (response.ok) {
        const data = await response.json()
        setConsultation(data.data)
        
        // Parse SOAP notes and medical coding if available
        if (data.data.soapNotes) {
          try {
            setSoapNotes(JSON.parse(data.data.soapNotes))
          } catch (e) {
            console.error('Error parsing SOAP notes:', e)
          }
        }
        
        if (data.data.medicalCoding) {
          try {
            setMedicalCoding(JSON.parse(data.data.medicalCoding))
          } catch (e) {
            console.error('Error parsing medical coding:', e)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching consultation:', error)
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

  if (!session?.user || !consultation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Consultation non trouvée</h2>
          <p className="text-gray-600 mt-2">Cette consultation n'existe pas ou vous n'y avez pas accès.</p>
          <Link href="/consultations" className="btn-primary mt-4">
            Retour aux consultations
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
            <div className="flex items-center space-x-4">
              <Link href="/consultations" className="text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {consultation.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Consultation du {new Date(consultation.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                consultation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                consultation.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {consultation.status === 'COMPLETED' ? 'Terminée' :
                 consultation.status === 'IN_PROGRESS' ? 'En cours' :
                 'Brouillon'}
              </span>
              <button className="btn-secondary">
                <ShareIcon className="h-4 w-4 mr-2" />
                Partager
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Consultation Info */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de la consultation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <p className="text-sm text-gray-900">{consultation.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(consultation.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {consultation.duration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Durée</label>
                    <p className="text-sm text-gray-900">
                      {Math.round(consultation.duration / 60)} minutes
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <p className="text-sm text-gray-900">
                    {consultation.status === 'COMPLETED' ? 'Terminée' :
                     consultation.status === 'IN_PROGRESS' ? 'En cours' :
                     'Brouillon'}
                  </p>
                </div>
              </div>
            </div>

            {/* Transcription */}
            {consultation.transcription && (
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Transcription</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {consultation.transcription}
                  </p>
                </div>
              </div>
            )}

            {/* SOAP Notes */}
            {soapNotes && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Notes SOAP</h2>
                  <button className="btn-secondary">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjective</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">{soapNotes.subjective}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objective</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">{soapNotes.objective}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">{soapNotes.assessment}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">{soapNotes.plan}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Coding */}
            {medicalCoding && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Codage médical</h2>
                  <button className="btn-secondary">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicalCoding.ngap && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NGAP</label>
                      <p className="text-sm text-gray-900">{medicalCoding.ngap}</p>
                    </div>
                  )}
                  {medicalCoding.ccam && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CCAM</label>
                      <p className="text-sm text-gray-900">{medicalCoding.ccam}</p>
                    </div>
                  )}
                  {medicalCoding.icd10 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ICD-10</label>
                      <p className="text-sm text-gray-900">{medicalCoding.icd10}</p>
                    </div>
                  )}
                  {medicalCoding.dsm5 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">DSM-5</label>
                      <p className="text-sm text-gray-900">{medicalCoding.dsm5}</p>
                    </div>
                  )}
                </div>
                {medicalCoding.explanation && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explication</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">{medicalCoding.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/documents/new?consultationId=${consultation.id}`}
                  className="btn-medical w-full"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Générer un document
                </Link>
                <button className="btn-secondary w-full">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Imprimer
                </button>
                <button className="btn-secondary w-full">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Exporter
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="card bg-yellow-50 border-yellow-200">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    Validation médicale requise
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cette consultation a été générée avec l'assistance d'une IA et doit être validée par vos soins.
                    Vous restez seul responsable de la qualité et de l'exactitude des informations médicales.
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