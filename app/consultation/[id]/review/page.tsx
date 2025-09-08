'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PencilIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { soapNotesSchema, SOAPNotesInput } from '@/lib/validation'
import { SOAPNotes, MedicalCoding, Consultation } from '@/types'

export default function ReviewConsultationPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [soapNotes, setSoapNotes] = useState<SOAPNotes | null>(null)
  const [medicalCoding, setMedicalCoding] = useState<MedicalCoding | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<SOAPNotesInput>({
    resolver: zodResolver(soapNotesSchema),
  })

  useEffect(() => {
    if (session?.user) {
      fetchConsultationData()
    }
  }, [session, params.id])

  const fetchConsultationData = async () => {
    try {
      const response = await fetch(`/api/consultations/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setConsultation(data.data)
        
        if (data.data.soapNotes) {
          const notes = JSON.parse(data.data.soapNotes)
          setSoapNotes(notes)
          reset(notes)
        }
        
        if (data.data.medicalCoding) {
          const codes = JSON.parse(data.data.medicalCoding)
          setMedicalCoding(codes)
        }
      }
    } catch (error) {
      console.error('Error fetching consultation:', error)
      toast.error('Erreur lors du chargement de la consultation')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: SOAPNotesInput) => {
    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/consultations/${params.id}/soap-notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save SOAP notes')
      }

      setSoapNotes(data)
      setIsEditing(false)
      toast.success('Notes SOAP sauvegardées')
      
    } catch (error) {
      console.error('Error saving SOAP notes:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (soapNotes) {
      reset(soapNotes)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!consultation || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Consultation non trouvée</h2>
          <p className="text-gray-600 mt-2">Cette consultation n'existe pas ou vous n'y avez pas accès.</p>
          <Link href="/dashboard" className="btn-primary mt-4">
            Retour au tableau de bord
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
              <h1 className="text-2xl font-bold text-gray-900">{consultation.title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Révision des notes SOAP et codage médical
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="btn-secondary">
                Retour au tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SOAP Notes */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Notes SOAP</h2>
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="btn-secondary text-sm"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="btn-secondary text-sm"
                        disabled={isSaving}
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmit(onSubmit)}
                        className="btn-medical text-sm"
                        disabled={isSaving}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="subjective" className="block text-sm font-medium text-gray-700 mb-2">
                    Subjective
                  </label>
                  <textarea
                    {...register('subjective')}
                    rows={4}
                    className="input-field"
                    placeholder="Symptômes rapportés par le patient, antécédents, plaintes..."
                    disabled={!isEditing}
                  />
                  {errors.subjective && (
                    <p className="mt-1 text-sm text-red-600">{errors.subjective.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
                    Objective
                  </label>
                  <textarea
                    {...register('objective')}
                    rows={4}
                    className="input-field"
                    placeholder="Observations cliniques, examens, signes vitaux..."
                    disabled={!isEditing}
                  />
                  {errors.objective && (
                    <p className="mt-1 text-sm text-red-600">{errors.objective.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="assessment" className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment
                  </label>
                  <textarea
                    {...register('assessment')}
                    rows={4}
                    className="input-field"
                    placeholder="Diagnostic différentiel, hypothèses diagnostiques..."
                    disabled={!isEditing}
                  />
                  {errors.assessment && (
                    <p className="mt-1 text-sm text-red-600">{errors.assessment.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan
                  </label>
                  <textarea
                    {...register('plan')}
                    rows={4}
                    className="input-field"
                    placeholder="Traitement proposé, examens complémentaires, suivi..."
                    disabled={!isEditing}
                  />
                  {errors.plan && (
                    <p className="mt-1 text-sm text-red-600">{errors.plan.message}</p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Medical Coding */}
            {medicalCoding && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Codage médical</h3>
                <div className="space-y-4">
                  {medicalCoding.ngap && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NGAP</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {medicalCoding.ngap}
                      </p>
                    </div>
                  )}
                  {medicalCoding.ccam && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CCAM</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {medicalCoding.ccam}
                      </p>
                    </div>
                  )}
                  {medicalCoding.icd10 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ICD-10</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {medicalCoding.icd10}
                      </p>
                    </div>
                  )}
                  {medicalCoding.dsm5 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">DSM-5</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {medicalCoding.dsm5}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Explication</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {medicalCoding.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transcription */}
            {consultation.transcription && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Transcription</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {consultation.transcription}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/documents/new?consultationId=${consultation.id}`}
                  className="btn-medical w-full flex items-center justify-center"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Générer un document
                </Link>
                <Link
                  href={`/export?consultationId=${consultation.id}`}
                  className="btn-secondary w-full flex items-center justify-center"
                >
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Exporter
                </Link>
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
                    Les suggestions IA sont des brouillons à valider. Vous restez seul responsable des décisions médicales.
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