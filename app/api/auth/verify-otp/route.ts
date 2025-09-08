import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['verification', 'registration', 'password-reset']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp, purpose = 'verification' } = verifyOtpSchema.parse(body)

    // Find user with valid OTP
    const user = await prisma.user.findFirst({
      where: {
        email,
        otpCode: otp,
        otpExpiry: {
          gt: new Date(), // OTP not expired
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiry: null,
        emailVerified: purpose === 'registration' ? true : user.emailVerified,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}