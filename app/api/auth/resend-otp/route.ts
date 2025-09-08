import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'

const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  purpose: z.enum(['verification', 'registration', 'password-reset']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, purpose = 'verification' } = resendOtpSchema.parse(body)

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
    const otpCode = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = new Date(Date.now() + 300000) // 5 minutes

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode,
        otpExpiry,
      },
    })

    // Send OTP email
    const subject = purpose === 'registration' 
      ? 'Verify Your Email Address'
      : purpose === 'password-reset'
      ? 'Password Reset Verification Code'
      : 'Verification Code'

    const message = purpose === 'registration'
      ? 'Please verify your email address to complete your registration.'
      : purpose === 'password-reset'
      ? 'Use this code to verify your identity for password reset.'
      : 'Use this code to verify your identity.'

    await sendEmail({
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">${subject}</h2>
          <p>${message}</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #0ea5e9; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Healthcare AI Assistant - Secure Medical Practice Management
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    })

  } catch (error) {
    console.error('Resend OTP error:', error)
    
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