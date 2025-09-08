import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AIService } from '@/lib/ai'
import { decrypt } from '@/lib/encryption'
import { DocumentType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { consultationId, type } = body

    if (!consultationId || !type) {
      return NextResponse.json(
        { message: 'Consultation ID et type de document requis' },
        { status: 400 }
      )
    }

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

    // Decrypt consultation data
    const transcription = consultation.transcription ? decrypt(consultation.transcription) : ''
    const soapNotes = consultation.soapNotes ? JSON.parse(decrypt(consultation.soapNotes)) : null

    // Get patient information if available
    const patient = consultation.patientId ? await prisma.patient.findUnique({
      where: { id: consultation.patientId }
    }) : null

    // Generate document content using AI
    const documentContent = await AIService.generateDocument(
      type,
      soapNotes || {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
      },
      patient,
      session.user.medicalSpecialty
    )

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'GENERATE',
        resource: 'DOCUMENT',
        resourceId: consultationId,
        details: {
          type,
          consultationId,
          generatedAt: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        content: documentContent,
        type,
        consultationId
      }
    })

  } catch (error) {
    console.error('Document generation error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la génération du document' },
      { status: 500 }
    )
  }
}