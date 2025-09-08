import { User, Patient, Consultation, Document, Export, AuditLog, MedicalSpecialty, ConsultationStatus, DocumentType, ExportFormat, UserRole } from '@prisma/client'

export type {
  User,
  Patient,
  Consultation,
  Document,
  Export,
  AuditLog,
  MedicalSpecialty,
  ConsultationStatus,
  ExportFormat,
  UserRole,
  DocumentType,
}

// Re-export enums as values, not types
export { MedicalSpecialty, ConsultationStatus, DocumentType, ExportFormat, UserRole }


export enum ConsultationStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

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