import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { decrypt, encrypt } from '@/lib/encryption'

export async function GET(
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

    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        patient: true
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { message: 'Consultation non trouvée' },
        { status: 404 }
      )
    }

    // Decrypt sensitive data
    const decryptedConsultation = {
      ...consultation,
      transcription: consultation.transcription ? decrypt(consultation.transcription as string) : null,
      soapNotes: consultation.soapNotes ? decrypt(consultation.soapNotes as string) : null,
      medicalCoding: consultation.medicalCoding ? decrypt(consultation.medicalCoding as string) : null,
    }

    return NextResponse.json({
      success: true,
      data: decryptedConsultation
    })

  } catch (error) {
    console.error('Consultation fetch error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la consultation' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const body = await request.json()
    const { title, status, soapNotes, medicalCoding } = body

    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { message: 'Consultation non trouvée' },
        { status: 404 }
      )
    }

    // Encrypt sensitive data
    const encryptedData: any = {}
    if (soapNotes) {
      encryptedData.soapNotes = encrypt(JSON.stringify(soapNotes))
    }
    if (medicalCoding) {
      encryptedData.medicalCoding = encrypt(JSON.stringify(medicalCoding))
    }

    const updatedConsultation = await prisma.consultation.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(status && { status }),
        ...encryptedData,
        updatedAt: new Date()
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'CONSULTATION',
        resourceId: params.id,
        details: {
          updatedFields: Object.keys(body),
          updatedAt: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedConsultation
    })

  } catch (error) {
    console.error('Consultation update error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la consultation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { message: 'Consultation non trouvée' },
        { status: 404 }
      )
    }

    await prisma.consultation.delete({
      where: { id: params.id }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'CONSULTATION',
        resourceId: params.id,
        details: {
          deletedAt: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Consultation supprimée avec succès'
    })

  } catch (error) {
    console.error('Consultation delete error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la consultation' },
      { status: 500 }
    )
  }
}