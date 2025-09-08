'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface LanguageContextType {
  locale: 'en' | 'fr'
  setLocale: (locale: 'en' | 'fr') => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    'navigation.dashboard': 'Dashboard',
    'navigation.profile': 'Profile',
    'navigation.security': 'Security',
    'navigation.notifications': 'Notifications',
    'navigation.billing': 'Billing',
    
    // Common
    'common.login': 'Login',
    'common.signup': 'Sign Up',
    'common.logout': 'Logout',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.firstName': 'First Name',
    'common.lastName': 'Last Name',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.organization': 'Organization',
    'common.status': 'Status',
    'common.active': 'Active',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.newConsultation': 'New Consultation',
    'dashboard.recentConsultations': 'Recent Consultations',
    'dashboard.statistics': 'Statistics',
    
    // Consultations
    'consultations.newConsultation': 'New Consultation',
    'consultations.title': 'Consultation Title',
    'consultations.patient': 'Patient',
    'consultations.date': 'Date',
    'consultations.status': 'Status',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.accountInfo': 'Account Information',
    'profile.medicalSpecialty': 'Medical Specialty',
    'profile.role': 'Role',
    'profile.lastLogin': 'Last Login',
    'profile.changePassword': 'Change Password',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.confirmPassword': 'Confirm Password',
    'profile.securityStatus': 'Security Status',
    'profile.secureConnection': 'Secure Connection',
    'profile.dataEncrypted': 'Data Encrypted',
    'profile.accessLogging': 'Access Logging',
    'profile.notificationPreferences': 'Notification Preferences',
    'profile.emailNotifications': 'Email Notifications',
    'profile.consultationReminders': 'Consultation Reminders',
    'profile.systemUpdates': 'System Updates',
    'profile.subscription': 'Subscription',
    'profile.nextBilling': 'Next Billing',
    'profile.amount': 'Amount',
    'profile.modifySubscription': 'Modify Subscription',
    'profile.billingHistory': 'Billing History',
    
    // Specialties
    'profile.specialties.generalPractice': 'General Practice',
    'profile.specialties.cardiology': 'Cardiology',
    'profile.specialties.dermatology': 'Dermatology',
    'profile.specialties.neurology': 'Neurology',
    'profile.specialties.psychiatry': 'Psychiatry',
    'profile.specialties.pediatrics': 'Pediatrics',
    'profile.specialties.gynecology': 'Gynecology',
    'profile.specialties.orthopedics': 'Orthopedics',
    'profile.specialties.radiology': 'Radiology',
    'profile.specialties.anesthesiology': 'Anesthesiology',
    'profile.specialties.emergencyMedicine': 'Emergency Medicine',
    'profile.specialties.internalMedicine': 'Internal Medicine',
    'profile.specialties.surgery': 'Surgery',
    'profile.specialties.oncology': 'Oncology',
    'profile.specialties.endocrinology': 'Endocrinology',
    
    // Auth
    'auth.unauthorized': 'Unauthorized',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot Password',
    'auth.resetPassword': 'Reset Password',
    'auth.otpVerification': 'OTP Verification',
  },
  fr: {
    // Navigation
    'navigation.dashboard': 'Tableau de bord',
    'navigation.profile': 'Profil',
    'navigation.security': 'Sécurité',
    'navigation.notifications': 'Notifications',
    'navigation.billing': 'Facturation',
    
    // Common
    'common.login': 'Connexion',
    'common.signup': 'Inscription',
    'common.logout': 'Déconnexion',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.firstName': 'Prénom',
    'common.lastName': 'Nom',
    'common.email': 'Email',
    'common.phone': 'Téléphone',
    'common.organization': 'Organisation',
    'common.status': 'Statut',
    'common.active': 'Actif',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.newConsultation': 'Nouvelle consultation',
    'dashboard.recentConsultations': 'Consultations récentes',
    'dashboard.statistics': 'Statistiques',
    
    // Consultations
    'consultations.newConsultation': 'Nouvelle consultation',
    'consultations.title': 'Titre de la consultation',
    'consultations.patient': 'Patient',
    'consultations.date': 'Date',
    'consultations.status': 'Statut',
    
    // Profile
    'profile.title': 'Profil',
    'profile.personalInfo': 'Informations personnelles',
    'profile.accountInfo': 'Informations du compte',
    'profile.medicalSpecialty': 'Spécialité médicale',
    'profile.role': 'Rôle',
    'profile.lastLogin': 'Dernière connexion',
    'profile.changePassword': 'Changer le mot de passe',
    'profile.currentPassword': 'Mot de passe actuel',
    'profile.newPassword': 'Nouveau mot de passe',
    'profile.confirmPassword': 'Confirmer le mot de passe',
    'profile.securityStatus': 'Statut de sécurité',
    'profile.secureConnection': 'Connexion sécurisée',
    'profile.dataEncrypted': 'Données chiffrées',
    'profile.accessLogging': 'Journalisation des accès',
    'profile.notificationPreferences': 'Préférences de notification',
    'profile.emailNotifications': 'Notifications par email',
    'profile.consultationReminders': 'Rappels de consultation',
    'profile.systemUpdates': 'Mises à jour système',
    'profile.subscription': 'Abonnement',
    'profile.nextBilling': 'Prochaine facturation',
    'profile.amount': 'Montant',
    'profile.modifySubscription': 'Modifier l\'abonnement',
    'profile.billingHistory': 'Historique de facturation',
    
    // Specialties
    'profile.specialties.generalPractice': 'Médecine générale',
    'profile.specialties.cardiology': 'Cardiologie',
    'profile.specialties.dermatology': 'Dermatologie',
    'profile.specialties.neurology': 'Neurologie',
    'profile.specialties.psychiatry': 'Psychiatrie',
    'profile.specialties.pediatrics': 'Pédiatrie',
    'profile.specialties.gynecology': 'Gynécologie',
    'profile.specialties.orthopedics': 'Orthopédie',
    'profile.specialties.radiology': 'Radiologie',
    'profile.specialties.anesthesiology': 'Anesthésiologie',
    'profile.specialties.emergencyMedicine': 'Médecine d\'urgence',
    'profile.specialties.internalMedicine': 'Médecine interne',
    'profile.specialties.surgery': 'Chirurgie',
    'profile.specialties.oncology': 'Oncologie',
    'profile.specialties.endocrinology': 'Endocrinologie',
    
    // Auth
    'auth.unauthorized': 'Non autorisé',
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.forgotPassword': 'Mot de passe oublié',
    'auth.resetPassword': 'Réinitialiser le mot de passe',
    'auth.otpVerification': 'Vérification OTP',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'en' | 'fr'>('en')

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as 'en' | 'fr'
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
      setLocale(savedLocale)
    }
  }, [])

  useEffect(() => {
    // Save locale to localStorage
    localStorage.setItem('locale', locale)
  }, [locale])

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations[typeof locale]] || key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}