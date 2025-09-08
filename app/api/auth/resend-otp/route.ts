import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { generateToken } from '@/lib/encryption'

const resendOtpSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resendOtpSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // In a real implementation, you would:
    // 1. Create a separate OtpToken table
    // 2. Store OTPs with expiration times
    // 3. Check rate limiting to prevent spam
    
    // For this demo, we'll use a simplified approach
    // In production, implement proper OTP storage and validation

    // Send OTP email
    await sendEmail({
      to: email,
      subject: 'Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px;">${otp}</span>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Healthcare AI Assistant - Secure Medical Practice Management
          </p>
        </div>
      `,
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'New verification code sent' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend OTP error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}