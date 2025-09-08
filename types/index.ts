// Define enums locally until Prisma client is generated
export enum MedicalSpecialty {
  GENERAL_PRACTICE = 'GENERAL_PRACTICE',
  CARDIOLOGY = 'CARDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  PSYCHIATRY = 'PSYCHIATRY',
  PEDIATRICS = 'PEDIATRICS',
  GYNECOLOGY = 'GYNECOLOGY',
  ORTHOPEDICS = 'ORTHOPEDICS',
  RADIOLOGY = 'RADIOLOGY',
  ANESTHESIOLOGY = 'ANESTHESIOLOGY',
  EMERGENCY_MEDICINE = 'EMERGENCY_MEDICINE',
  INTERNAL_MEDICINE = 'INTERNAL_MEDICINE',
  SURGERY = 'SURGERY',
  ONCOLOGY = 'ONCOLOGY',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY'
}

export enum UserRole {
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum ConsultationStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  TRANSCRIBING = 'TRANSCRIBING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum DocumentType {
  PRESCRIPTION = 'PRESCRIPTION',
  LETTER = 'LETTER',
  REPORT = 'REPORT',
  REFERRAL = 'REFERRAL',
  CERTIFICATE = 'CERTIFICATE'
}

export enum ExportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  FHIR = 'FHIR'
}

// Import Prisma types when available
export type {
  User,
  Patient,
  Consultation,
  Document,
  Export,
  AuditLog,
} from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  medicalSpecialty: MedicalSpecialty
  organization?: string
  role: UserRole
}

export interface SOAPNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface DAPNotes {
  data: string
  assessment: string
  plan: string
}

export interface MedicalCoding {
  ngap?: string
  ccam?: string
  icd10?: string
  dsm5?: string
  explanation: string
}

export interface TranscriptionResult {
  text: string
  confidence: number
  timestamp: number
}

export interface DocumentTemplate {
  id: string
  name: string
  specialty: MedicalSpecialty
  type: DocumentType
  template: string
  fields: string[]
}

export interface ExportOptions {
  format: ExportFormat
  includeAudio: boolean
  includeTranscription: boolean
  includeNotes: boolean
  includeDocuments: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginAttempts: number
  lastPasswordChange: Date
}

export interface ComplianceSettings {
  gdprConsent: boolean
  dataRetentionDays: number
  auditLogging: boolean
  encryptionEnabled: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  totalConsultations: number
  totalDocuments: number
  totalExports: number
  averageConsultationDuration: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
  }>
}

export interface ConsultationFilters {
  status?: ConsultationStatus
  dateFrom?: Date
  dateTo?: Date
  patientId?: string
  specialty?: MedicalSpecialty
}

export interface DocumentFilters {
  type?: DocumentType
  dateFrom?: Date
  dateTo?: Date
  isSigned?: boolean
}

export interface ExportFilters {
  format?: ExportFormat
  dateFrom?: Date
  dateTo?: Date
}