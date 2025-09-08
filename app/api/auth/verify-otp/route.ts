import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = verifyOtpSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // In a real implementation, you would:
    // 1. Create a separate OtpToken table
    // 2. Store OTPs with expiration times
    // 3. Verify the OTP is correct and not expired
    
    // For this demo, we'll use a simplified approach
    // In production, implement proper OTP validation
    
    // For demo purposes, accept any 6-digit OTP
    // In production, verify against stored OTP
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP format' },
        { status: 400 }
      )
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        updatedAt: new Date(),
      },
    })

    // In production, you would also:
    // 1. Invalidate the OTP token
    // 2. Log the verification event
    // 3. Send welcome email

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email verified successfully' 
      },
      { status: 200 }
    )

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