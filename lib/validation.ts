import { z } from 'zod'
import { MedicalSpecialty, UserRole } from '@prisma/client'

// User profile validation
export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  medicalSpecialty: z.nativeEnum(MedicalSpecialty),
  organization: z.string().optional(),
  phone: z.string().optional(),
})

export type UserProfileInput = z.infer<typeof userProfileSchema>

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

// Document validation
export const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.string().min(1, 'Document type is required'),
})

export type DocumentInput = z.infer<typeof documentSchema>

// Export validation
export const exportSchema = z.object({
  format: z.string().min(1, 'Export format is required'),
  includeAudio: z.boolean().default(false),
  includeTranscription: z.boolean().default(true),
  includeNotes: z.boolean().default(true),
  includeDocuments: z.boolean().default(true),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
})

export type ExportInput = z.infer<typeof exportSchema>

// Consultation validation
export const consultationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  patientId: z.string().optional(),
  notes: z.string().optional(),
})

export type ConsultationInput = z.infer<typeof consultationSchema>

// Registration validation
export const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  medicalSpecialty: z.nativeEnum(MedicalSpecialty),
  organization: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'GDPR consent is required',
  }),
})

export type RegistrationInput = z.infer<typeof registrationSchema>

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>