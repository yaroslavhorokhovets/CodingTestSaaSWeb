import { z } from 'zod'
import { MedicalSpecialty, ExportFormat } from '@prisma/client'
import { DocumentType } from '@/types'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  medicalSpecialty: z.nativeEnum(MedicalSpecialty),
  organization: z.string().optional(),
  phone: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent is required'),
  termsAccepted: z.boolean().refine(val => val === true, 'Terms of use must be accepted'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  insuranceNumber: z.string().optional(),
})

export const consultationSchema = z.object({
  title: z.string().min(1, 'Consultation title is required'),
  patientId: z.string().optional(),
})

export const documentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  title: z.string().min(1, 'Document title is required'),
  content: z.string().min(1, 'Document content is required'),
})

export const exportSchema = z.object({
  format: z.nativeEnum(ExportFormat),
  includeAudio: z.boolean().default(false),
  includeTranscription: z.boolean().default(true),
  includeNotes: z.boolean().default(true),
  includeDocuments: z.boolean().default(true),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
})

export const soapNotesSchema = z.object({
  subjective: z.string().min(1, 'Subjective section is required'),
  objective: z.string().min(1, 'Objective section is required'),
  assessment: z.string().min(1, 'Assessment section is required'),
  plan: z.string().min(1, 'Plan section is required'),
})

export const medicalCodingSchema = z.object({
  ngap: z.string().optional(),
  ccam: z.string().optional(),
  icd10: z.string().optional(),
  dsm5: z.string().optional(),
  explanation: z.string().min(1, 'Explanation is required'),
})

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  medicalSpecialty: z.nativeEnum(MedicalSpecialty),
  organization: z.string().optional(),
  phone: z.string().optional(),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PatientInput = z.infer<typeof patientSchema>
export type ConsultationInput = z.infer<typeof consultationSchema>
export type DocumentInput = z.infer<typeof documentSchema>
export type ExportInput = z.infer<typeof exportSchema>
export type SOAPNotesInput = z.infer<typeof soapNotesSchema>
export type MedicalCodingInput = z.infer<typeof medicalCodingSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>