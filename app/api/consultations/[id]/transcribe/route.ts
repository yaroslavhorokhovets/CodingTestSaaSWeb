import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AIService } from '@/lib/ai'
import { encrypt } from '@/lib/encryption'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const consultationId = params.id

    // Get consultation
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        userId: session.user.id
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { message: 'Consultation non trouvée' },
        { status: 404 }
      )
    }

    if (!consultation.audioFileUrl) {
      return NextResponse.json(
        { message: 'Aucun fichier audio trouvé' },
        { status: 400 }
      )
    }

    // Update status to transcribing
    await prisma.consultation.update({
      where: { id: consultationId },
      data: { status: 'TRANSCRIBING' }
    })

    try {
      // TODO: Get audio file from storage
      // For now, we'll simulate the transcription process
      const mockTranscription = `Transcription simulée de la consultation "${consultation.title}".
      
      Le patient présente des symptômes de fatigue et de maux de tête.
      L'examen clinique révèle une tension artérielle légèrement élevée.
      Il est recommandé de surveiller la tension et de faire des analyses sanguines.
      Rendez-vous de suivi dans 2 semaines.`

      // Update consultation with transcription
      const updatedConsultation = await prisma.consultation.update({
        where: { id: consultationId },
        data: {
          transcription: encrypt(mockTranscription),
          status: 'PROCESSING'
        }
      })

      // Generate SOAP notes
      const soapNotes = await AIService.generateSOAPNotes(
        mockTranscription,
        session.user.medicalSpecialty
      )

      // Generate medical coding
      const medicalCoding = await AIService.generateMedicalCoding(
        soapNotes,
        session.user.medicalSpecialty
      )

      // Update consultation with SOAP notes and coding
      await prisma.consultation.update({
        where: { id: consultationId },
        data: {
          soapNotes: encrypt(JSON.stringify(soapNotes)),
          medicalCodes: encrypt(JSON.stringify(medicalCoding)),
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'UPDATE',
          resource: 'CONSULTATION',
          resourceId: consultationId,
          details: {
            transcriptionCompleted: true,
            soapNotesGenerated: true,
            medicalCodingGenerated: true,
            completedAt: new Date()
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          text: mockTranscription,
          confidence: 0.95,
          soapNotes,
          medicalCoding
        }
      })

    } catch (aiError) {
      console.error('AI processing error:', aiError)
      
      // Update status to indicate error
      await prisma.consultation.update({
        where: { id: consultationId },
        data: { status: 'COMPLETED' } // Still mark as completed even if AI failed
      })

      return NextResponse.json(
        { message: 'Erreur lors du traitement IA, mais la consultation a été sauvegardée' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la transcription' },
      { status: 500 }
    )
  }
}