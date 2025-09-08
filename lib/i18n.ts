export type Locale = 'en' | 'fr'

export interface Translations {
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    back: string
    next: string
    previous: string
    confirm: string
    yes: string
    no: string
    close: string
    open: string
    search: string
    filter: string
    sort: string
    export: string
    import: string
    download: string
    upload: string
    refresh: string
    settings: string
    profile: string
    logout: string
    login: string
    register: string
    signup: string
    forgotPassword: string
    resetPassword: string
    changePassword: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    organization: string
    date: string
    time: string
    duration: string
    status: string
    actions: string
    details: string
    view: string
    create: string
    update: string
    remove: string
    select: string
    choose: string
    required: string
    optional: string
    invalid: string
    valid: string
    active: string
    inactive: string
    pending: string
    completed: string
    failed: string
    processing: string
    secure: string
    analyzing: string
    recording: string
    stopped: string
    paused: string
    resumed: string
  }
  
  // Navigation
  navigation: {
    dashboard: string
    consultations: string
    documents: string
    exports: string
    profile: string
    settings: string
    billing: string
    notifications: string
    security: string
    help: string
    support: string
    about: string
    privacy: string
    terms: string
    contact: string
  }
  
  // Authentication
  auth: {
    welcome: string
    welcomeBack: string
    signInToAccount: string
    createAccount: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    rememberMe: string
    forgotPassword: string
    resetPassword: string
    passwordResetSent: string
    checkEmail: string
    invalidCredentials: string
    accountCreated: string
    emailVerified: string
    verificationRequired: string
    sessionExpired: string
    unauthorized: string
    accessDenied: string
    loginSuccess: string
    logoutSuccess: string
    passwordChanged: string
    profileUpdated: string
  }
  
  // Dashboard
  dashboard: {
    title: string
    welcomeMessage: string
    newConsultation: string
    newDocument: string
    recentConsultations: string
    quickStats: string
    totalConsultations: string
    thisMonth: string
    averageDuration: string
    documentsGenerated: string
    upcomingAppointments: string
    noConsultations: string
    startFirstConsultation: string
    viewAllConsultations: string
    quickActions: string
    generateReport: string
    exportData: string
    managePatients: string
    systemStatus: string
    lastSync: string
    storageUsed: string
    notifications: string
    alerts: string
    reminders: string
  }
  
  // Consultations
  consultations: {
    title: string
    newConsultation: string
    consultationHistory: string
    startRecording: string
    stopRecording: string
    pauseRecording: string
    resumeRecording: string
    transcriptionInProgress: string
    generatingNotes: string
    notesGenerated: string
    validateNotes: string
    modifyNotes: string
    patientInfo: string
    consultationType: string
    duration: string
    notes: string
    transcription: string
    soapNotes: string
    medicalCoding: string
    suggestedCodes: string
    validateCoding: string
    modifyCoding: string
    saveConsultation: string
    completeConsultation: string
    archiveConsultation: string
    deleteConsultation: string
    consultationSaved: string
    consultationCompleted: string
    consultationArchived: string
    consultationDeleted: string
    noTranscription: string
    transcriptionError: string
    notesError: string
    codingError: string
    saveError: string
    loadError: string
  }
  
  // Documents
  documents: {
    title: string
    generateDocument: string
    documentType: string
    prescription: string
    letter: string
    report: string
    template: string
    preview: string
    sign: string
    download: string
    sendToPatient: string
    documentGenerated: string
    documentSigned: string
    documentSent: string
    documentDownloaded: string
    noDocuments: string
    generateFirstDocument: string
    selectTemplate: string
    customizeTemplate: string
    addSignature: string
    validateDocument: string
    printDocument: string
    emailDocument: string
    archiveDocument: string
    deleteDocument: string
  }
  
  // Profile
  profile: {
    title: string
    personalInfo: string
    accountInfo: string
    medicalSpecialty: string
    specialties: {
      generalPractice: string
      cardiology: string
      dermatology: string
      neurology: string
      psychiatry: string
      pediatrics: string
      gynecology: string
      orthopedics: string
      radiology: string
      anesthesiology: string
      emergencyMedicine: string
      internalMedicine: string
      surgery: string
      oncology: string
      endocrinology: string
    }
    security: string
    notifications: string
    billing: string
    subscription: string
    plan: string
    nextBilling: string
    amount: string
    modifySubscription: string
    billingHistory: string
    changePassword: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    passwordRequirements: string
    twoFactorAuth: string
    enable2FA: string
    disable2FA: string
    securityStatus: string
    secureConnection: string
    dataEncrypted: string
    accessLogging: string
    notificationPreferences: string
    emailNotifications: string
    consultationReminders: string
    systemUpdates: string
    lastLogin: string
    role: string
    accountCreated: string
  }
  
  // Exports
  exports: {
    title: string
    exportData: string
    selectFormat: string
    pdf: string
    csv: string
    fhir: string
    dateRange: string
    includeTranscription: string
    includeNotes: string
    includeCoding: string
    generateExport: string
    exportGenerated: string
    downloadExport: string
    exportHistory: string
    noExports: string
    fileSize: string
    createdAt: string
    format: string
    fileName: string
    downloadUrl: string
    exportError: string
    invalidData: string
    unauthorized: string
  }
  
  // Medical
  medical: {
    soap: {
      subjective: string
      objective: string
      assessment: string
      plan: string
    }
    dap: {
      data: string
      assessment: string
      plan: string
    }
    coding: {
      ngap: string
      ccam: string
      icd10: string
      dsm5: string
      suggestedCode: string
      codeExplanation: string
      validateCode: string
      modifyCode: string
      addCode: string
      removeCode: string
    }
    documents: {
      prescription: string
      referral: string
      report: string
      letter: string
      certificate: string
      sickLeave: string
    }
  }
  
  // Security
  security: {
    title: string
    secureConnection: string
    dataEncryption: string
    accessLogging: string
    twoFactorAuth: string
    passwordPolicy: string
    sessionTimeout: string
    auditTrail: string
    compliance: string
    gdpr: string
    hds: string
    hipaa: string
    disclaimer: string
    aiDisclaimer: string
    medicalDisclaimer: string
    privacyPolicy: string
    termsOfService: string
    dataRetention: string
    dataDeletion: string
    rightToAccess: string
    rightToRectification: string
    rightToErasure: string
    rightToPortability: string
  }
  
  // Errors
  errors: {
    generic: string
    network: string
    server: string
    unauthorized: string
    forbidden: string
    notFound: string
    validation: string
    timeout: string
    rateLimit: string
    maintenance: string
    tryAgain: string
    contactSupport: string
    reportIssue: string
  }
  
  // Success messages
  success: {
    saved: string
    updated: string
    deleted: string
    created: string
    sent: string
    downloaded: string
    exported: string
    imported: string
    uploaded: string
    processed: string
    completed: string
    verified: string
    activated: string
    deactivated: string
  }
}

export const translations: Record<Locale, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
      open: 'Open',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
      refresh: 'Refresh',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      signup: 'Sign Up',
      forgotPassword: 'Forgot Password',
      resetPassword: 'Reset Password',
      changePassword: 'Change Password',
      email: 'Email',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      organization: 'Organization',
      date: 'Date',
      time: 'Time',
      duration: 'Duration',
      status: 'Status',
      actions: 'Actions',
      details: 'Details',
      view: 'View',
      create: 'Create',
      update: 'Update',
      remove: 'Remove',
      select: 'Select',
      choose: 'Choose',
      required: 'Required',
      optional: 'Optional',
      invalid: 'Invalid',
      valid: 'Valid',
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      processing: 'Processing',
      secure: 'Secure',
      analyzing: 'Analyzing',
      recording: 'Recording',
      stopped: 'Stopped',
      paused: 'Paused',
      resumed: 'Resumed'
    },
    navigation: {
      dashboard: 'Dashboard',
      consultations: 'Consultations',
      documents: 'Documents',
      exports: 'Exports',
      profile: 'Profile',
      settings: 'Settings',
      billing: 'Billing',
      notifications: 'Notifications',
      security: 'Security',
      help: 'Help',
      support: 'Support',
      about: 'About',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact'
    },
    auth: {
      welcome: 'Welcome',
      welcomeBack: 'Welcome Back',
      signInToAccount: 'Sign in to your account',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      resetPassword: 'Reset Password',
      passwordResetSent: 'Password reset email sent',
      checkEmail: 'Check your email',
      invalidCredentials: 'Invalid credentials',
      accountCreated: 'Account created successfully',
      emailVerified: 'Email verified',
      verificationRequired: 'Email verification required',
      sessionExpired: 'Session expired',
      unauthorized: 'Unauthorized',
      accessDenied: 'Access denied',
      loginSuccess: 'Login successful',
      logoutSuccess: 'Logout successful',
      passwordChanged: 'Password changed successfully',
      profileUpdated: 'Profile updated successfully'
    },
    dashboard: {
      title: 'Dashboard',
      welcomeMessage: 'Welcome to Healthcare AI Assistant',
      newConsultation: 'New Consultation',
      newDocument: 'New Document',
      recentConsultations: 'Recent Consultations',
      quickStats: 'Quick Stats',
      totalConsultations: 'Total Consultations',
      thisMonth: 'This Month',
      averageDuration: 'Average Duration',
      documentsGenerated: 'Documents Generated',
      upcomingAppointments: 'Upcoming Appointments',
      noConsultations: 'No consultations yet',
      startFirstConsultation: 'Start your first consultation',
      viewAllConsultations: 'View All Consultations',
      quickActions: 'Quick Actions',
      generateReport: 'Generate Report',
      exportData: 'Export Data',
      managePatients: 'Manage Patients',
      systemStatus: 'System Status',
      lastSync: 'Last Sync',
      storageUsed: 'Storage Used',
      notifications: 'Notifications',
      alerts: 'Alerts',
      reminders: 'Reminders'
    },
    consultations: {
      title: 'Consultations',
      newConsultation: 'New Consultation',
      consultationHistory: 'Consultation History',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      pauseRecording: 'Pause Recording',
      resumeRecording: 'Resume Recording',
      transcriptionInProgress: 'Transcription in progress...',
      generatingNotes: 'Generating notes...',
      notesGenerated: 'Notes generated',
      validateNotes: 'Validate Notes',
      modifyNotes: 'Modify Notes',
      patientInfo: 'Patient Information',
      consultationType: 'Consultation Type',
      duration: 'Duration',
      notes: 'Notes',
      transcription: 'Transcription',
      soapNotes: 'SOAP Notes',
      medicalCoding: 'Medical Coding',
      suggestedCodes: 'Suggested Codes',
      validateCoding: 'Validate Coding',
      modifyCoding: 'Modify Coding',
      saveConsultation: 'Save Consultation',
      completeConsultation: 'Complete Consultation',
      archiveConsultation: 'Archive Consultation',
      deleteConsultation: 'Delete Consultation',
      consultationSaved: 'Consultation saved',
      consultationCompleted: 'Consultation completed',
      consultationArchived: 'Consultation archived',
      consultationDeleted: 'Consultation deleted',
      noTranscription: 'No transcription available',
      transcriptionError: 'Transcription error',
      notesError: 'Notes generation error',
      codingError: 'Coding error',
      saveError: 'Save error',
      loadError: 'Load error'
    },
    documents: {
      title: 'Documents',
      generateDocument: 'Generate Document',
      documentType: 'Document Type',
      prescription: 'Prescription',
      letter: 'Letter',
      report: 'Report',
      template: 'Template',
      preview: 'Preview',
      sign: 'Sign',
      download: 'Download',
      sendToPatient: 'Send to Patient',
      documentGenerated: 'Document generated',
      documentSigned: 'Document signed',
      documentSent: 'Document sent',
      documentDownloaded: 'Document downloaded',
      noDocuments: 'No documents',
      generateFirstDocument: 'Generate your first document',
      selectTemplate: 'Select Template',
      customizeTemplate: 'Customize Template',
      addSignature: 'Add Signature',
      validateDocument: 'Validate Document',
      printDocument: 'Print Document',
      emailDocument: 'Email Document',
      archiveDocument: 'Archive Document',
      deleteDocument: 'Delete Document'
    },
    profile: {
      title: 'Profile & Settings',
      personalInfo: 'Personal Information',
      accountInfo: 'Account Information',
      medicalSpecialty: 'Medical Specialty',
      specialties: {
        generalPractice: 'General Practice',
        cardiology: 'Cardiology',
        dermatology: 'Dermatology',
        neurology: 'Neurology',
        psychiatry: 'Psychiatry',
        pediatrics: 'Pediatrics',
        gynecology: 'Gynecology',
        orthopedics: 'Orthopedics',
        radiology: 'Radiology',
        anesthesiology: 'Anesthesiology',
        emergencyMedicine: 'Emergency Medicine',
        internalMedicine: 'Internal Medicine',
        surgery: 'Surgery',
        oncology: 'Oncology',
        endocrinology: 'Endocrinology'
      },
      security: 'Security',
      notifications: 'Notifications',
      billing: 'Billing',
      subscription: 'Subscription',
      plan: 'Plan',
      nextBilling: 'Next Billing',
      amount: 'Amount',
      modifySubscription: 'Modify Subscription',
      billingHistory: 'Billing History',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordRequirements: 'Password Requirements',
      twoFactorAuth: 'Two-Factor Authentication',
      enable2FA: 'Enable 2FA',
      disable2FA: 'Disable 2FA',
      securityStatus: 'Security Status',
      secureConnection: 'Secure HTTPS Connection',
      dataEncrypted: 'Data Encrypted AES-256',
      accessLogging: 'Access Logging',
      notificationPreferences: 'Notification Preferences',
      emailNotifications: 'Email Notifications',
      consultationReminders: 'Consultation Reminders',
      systemUpdates: 'System Updates',
      lastLogin: 'Last Login',
      role: 'Role',
      accountCreated: 'Account Created'
    },
    exports: {
      title: 'Exports',
      exportData: 'Export Data',
      selectFormat: 'Select Format',
      pdf: 'PDF',
      csv: 'CSV',
      fhir: 'FHIR',
      dateRange: 'Date Range',
      includeTranscription: 'Include Transcription',
      includeNotes: 'Include Notes',
      includeCoding: 'Include Coding',
      generateExport: 'Generate Export',
      exportGenerated: 'Export generated',
      downloadExport: 'Download Export',
      exportHistory: 'Export History',
      noExports: 'No exports',
      fileSize: 'File Size',
      createdAt: 'Created At',
      format: 'Format',
      fileName: 'File Name',
      downloadUrl: 'Download URL',
      exportError: 'Export error',
      invalidData: 'Invalid data',
      unauthorized: 'Unauthorized'
    },
    medical: {
      soap: {
        subjective: 'Subjective',
        objective: 'Objective',
        assessment: 'Assessment',
        plan: 'Plan'
      },
      dap: {
        data: 'Data',
        assessment: 'Assessment',
        plan: 'Plan'
      },
      coding: {
        ngap: 'NGAP',
        ccam: 'CCAM',
        icd10: 'ICD-10',
        dsm5: 'DSM-5',
        suggestedCode: 'Suggested Code',
        codeExplanation: 'Code Explanation',
        validateCode: 'Validate Code',
        modifyCode: 'Modify Code',
        addCode: 'Add Code',
        removeCode: 'Remove Code'
      },
      documents: {
        prescription: 'Prescription',
        referral: 'Referral',
        report: 'Report',
        letter: 'Letter',
        certificate: 'Certificate',
        sickLeave: 'Sick Leave'
      }
    },
    security: {
      title: 'Security',
      secureConnection: 'Secure Connection',
      dataEncryption: 'Data Encryption',
      accessLogging: 'Access Logging',
      twoFactorAuth: 'Two-Factor Authentication',
      passwordPolicy: 'Password Policy',
      sessionTimeout: 'Session Timeout',
      auditTrail: 'Audit Trail',
      compliance: 'Compliance',
      gdpr: 'GDPR',
      hds: 'HDS',
      hipaa: 'HIPAA',
      disclaimer: 'Disclaimer',
      aiDisclaimer: 'AI suggestions are drafts, to be validated by the practitioner, who remains solely responsible.',
      medicalDisclaimer: 'This tool assists but does not replace medical judgment.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      dataRetention: 'Data Retention',
      dataDeletion: 'Data Deletion',
      rightToAccess: 'Right to Access',
      rightToRectification: 'Right to Rectification',
      rightToErasure: 'Right to Erasure',
      rightToPortability: 'Right to Portability'
    },
    errors: {
      generic: 'An error occurred',
      network: 'Network error',
      server: 'Server error',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      notFound: 'Not found',
      validation: 'Validation error',
      timeout: 'Request timeout',
      rateLimit: 'Rate limit exceeded',
      maintenance: 'System maintenance',
      tryAgain: 'Please try again',
      contactSupport: 'Contact support',
      reportIssue: 'Report issue'
    },
    success: {
      saved: 'Saved successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      created: 'Created successfully',
      sent: 'Sent successfully',
      downloaded: 'Downloaded successfully',
      exported: 'Exported successfully',
      imported: 'Imported successfully',
      uploaded: 'Uploaded successfully',
      processed: 'Processed successfully',
      completed: 'Completed successfully',
      verified: 'Verified successfully',
      activated: 'Activated successfully',
      deactivated: 'Deactivated successfully'
    }
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Sauvegarder',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      confirm: 'Confirmer',
      yes: 'Oui',
      no: 'Non',
      close: 'Fermer',
      open: 'Ouvrir',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      export: 'Exporter',
      import: 'Importer',
      download: 'Télécharger',
      upload: 'Téléverser',
      refresh: 'Actualiser',
      settings: 'Paramètres',
      profile: 'Profil',
      logout: 'Déconnexion',
      login: 'Connexion',
      register: 'Inscription',
      signup: 'S\'inscrire',
      forgotPassword: 'Mot de passe oublié',
      resetPassword: 'Réinitialiser le mot de passe',
      changePassword: 'Changer le mot de passe',
      email: 'Email',
      password: 'Mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Téléphone',
      organization: 'Établissement',
      date: 'Date',
      time: 'Heure',
      duration: 'Durée',
      status: 'Statut',
      actions: 'Actions',
      details: 'Détails',
      view: 'Voir',
      create: 'Créer',
      update: 'Mettre à jour',
      remove: 'Supprimer',
      select: 'Sélectionner',
      choose: 'Choisir',
      required: 'Requis',
      optional: 'Optionnel',
      invalid: 'Invalide',
      valid: 'Valide',
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
      completed: 'Terminé',
      failed: 'Échec',
      processing: 'En cours',
      secure: 'Sécurisé',
      analyzing: 'Analyse en cours',
      recording: 'Enregistrement',
      stopped: 'Arrêté',
      paused: 'En pause',
      resumed: 'Repris'
    },
    navigation: {
      dashboard: 'Tableau de bord',
      consultations: 'Consultations',
      documents: 'Documents',
      exports: 'Exports',
      profile: 'Profil',
      settings: 'Paramètres',
      billing: 'Facturation',
      notifications: 'Notifications',
      security: 'Sécurité',
      help: 'Aide',
      support: 'Support',
      about: 'À propos',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      contact: 'Contact'
    },
    auth: {
      welcome: 'Bienvenue',
      welcomeBack: 'Bon retour',
      signInToAccount: 'Connectez-vous à votre compte',
      createAccount: 'Créer un compte',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      dontHaveAccount: 'Vous n\'avez pas de compte ?',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      resetPassword: 'Réinitialiser le mot de passe',
      passwordResetSent: 'Email de réinitialisation envoyé',
      checkEmail: 'Vérifiez votre email',
      invalidCredentials: 'Identifiants invalides',
      accountCreated: 'Compte créé avec succès',
      emailVerified: 'Email vérifié',
      verificationRequired: 'Vérification email requise',
      sessionExpired: 'Session expirée',
      unauthorized: 'Non autorisé',
      accessDenied: 'Accès refusé',
      loginSuccess: 'Connexion réussie',
      logoutSuccess: 'Déconnexion réussie',
      passwordChanged: 'Mot de passe changé avec succès',
      profileUpdated: 'Profil mis à jour avec succès'
    },
    dashboard: {
      title: 'Tableau de bord',
      welcomeMessage: 'Bienvenue dans Healthcare AI Assistant',
      newConsultation: 'Nouvelle consultation',
      newDocument: 'Nouveau document',
      recentConsultations: 'Consultations récentes',
      quickStats: 'Statistiques rapides',
      totalConsultations: 'Total consultations',
      thisMonth: 'Ce mois',
      averageDuration: 'Durée moyenne',
      documentsGenerated: 'Documents générés',
      upcomingAppointments: 'Rendez-vous à venir',
      noConsultations: 'Aucune consultation',
      startFirstConsultation: 'Commencez votre première consultation',
      viewAllConsultations: 'Voir toutes les consultations',
      quickActions: 'Actions rapides',
      generateReport: 'Générer un rapport',
      exportData: 'Exporter les données',
      managePatients: 'Gérer les patients',
      systemStatus: 'État du système',
      lastSync: 'Dernière synchronisation',
      storageUsed: 'Stockage utilisé',
      notifications: 'Notifications',
      alerts: 'Alertes',
      reminders: 'Rappels'
    },
    consultations: {
      title: 'Consultations',
      newConsultation: 'Nouvelle consultation',
      consultationHistory: 'Historique des consultations',
      startRecording: 'Commencer l\'enregistrement',
      stopRecording: 'Arrêter l\'enregistrement',
      pauseRecording: 'Mettre en pause',
      resumeRecording: 'Reprendre l\'enregistrement',
      transcriptionInProgress: 'Transcription en cours...',
      generatingNotes: 'Génération des notes...',
      notesGenerated: 'Notes générées',
      validateNotes: 'Valider les notes',
      modifyNotes: 'Modifier les notes',
      patientInfo: 'Informations patient',
      consultationType: 'Type de consultation',
      duration: 'Durée',
      notes: 'Notes',
      transcription: 'Transcription',
      soapNotes: 'Notes SOAP',
      medicalCoding: 'Codage médical',
      suggestedCodes: 'Codes suggérés',
      validateCoding: 'Valider le codage',
      modifyCoding: 'Modifier le codage',
      saveConsultation: 'Sauvegarder la consultation',
      completeConsultation: 'Terminer la consultation',
      archiveConsultation: 'Archiver la consultation',
      deleteConsultation: 'Supprimer la consultation',
      consultationSaved: 'Consultation sauvegardée',
      consultationCompleted: 'Consultation terminée',
      consultationArchived: 'Consultation archivée',
      consultationDeleted: 'Consultation supprimée',
      noTranscription: 'Aucune transcription disponible',
      transcriptionError: 'Erreur de transcription',
      notesError: 'Erreur de génération des notes',
      codingError: 'Erreur de codage',
      saveError: 'Erreur de sauvegarde',
      loadError: 'Erreur de chargement'
    },
    documents: {
      title: 'Documents',
      generateDocument: 'Générer un document',
      documentType: 'Type de document',
      prescription: 'Ordonnance',
      letter: 'Lettre',
      report: 'Rapport',
      template: 'Modèle',
      preview: 'Aperçu',
      sign: 'Signer',
      download: 'Télécharger',
      sendToPatient: 'Envoyer au patient',
      documentGenerated: 'Document généré',
      documentSigned: 'Document signé',
      documentSent: 'Document envoyé',
      documentDownloaded: 'Document téléchargé',
      noDocuments: 'Aucun document',
      generateFirstDocument: 'Générez votre premier document',
      selectTemplate: 'Sélectionner un modèle',
      customizeTemplate: 'Personnaliser le modèle',
      addSignature: 'Ajouter une signature',
      validateDocument: 'Valider le document',
      printDocument: 'Imprimer le document',
      emailDocument: 'Envoyer par email',
      archiveDocument: 'Archiver le document',
      deleteDocument: 'Supprimer le document'
    },
    profile: {
      title: 'Profil et paramètres',
      personalInfo: 'Informations personnelles',
      accountInfo: 'Informations du compte',
      medicalSpecialty: 'Spécialité médicale',
      specialties: {
        generalPractice: 'Médecine générale',
        cardiology: 'Cardiologie',
        dermatology: 'Dermatologie',
        neurology: 'Neurologie',
        psychiatry: 'Psychiatrie',
        pediatrics: 'Pédiatrie',
        gynecology: 'Gynécologie',
        orthopedics: 'Orthopédie',
        radiology: 'Radiologie',
        anesthesiology: 'Anesthésiologie',
        emergencyMedicine: 'Médecine d\'urgence',
        internalMedicine: 'Médecine interne',
        surgery: 'Chirurgie',
        oncology: 'Oncologie',
        endocrinology: 'Endocrinologie'
      },
      security: 'Sécurité',
      notifications: 'Notifications',
      billing: 'Facturation',
      subscription: 'Abonnement',
      plan: 'Plan',
      nextBilling: 'Prochaine facturation',
      amount: 'Montant',
      modifySubscription: 'Modifier l\'abonnement',
      billingHistory: 'Historique des factures',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le nouveau mot de passe',
      passwordRequirements: 'Exigences du mot de passe',
      twoFactorAuth: 'Authentification à deux facteurs',
      enable2FA: 'Activer 2FA',
      disable2FA: 'Désactiver 2FA',
      securityStatus: 'État de la sécurité',
      secureConnection: 'Connexion sécurisée HTTPS',
      dataEncrypted: 'Données chiffrées AES-256',
      accessLogging: 'Journalisation des accès',
      notificationPreferences: 'Préférences de notification',
      emailNotifications: 'Notifications par email',
      consultationReminders: 'Rappels de consultation',
      systemUpdates: 'Mises à jour système',
      lastLogin: 'Dernière connexion',
      role: 'Rôle',
      accountCreated: 'Compte créé'
    },
    exports: {
      title: 'Exports',
      exportData: 'Exporter les données',
      selectFormat: 'Sélectionner le format',
      pdf: 'PDF',
      csv: 'CSV',
      fhir: 'FHIR',
      dateRange: 'Plage de dates',
      includeTranscription: 'Inclure la transcription',
      includeNotes: 'Inclure les notes',
      includeCoding: 'Inclure le codage',
      generateExport: 'Générer l\'export',
      exportGenerated: 'Export généré',
      downloadExport: 'Télécharger l\'export',
      exportHistory: 'Historique des exports',
      noExports: 'Aucun export',
      fileSize: 'Taille du fichier',
      createdAt: 'Créé le',
      format: 'Format',
      fileName: 'Nom du fichier',
      downloadUrl: 'URL de téléchargement',
      exportError: 'Erreur d\'export',
      invalidData: 'Données invalides',
      unauthorized: 'Non autorisé'
    },
    medical: {
      soap: {
        subjective: 'Subjectif',
        objective: 'Objectif',
        assessment: 'Évaluation',
        plan: 'Plan'
      },
      dap: {
        data: 'Données',
        assessment: 'Évaluation',
        plan: 'Plan'
      },
      coding: {
        ngap: 'NGAP',
        ccam: 'CCAM',
        icd10: 'ICD-10',
        dsm5: 'DSM-5',
        suggestedCode: 'Code suggéré',
        codeExplanation: 'Explication du code',
        validateCode: 'Valider le code',
        modifyCode: 'Modifier le code',
        addCode: 'Ajouter un code',
        removeCode: 'Supprimer le code'
      },
      documents: {
        prescription: 'Ordonnance',
        referral: 'Orientation',
        report: 'Rapport',
        letter: 'Lettre',
        certificate: 'Certificat',
        sickLeave: 'Arrêt maladie'
      }
    },
    security: {
      title: 'Sécurité',
      secureConnection: 'Connexion sécurisée',
      dataEncryption: 'Chiffrement des données',
      accessLogging: 'Journalisation des accès',
      twoFactorAuth: 'Authentification à deux facteurs',
      passwordPolicy: 'Politique de mot de passe',
      sessionTimeout: 'Délai d\'expiration de session',
      auditTrail: 'Piste d\'audit',
      compliance: 'Conformité',
      gdpr: 'RGPD',
      hds: 'HDS',
      hipaa: 'HIPAA',
      disclaimer: 'Avertissement',
      aiDisclaimer: 'Les suggestions IA sont des brouillons, à valider par le praticien, qui reste seul responsable.',
      medicalDisclaimer: 'Cet outil assiste mais ne remplace pas le jugement médical.',
      privacyPolicy: 'Politique de confidentialité',
      termsOfService: 'Conditions d\'utilisation',
      dataRetention: 'Rétention des données',
      dataDeletion: 'Suppression des données',
      rightToAccess: 'Droit d\'accès',
      rightToRectification: 'Droit de rectification',
      rightToErasure: 'Droit à l\'effacement',
      rightToPortability: 'Droit à la portabilité'
    },
    errors: {
      generic: 'Une erreur s\'est produite',
      network: 'Erreur réseau',
      server: 'Erreur serveur',
      unauthorized: 'Non autorisé',
      forbidden: 'Interdit',
      notFound: 'Non trouvé',
      validation: 'Erreur de validation',
      timeout: 'Délai d\'attente dépassé',
      rateLimit: 'Limite de taux dépassée',
      maintenance: 'Maintenance système',
      tryAgain: 'Veuillez réessayer',
      contactSupport: 'Contacter le support',
      reportIssue: 'Signaler un problème'
    },
    success: {
      saved: 'Sauvegardé avec succès',
      updated: 'Mis à jour avec succès',
      deleted: 'Supprimé avec succès',
      created: 'Créé avec succès',
      sent: 'Envoyé avec succès',
      downloaded: 'Téléchargé avec succès',
      exported: 'Exporté avec succès',
      imported: 'Importé avec succès',
      uploaded: 'Téléversé avec succès',
      processed: 'Traité avec succès',
      completed: 'Terminé avec succès',
      verified: 'Vérifié avec succès',
      activated: 'Activé avec succès',
      deactivated: 'Désactivé avec succès'
    }
  }
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en
}

export function t(key: string, locale: Locale = 'en'): string {
  const keys = key.split('.')
  let value: any = getTranslations(locale)
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}