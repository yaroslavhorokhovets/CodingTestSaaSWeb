'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  MicrophoneIcon, 
  StopIcon, 
  PlayIcon,
  PauseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { consultationSchema, ConsultationInput } from '@/lib/validation'

interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioBlob: Blob | null
  audioUrl: string | null
}

interface TranscriptionState {
  isTranscribing: boolean
  text: string
  confidence: number
}

export default function NewConsultationPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null
  })
  
  const [transcription, setTranscription] = useState<TranscriptionState>({
    isTranscribing: false,
    text: '',
    confidence: 0
  })
  
  const [currentStep, setCurrentStep] = useState<'setup' | 'recording' | 'processing' | 'review'>('setup')
  const [consultationId, setConsultationId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
  })

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (recording.audioUrl) {
        URL.revokeObjectURL(recording.audioUrl)
      }
    }
  }, [recording.audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        setRecording(prev => ({
          ...prev,
          audioBlob,
          audioUrl
        }))
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start(1000) // Collect data every second
      
      setRecording(prev => ({
        ...prev,
        isRecording: true,
        duration: 0
      }))
      
      setCurrentStep('recording')
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecording(prev => ({
          ...prev,
          duration: prev.duration + 1
        }))
      }, 1000)
      
      toast.success('Enregistrement démarré')
      
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Erreur lors du démarrage de l\'enregistrement')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording.isRecording) {
      mediaRecorderRef.current.stop()
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      setRecording(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false
      }))
      
      setCurrentStep('processing')
      toast.success('Enregistrement terminé')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording.isRecording) {
      if (recording.isPaused) {
        mediaRecorderRef.current.resume()
        setRecording(prev => ({ ...prev, isPaused: false }))
        toast.success('Enregistrement repris')
      } else {
        mediaRecorderRef.current.pause()
        setRecording(prev => ({ ...prev, isPaused: true }))
        toast.success('Enregistrement en pause')
      }
    }
  }

  const onSubmit = async (data: ConsultationInput) => {
    if (!recording.audioBlob) {
      toast.error('Aucun enregistrement audio disponible')
      return
    }

    try {
      // Create consultation
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('patientId', data.patientId || '')
      formData.append('audio', recording.audioBlob, 'consultation.webm')

      const response = await fetch('/api/consultations', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create consultation')
      }

      const result = await response.json()
      setConsultationId(result.data.id)
      
      // Start transcription
      setTranscription(prev => ({ ...prev, isTranscribing: true }))
      
      const transcriptionResponse = await fetch(`/api/consultations/${result.data.id}/transcribe`, {
        method: 'POST',
      })

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const transcriptionResult = await transcriptionResponse.json()
      
      setTranscription({
        isTranscribing: false,
        text: transcriptionResult.data.text,
        confidence: transcriptionResult.data.confidence
      })
      
      setCurrentStep('review')
      toast.success('Transcription terminée')
      
    } catch (error) {
      console.error('Error processing consultation:', error)
      toast.error('Erreur lors du traitement de la consultation')
      setTranscription(prev => ({ ...prev, isTranscribing: false }))
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
              <h1 className="text-2xl font-bold text-gray-900">Nouvelle consultation</h1>
              <p className="text-sm text-gray-600 mt-1">
                Enregistrez et transcrivez votre consultation médicale
              </p>
            </div>
            <Link href="/dashboard" className="btn-secondary">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Consultation Details */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Détails de la consultation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titre de la consultation *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="input-field mt-1"
                  placeholder="Consultation de suivi - M. Dupont"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                  Patient (optionnel)
                </label>
                <input
                  {...register('patientId')}
                  type="text"
                  className="input-field mt-1"
                  placeholder="ID du patient"
                />
                {errors.patientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recording Section */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Enregistrement audio</h2>
            
            {currentStep === 'setup' && (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 bg-medical-100 rounded-full flex items-center justify-center mb-4">
                  <MicrophoneIcon className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Prêt à enregistrer
                </h3>
                <p className="text-gray-600 mb-6">
                  Cliquez sur le bouton pour commencer l'enregistrement de votre consultation.
                </p>
                <button
                  type="button"
                  onClick={startRecording}
                  className="btn-medical text-lg px-8 py-3"
                >
                  <MicrophoneIcon className="h-5 w-5 mr-2" />
                  Commencer l'enregistrement
                </button>
              </div>
            )}

            {currentStep === 'recording' && (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <MicrophoneIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Enregistrement en cours
                </h3>
                <p className="text-2xl font-mono text-medical-600 mb-6">
                  {formatDuration(recording.duration)}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={pauseRecording}
                    className="btn-secondary"
                  >
                    {recording.isPaused ? (
                      <>
                        <PlayIcon className="h-5 w-5 mr-2" />
                        Reprendre
                      </>
                    ) : (
                      <>
                        <PauseIcon className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="btn-danger"
                  >
                    <StopIcon className="h-5 w-5 mr-2" />
                    Arrêter
                  </button>
                </div>
                <div className="mt-4">
                  <div className="security-indicator security-processing">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                    Enregistrement sécurisé en cours
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'processing' && (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Traitement en cours
                </h3>
                <p className="text-gray-600 mb-6">
                  Transcription et analyse de votre consultation...
                </p>
                <div className="security-indicator security-processing">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  Analyse sécurisée en cours
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Transcription terminée
                  </h3>
                  <div className="security-indicator security-secure">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Traitement terminé
                  </div>
                </div>

                {recording.audioUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu audio</h4>
                    <audio controls className="w-full">
                      <source src={recording.audioUrl} type="audio/webm" />
                      Votre navigateur ne supporte pas la lecture audio.
                    </audio>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Transcription ({Math.round(transcription.confidence * 100)}% de confiance)
                  </h4>
                  <div className="bg-white rounded border p-4 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {transcription.text || 'Transcription en cours...'}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-800">
                        Important - Validation requise
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Cette transcription a été générée par une IA et doit être validée par vos soins.
                        Vous restez seul responsable de l'exactitude des informations médicales.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('setup')}
                    className="btn-secondary"
                  >
                    Recommencer
                  </button>
                  <button
                    type="submit"
                    className="btn-medical"
                  >
                    Continuer vers les notes SOAP
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}