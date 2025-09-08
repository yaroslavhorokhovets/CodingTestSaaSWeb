import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { documentSchema } from '@/lib/validation'
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

    const body = await request.json()
    
    // Validate input
    const validatedData = documentSchema.parse(body)

    // Check if consultation exists and belongs to user
    if (validatedData.consultationId) {
      const consultation = await prisma.consultation.findFirst({
        where: {
          id: validatedData.consultationId,
          userId: session.user.id
        }
      })

      if (!consultation) {
        return NextResponse.json(
          { message: 'Consultation non trouvée' },
          { status: 404 }
        )
      }
    }

    // Create document
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        consultationId: validatedData.consultationId || null,
        type: validatedData.type,
        title: validatedData.title,
        content: encrypt(validatedData.content),
        templateUsed: validatedData.template || null,
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'DOCUMENT',
        resourceId: document.id,
        details: {
          type: validatedData.type,
          title: validatedData.title,
          consultationId: validatedData.consultationId,
          createdAt: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: document.id,
        type: document.type,
        title: document.title,
        createdAt: document.createdAt
      }
    })

  } catch (error) {
    console.error('Document creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Erreur lors de la création du document' },
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
    const type = searchParams.get('type')
    const consultationId = searchParams.get('consultationId')

    const where: any = {
      userId: session.user.id
    }

    if (type) {
      where.type = type
    }

    if (consultationId) {
      where.consultationId = consultationId
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          consultation: {
            select: {
              id: true,
              title: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.document.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: documents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Documents fetch error:', error)
    return NextResponse.json(
      { message: 'Erreur lors du chargement des documents' },
      { status: 500 }
    )
  }
}