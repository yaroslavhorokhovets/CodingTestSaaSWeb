'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterInput } from '@/lib/validation'
import { MedicalSpecialty } from '@prisma/client'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import bcrypt from 'bcryptjs'

const medicalSpecialties = [
  { value: MedicalSpecialty.GENERAL_PRACTICE, label: 'Médecine générale' },
  { value: MedicalSpecialty.CARDIOLOGY, label: 'Cardiologie' },
  { value: MedicalSpecialty.DERMATOLOGY, label: 'Dermatologie' },
  { value: MedicalSpecialty.NEUROLOGY, label: 'Neurologie' },
  { value: MedicalSpecialty.PSYCHIATRY, label: 'Psychiatrie' },
  { value: MedicalSpecialty.PEDIATRICS, label: 'Pédiatrie' },
  { value: MedicalSpecialty.GYNECOLOGY, label: 'Gynécologie' },
  { value: MedicalSpecialty.ORTHOPEDICS, label: 'Orthopédie' },
  { value: MedicalSpecialty.RADIOLOGY, label: 'Radiologie' },
  { value: MedicalSpecialty.ANESTHESIOLOGY, label: 'Anesthésiologie' },
  { value: MedicalSpecialty.EMERGENCY_MEDICINE, label: 'Médecine d\'urgence' },
  { value: MedicalSpecialty.INTERNAL_MEDICINE, label: 'Médecine interne' },
  { value: MedicalSpecialty.SURGERY, label: 'Chirurgie' },
  { value: MedicalSpecialty.ONCOLOGY, label: 'Oncologie' },
  { value: MedicalSpecialty.ENDOCRINOLOGY, label: 'Endocrinologie' },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    
    try {
      const hashedPassword = await bcrypt.hash(data.password, 12)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          password: hashedPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de l\'inscription')
        return
      }

      toast.success('Compte créé avec succès')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-medical-100">
            <AcademicCapIcon className="h-6 w-6 text-medical-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez l'assistant IA médical nouvelle génération
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('firstName')}
                    type="text"
                    autoComplete="given-name"
                    className="input-field pl-10"
                    placeholder="Jean"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('lastName')}
                    type="text"
                    autoComplete="family-name"
                    className="input-field pl-10"
                    placeholder="Dupont"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email professionnelle
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="input-field pl-10"
                  placeholder="jean.dupont@hopital.fr"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="medicalSpecialty" className="block text-sm font-medium text-gray-700">
                Spécialité médicale
              </label>
              <select
                {...register('medicalSpecialty')}
                className="input-field mt-1"
              >
                <option value="">Sélectionnez votre spécialité</option>
                {medicalSpecialties.map((specialty) => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </option>
                ))}
              </select>
              {errors.medicalSpecialty && (
                <p className="mt-1 text-sm text-red-600">{errors.medicalSpecialty.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                Établissement (optionnel)
              </label>
              <input
                {...register('organization')}
                type="text"
                className="input-field mt-1"
                placeholder="CHU de Paris, Cabinet privé..."
              />
              {errors.organization && (
                <p className="mt-1 text-sm text-red-600">{errors.organization.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone (optionnel)
              </label>
              <input
                {...register('phone')}
                type="tel"
                autoComplete="tel"
                className="input-field mt-1"
                placeholder="01 23 45 67 89"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pl-10 pr-10"
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              {password && (
                <div className="mt-1 text-xs text-gray-500">
                  <div className={`${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                    ✓ Au moins 8 caractères
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('gdprConsent')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="gdprConsent" className="text-gray-700">
                  J'accepte le traitement de mes données personnelles selon la{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                    politique de confidentialité
                  </Link>{' '}
                  (RGPD)
                </label>
                {errors.gdprConsent && (
                  <p className="mt-1 text-sm text-red-600">{errors.gdprConsent.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('termsAccepted')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="text-gray-700">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                    conditions d'utilisation
                  </Link>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="loading-dots">Création du compte</span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <LockClosedIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Sécurité et conformité médicale
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Hébergement certifié HDS (Hébergeur de Données de Santé)</li>
                  <li>Chiffrement AES-256 de toutes les données</li>
                  <li>Conformité RGPD et déontologie médicale</li>
                  <li>Journalisation des accès pour la traçabilité</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}