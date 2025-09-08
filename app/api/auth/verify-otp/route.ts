import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = verifyOtpSchema.parse(body)

    // Find user with valid OTP
    const user = await prisma.user.findFirst({
      where: {
        email,
        otpCode: otp,
        otpExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Update user as verified and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
    })

    return NextResponse.json({
      message: 'Email verified successfully',
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}