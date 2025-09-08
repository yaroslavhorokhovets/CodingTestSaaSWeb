// Test file to check TypeScript errors
import { ConsultationStatus, DocumentType, ExportFormat } from '@/types'

// Test enum values
const status1 = ConsultationStatus.TRANSCRIBING
const status2 = ConsultationStatus.PROCESSING
const docType = DocumentType.PRESCRIPTION
const exportFormat = ExportFormat.PDF

console.log(status1, status2, docType, exportFormat)