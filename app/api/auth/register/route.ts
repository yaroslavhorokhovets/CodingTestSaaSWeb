import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validation'
import { encrypt } from '@/lib/encryption'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Un compte avec cette adresse email existe déjà' },
        { status: 400 }
      )
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: validatedData.password, // Already hashed in the frontend
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        medicalSpecialty: validatedData.medicalSpecialty,
        organization: validatedData.organization,
        phone: validatedData.phone,
        isEmailVerified: false, // Will be verified via email
      }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        resource: 'USER',
        resourceId: user.id,
        details: {
          registrationTime: new Date(),
          specialty: validatedData.medicalSpecialty,
          organization: validatedData.organization,
        }
      }
    })
    
    // TODO: Send verification email
    // await sendVerificationEmail(user.email, user.id)
    
    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        userId: user.id 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}