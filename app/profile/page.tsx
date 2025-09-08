'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  UserIcon, 
  LockClosedIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userProfileSchema, passwordChangeSchema, UserProfileInput, PasswordChangeInput } from '@/lib/validation'
import { MedicalSpecialty } from '@prisma/client'

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

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
  })

  useEffect(() => {
    if (session?.user) {
      resetProfile({
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        medicalSpecialty: session.user.medicalSpecialty,
        organization: session.user.organization || '',
        phone: ''
      })
    }
  }, [session, resetProfile])

  const onSubmitProfile = async (data: UserProfileInput) => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          ...data
        }
      })

      toast.success('Profil mis à jour avec succès')
      
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmitPassword = async (data: PasswordChangeInput) => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update password')
      }

      resetPassword()
      toast.success('Mot de passe mis à jour avec succès')
      
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du mot de passe')
    } finally {
      setIsSaving(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Non autorisé</h2>
          <p className="text-gray-600 mt-2">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'security', name: 'Sécurité', icon: LockClosedIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'billing', name: 'Facturation', icon: CreditCardIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profil et paramètres</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gérez vos informations personnelles et vos préférences
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Informations personnelles</h2>
                  <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          Prénom
                        </label>
                        <input
                          {...registerProfile('firstName')}
                          type="text"
                          className="input-field mt-1"
                        />
                        {profileErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Nom
                        </label>
                        <input
                          {...registerProfile('lastName')}
                          type="text"
                          className="input-field mt-1"
                        />
                        {profileErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="medicalSpecialty" className="block text-sm font-medium text-gray-700">
                        Spécialité médicale
                      </label>
                      <select
                        {...registerProfile('medicalSpecialty')}
                        className="input-field mt-1"
                      >
                        {medicalSpecialties.map((specialty) => (
                          <option key={specialty.value} value={specialty.value}>
                            {specialty.label}
                          </option>
                        ))}
                      </select>
                      {profileErrors.medicalSpecialty && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.medicalSpecialty.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                        Établissement
                      </label>
                      <input
                        {...registerProfile('organization')}
                        type="text"
                        className="input-field mt-1"
                        placeholder="CHU de Paris, Cabinet privé..."
                      />
                      {profileErrors.organization && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.organization.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <input
                        {...registerProfile('phone')}
                        type="tel"
                        className="input-field mt-1"
                        placeholder="01 23 45 67 89"
                      />
                      {profileErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-medical"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Account Information */}
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm font-medium text-gray-900">{session.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rôle</span>
                      <span className="text-sm font-medium text-gray-900">{session.user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dernière connexion</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Changer le mot de passe</h2>
                  <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Mot de passe actuel
                      </label>
                      <input
                        {...registerPassword('currentPassword')}
                        type="password"
                        className="input-field mt-1"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Nouveau mot de passe
                      </label>
                      <input
                        {...registerPassword('newPassword')}
                        type="password"
                        className="input-field mt-1"
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        {...registerPassword('confirmPassword')}
                        type="password"
                        className="input-field mt-1"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-medical"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="h-4 w-4 mr-2" />
                            Changer le mot de passe
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Security Status */}
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">État de la sécurité</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-900">Connexion sécurisée HTTPS</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-900">Données chiffrées AES-256</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-900">Journalisation des accès</span>
                    </div>
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
                      <span className="text-sm text-gray-900">Authentification à deux facteurs (optionnel)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Préférences de notification</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Notifications par email</h3>
                        <p className="text-sm text-gray-600">Recevoir des notifications importantes par email</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Rappels de consultation</h3>
                        <p className="text-sm text-gray-600">Notifications pour les consultations en attente</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Mises à jour système</h3>
                        <p className="text-sm text-gray-600">Informations sur les nouvelles fonctionnalités</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Abonnement</h2>
                  <div className="bg-medical-50 border border-medical-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-medical-600 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-medical-800">Plan Professionnel</h3>
                        <p className="text-sm text-medical-700">Accès complet à toutes les fonctionnalités</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Statut</span>
                      <span className="text-sm font-medium text-green-600">Actif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Prochaine facturation</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Montant</span>
                      <span className="text-sm font-medium text-gray-900">99€/mois</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button className="btn-secondary">
                      Modifier l'abonnement
                    </button>
                    <button className="btn-secondary">
                      Historique des factures
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}