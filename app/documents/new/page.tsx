'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  DocumentTextIcon, 
  PrinterIcon,
  ShareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { documentSchema, DocumentInput } from '@/lib/validation'
import { Consultation, DocumentType } from '@/types'

const documentTypes = [
  { value: DocumentType.PRESCRIPTION, label: 'Ordonnance', icon: '💊' },
  { value: DocumentType.LETTER, label: 'Lettre', icon: '📝' },
  { value: DocumentType.REPORT, label: 'Rapport', icon: '📋' },
  { value: DocumentType.REFERRAL, label: 'Orientation', icon: '↗️' },
  { value: DocumentType.CERTIFICATE, label: 'Certificat', icon: '📜' },
]

export default function NewDocumentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const consultationId = searchParams.get('consultationId')
  
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('PRESCRIPTION')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<DocumentInput>({
    resolver: zodResolver(documentSchema),
  })

  const content = watch('content')

  useEffect(() => {
    if (consultationId && session?.user) {
      fetchConsultationData()
    }
  }, [consultationId, session])

  const fetchConsultationData = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`)
      if (response.ok) {
        const data = await response.json()
        setConsultation(data.data)
      }
    } catch (error) {
      console.error('Error fetching consultation:', error)
      toast.error('Erreur lors du chargement de la consultation')
    }
  }

  const generateDocument = async () => {
    if (!consultation) {
      toast.error('Aucune consultation sélectionnée')
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultationId: consultation.id,
          type: selectedType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate document')
      }

      const result = await response.json()
      setGeneratedContent(result.data.content)
      setValue('content', result.data.content)
      toast.success('Document généré avec succès')
      
    } catch (error) {
      console.error('Error generating document:', error)
      toast.error('Erreur lors de la génération du document')
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = async (data: DocumentInput) => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          consultationId: consultation?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save document')
      }

      const result = await response.json()
      toast.success('Document sauvegardé')
      router.push(`/documents/${result.data.id}`)
      
    } catch (error) {
      console.error('Error saving document:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setValue('type', type as DocumentType)
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
              <h1 className="text-2xl font-bold text-gray-900">Nouveau document</h1>
              <p className="text-sm text-gray-600 mt-1">
                Générer un document médical à partir de votre consultation
              </p>
            </div>
            <Link href="/dashboard" className="btn-secondary">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Document Type Selection */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Type de document</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {documentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedType === type.value
                      ? 'border-medical-500 bg-medical-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  </div>
                </button>
              ))}
            </div>
            <input type="hidden" {...register('type')} value={selectedType} />
            {errors.type && (
              <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Consultation Context */}
          {consultation && (
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contexte de la consultation</h2>
              <div className="bg-gray-50 rounded-lg p-4">
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
                </div>
                {consultation.transcription && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transcription
                    </label>
                    <div className="bg-white rounded border p-3 max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-900">
                        {consultation.transcription.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Generation */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Contenu du document</h2>
              <button
                type="button"
                onClick={generateDocument}
                disabled={isGenerating || !consultation}
                className="btn-medical"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Générer avec l'IA
                  </>
                )}
              </button>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du document *
              </label>
              <input
                {...register('title')}
                type="text"
                className="input-field"
                placeholder="Titre du document médical"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenu *
              </label>
              <textarea
                {...register('content')}
                rows={20}
                className="input-field font-mono text-sm"
                placeholder="Le contenu du document sera généré automatiquement..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {generatedContent && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <span className="ml-2 text-sm font-medium text-green-800">
                    Document généré avec succès
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Vous pouvez maintenant modifier le contenu si nécessaire avant de sauvegarder.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard" className="btn-secondary">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving || !content}
              className="btn-medical"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Sauvegarder le document
                </>
              )}
            </button>
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
                  Ce document a été généré avec l'assistance d'une IA et doit être validé par vos soins.
                  Vous restez seul responsable de la qualité et de l'exactitude du document médical.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}