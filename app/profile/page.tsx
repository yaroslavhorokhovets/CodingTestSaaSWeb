'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
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

const getMedicalSpecialties = (t: any) => [
  { value: MedicalSpecialty.GENERAL_PRACTICE, label: t('profile.specialties.generalPractice') },
  { value: MedicalSpecialty.CARDIOLOGY, label: t('profile.specialties.cardiology') },
  { value: MedicalSpecialty.DERMATOLOGY, label: t('profile.specialties.dermatology') },
  { value: MedicalSpecialty.NEUROLOGY, label: t('profile.specialties.neurology') },
  { value: MedicalSpecialty.PSYCHIATRY, label: t('profile.specialties.psychiatry') },
  { value: MedicalSpecialty.PEDIATRICS, label: t('profile.specialties.pediatrics') },
  { value: MedicalSpecialty.GYNECOLOGY, label: t('profile.specialties.gynecology') },
  { value: MedicalSpecialty.ORTHOPEDICS, label: t('profile.specialties.orthopedics') },
  { value: MedicalSpecialty.RADIOLOGY, label: t('profile.specialties.radiology') },
  { value: MedicalSpecialty.ANESTHESIOLOGY, label: t('profile.specialties.anesthesiology') },
  { value: MedicalSpecialty.EMERGENCY_MEDICINE, label: t('profile.specialties.emergencyMedicine') },
  { value: MedicalSpecialty.INTERNAL_MEDICINE, label: t('profile.specialties.internalMedicine') },
  { value: MedicalSpecialty.SURGERY, label: t('profile.specialties.surgery') },
  { value: MedicalSpecialty.ONCOLOGY, label: t('profile.specialties.oncology') },
  { value: MedicalSpecialty.ENDOCRINOLOGY, label: t('profile.specialties.endocrinology') },
]

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { t, locale } = useLanguage()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const medicalSpecialties = getMedicalSpecialties(t)

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
      const user = session.user as any
      resetProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        medicalSpecialty: user.medicalSpecialty || 'GENERAL_PRACTICE',
        organization: user.organization || '',
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
          <h2 className="text-2xl font-bold text-gray-900">{t('auth.unauthorized')}</h2>
          <p className="text-gray-600 mt-2">
            {locale === 'fr' ? 'Veuillez vous connecter pour accéder à cette page.' : 'Please log in to access this page.'}
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', name: t('navigation.profile'), icon: UserIcon },
    { id: 'security', name: t('navigation.security'), icon: LockClosedIcon },
    { id: 'notifications', name: t('navigation.notifications'), icon: BellIcon },
    { id: 'billing', name: t('navigation.billing'), icon: CreditCardIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {locale === 'fr' 
                  ? 'Gérez vos informations personnelles et vos préférences'
                  : 'Manage your personal information and preferences'
                }
              </p>
            </div>
            <LanguageSwitcher />
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
                  <h2 className="text-lg font-medium text-gray-900 mb-6">{t('profile.personalInfo')}</h2>
                  <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="firstName" className="form-label">
                          {t('common.firstName')}
                        </label>
                        <input
                          {...registerProfile('firstName')}
                          type="text"
                          className="form-input"
                        />
                        {profileErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName" className="form-label">
                          {t('common.lastName')}
                        </label>
                        <input
                          {...registerProfile('lastName')}
                          type="text"
                          className="form-input"
                        />
                        {profileErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="medicalSpecialty" className="form-label">
                        {t('profile.medicalSpecialty')}
                      </label>
                      <select
                        {...registerProfile('medicalSpecialty')}
                        className="form-select"
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

                    <div className="form-group">
                      <label htmlFor="organization" className="form-label">
                        {t('common.organization')}
                      </label>
                      <input
                        {...registerProfile('organization')}
                        type="text"
                        className="form-input"
                        placeholder={locale === 'fr' ? 'CHU de Paris, Cabinet privé...' : 'Paris Hospital, Private practice...'}
                      />
                      {profileErrors.organization && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.organization.message}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        {t('common.phone')}
                      </label>
                      <input
                        {...registerProfile('phone')}
                        type="tel"
                        className="form-input"
                        placeholder={locale === 'fr' ? '01 23 45 67 89' : '+1 234 567 8900'}
                      />
                      {profileErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-medical btn-spacing"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            {locale === 'fr' ? 'Sauvegarde...' : 'Saving...'}
                          </>
                        ) : (
                          <>
                            <PencilIcon className="h-4 w-4" />
                            {t('common.save')}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Account Information */}
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">{t('profile.accountInfo')}</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('common.email')}</span>
                      <span className="text-sm font-medium text-gray-900">{session.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('profile.role')}</span>
                      <span className="text-sm font-medium text-gray-900">{session.user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('profile.lastLogin')}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
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
                  <h2 className="text-lg font-medium text-gray-900 mb-6">{t('profile.changePassword')}</h2>
                  <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                    <div className="form-group">
                      <label htmlFor="currentPassword" className="form-label">
                        {t('profile.currentPassword')}
                      </label>
                      <input
                        {...registerPassword('currentPassword')}
                        type="password"
                        className="form-input"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword" className="form-label">
                        {t('profile.newPassword')}
                      </label>
                      <input
                        {...registerPassword('newPassword')}
                        type="password"
                        className="form-input"
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        {t('profile.confirmPassword')}
                      </label>
                      <input
                        {...registerPassword('confirmPassword')}
                        type="password"
                        className="form-input"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-medical btn-spacing"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            {locale === 'fr' ? 'Mise à jour...' : 'Updating...'}
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="h-4 w-4" />
                            {t('profile.changePassword')}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Security Status */}
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">{t('profile.securityStatus')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-900">{t('profile.secureConnection')}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-900">{t('profile.dataEncrypted')}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-900">{t('profile.accessLogging')}</span>
                    </div>
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
                      <span className="text-sm text-gray-900">
                        {locale === 'fr' ? 'Authentification à deux facteurs (optionnel)' : 'Two-factor authentication (optional)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">{t('profile.notificationPreferences')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('profile.emailNotifications')}</h3>
                        <p className="text-sm text-gray-600">
                          {locale === 'fr' ? 'Recevoir des notifications importantes par email' : 'Receive important notifications by email'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="form-checkbox"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('profile.consultationReminders')}</h3>
                        <p className="text-sm text-gray-600">
                          {locale === 'fr' ? 'Notifications pour les consultations en attente' : 'Notifications for pending consultations'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="form-checkbox"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('profile.systemUpdates')}</h3>
                        <p className="text-sm text-gray-600">
                          {locale === 'fr' ? 'Informations sur les nouvelles fonctionnalités' : 'Information about new features'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="form-checkbox"
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
                  <h2 className="text-lg font-medium text-gray-900 mb-6">{t('profile.subscription')}</h2>
                  <div className="bg-medical-50 border border-medical-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-medical-600 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-medical-800">
                          {locale === 'fr' ? 'Plan Professionnel' : 'Professional Plan'}
                        </h3>
                        <p className="text-sm text-medical-700">
                          {locale === 'fr' ? 'Accès complet à toutes les fonctionnalités' : 'Full access to all features'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('common.status')}</span>
                      <span className="text-sm font-medium text-green-600">{t('common.active')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('profile.nextBilling')}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t('profile.amount')}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {locale === 'fr' ? '99€/mois' : '$99/month'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button className="btn-secondary btn-spacing">
                      {t('profile.modifySubscription')}
                    </button>
                    <button className="btn-secondary btn-spacing">
                      {t('profile.billingHistory')}
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