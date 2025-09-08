import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { consultationSchema } from '@/lib/validation'
import { encrypt } from '@/lib/encryption'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const patientId = formData.get('patientId') as string
    const audioFile = formData.get('audio') as File

    if (!title || !audioFile) {
      return NextResponse.json(
        { message: 'Titre et fichier audio requis' },
        { status: 400 }
      )
    }

    // Validate input
    const validatedData = consultationSchema.parse({
      title,
      patientId: patientId || undefined
    })

    // Convert audio file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    
    // TODO: Upload audio file to secure storage (AWS S3, etc.)
    // For now, we'll store the file path
    const audioFileName = `consultation_${Date.now()}_${session.user.id}.webm`
    const audioFileUrl = `/uploads/audio/${audioFileName}`

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: {
        userId: session.user.id,
        patientId: validatedData.patientId || null,
        title: validatedData.title,
        audioFileUrl,
        status: 'IN_PROGRESS',
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'CONSULTATION',
        resourceId: consultation.id,
        details: {
          title: validatedData.title,
          patientId: validatedData.patientId,
          audioFileSize: audioFile.size,
          createdAt: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: consultation.id,
        title: consultation.title,
        status: consultation.status,
        audioFileUrl: consultation.audioFileUrl
      }
    })

  } catch (error) {
    console.error('Consultation creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Erreur lors de la création de la consultation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const patientId = searchParams.get('patientId')

    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    if (patientId) {
      where.patientId = patientId
    }

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        include: {
          patient: true,
          documents: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.consultation.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: consultations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Consultations fetch error:', error)
    return NextResponse.json(
      { message: 'Erreur lors du chargement des consultations' },
      { status: 500 }
    )
  }
}