import OpenAI from 'openai'
import { MedicalSpecialty, SOAPNotes, DAPNotes, MedicalCoding } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class AIService {
  static async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: new File([audioBuffer], 'audio.webm', { type: 'audio/webm' }),
        model: 'whisper-1',
        language: 'fr', // French for French medical context
        response_format: 'text',
      })
      
      return transcription
    } catch (error) {
      console.error('Transcription error:', error)
      throw new Error('Failed to transcribe audio')
    }
  }

  static async generateSOAPNotes(
    transcription: string,
    specialty: MedicalSpecialty
  ): Promise<SOAPNotes> {
    try {
      const prompt = this.getSOAPPrompt(specialty)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: `Transcription de la consultation:\n\n${transcription}`
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      const parsed = JSON.parse(content)
      return {
        subjective: parsed.subjective || '',
        objective: parsed.objective || '',
        assessment: parsed.assessment || '',
        plan: parsed.plan || '',
      }
    } catch (error) {
      console.error('SOAP notes generation error:', error)
      throw new Error('Failed to generate SOAP notes')
    }
  }

  static async generateMedicalCoding(
    soapNotes: SOAPNotes,
    specialty: MedicalSpecialty
  ): Promise<MedicalCoding> {
    try {
      const prompt = this.getCodingPrompt(specialty)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: `Notes SOAP:\n\nSubjective: ${soapNotes.subjective}\nObjective: ${soapNotes.objective}\nAssessment: ${soapNotes.assessment}\nPlan: ${soapNotes.plan}`
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      const parsed = JSON.parse(content)
      return {
        ngap: parsed.ngap || '',
        ccam: parsed.ccam || '',
        icd10: parsed.icd10 || '',
        dsm5: parsed.dsm5 || '',
        explanation: parsed.explanation || '',
      }
    } catch (error) {
      console.error('Medical coding error:', error)
      throw new Error('Failed to generate medical coding')
    }
  }

  static async generateDocument(
    documentType: string,
    soapNotes: SOAPNotes,
    patientInfo: any,
    specialty: MedicalSpecialty
  ): Promise<string> {
    try {
      const prompt = this.getDocumentPrompt(documentType, specialty)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: `Type de document: ${documentType}\n\nNotes SOAP:\n${JSON.stringify(soapNotes, null, 2)}\n\nInformations patient:\n${JSON.stringify(patientInfo, null, 2)}`
          }
        ],
        temperature: 0.3,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      return content
    } catch (error) {
      console.error('Document generation error:', error)
      throw new Error('Failed to generate document')
    }
  }

  private static getSOAPPrompt(specialty: MedicalSpecialty): string {
    return `Tu es un assistant IA médical spécialisé en ${specialty}. 
    Ton rôle est d'analyser une transcription de consultation médicale et de structurer les informations selon le format SOAP (Subjective, Objective, Assessment, Plan).
    
    IMPORTANT: 
    - Tu dois toujours rappeler que tes suggestions sont des brouillons à valider par le praticien
    - Le praticien reste seul responsable des décisions médicales
    - Respecte la confidentialité et la déontologie médicale
    
    Réponds UNIQUEMENT en JSON avec les champs suivants:
    {
      "subjective": "Symptômes rapportés par le patient, antécédents, plaintes",
      "objective": "Observations cliniques, examens, signes vitaux",
      "assessment": "Diagnostic différentiel, hypothèses diagnostiques",
      "plan": "Traitement proposé, examens complémentaires, suivi"
    }`
  }

  private static getCodingPrompt(specialty: MedicalSpecialty): string {
    return `Tu es un expert en codage médical français spécialisé en ${specialty}.
    Ton rôle est de suggérer les codes médicaux appropriés basés sur les notes SOAP.
    
    Codes à suggérer selon la spécialité:
    - NGAP (Nomenclature Générale des Actes Professionnels)
    - CCAM (Classification Commune des Actes Médicaux) 
    - ICD-10 (Classification Internationale des Maladies)
    - DSM-5 (si spécialité psychiatrie)
    
    Réponds UNIQUEMENT en JSON:
    {
      "ngap": "code NGAP approprié",
      "ccam": "code CCAM approprié", 
      "icd10": "code ICD-10 approprié",
      "dsm5": "code DSM-5 si applicable",
      "explanation": "Explication du choix des codes"
    }`
  }

  private static getDocumentPrompt(documentType: string, specialty: MedicalSpecialty): string {
    return `Tu es un assistant IA médical spécialisé en ${specialty}.
    Ton rôle est de générer un document médical de type "${documentType}" basé sur les notes SOAP et les informations patient.
    
    IMPORTANT:
    - Le document doit être professionnel et conforme aux standards médicaux français
    - Inclure un disclaimer: "Ce document a été généré avec l'assistance d'une IA et doit être validé par le praticien"
    - Respecter la confidentialité et la déontologie médicale
    - Adapter le format selon le type de document demandé
    
    Génère un document complet et professionnel.`
  }
}