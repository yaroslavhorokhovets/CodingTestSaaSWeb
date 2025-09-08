import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { generateToken } from '@/lib/encryption'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { 
          success: true, 
          message: 'If an account with that email exists, we sent a password reset link.' 
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = generateToken()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store reset token in database (you might want to create a separate table for this)
    // For now, we'll use a simple approach with the user's updatedAt field
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        updatedAt: expiresAt, // Temporary storage
        // In production, create a separate PasswordResetToken table
      },
    })

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Password Reset Request</h2>
          <p>You requested a password reset for your Healthcare AI Assistant account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
            Reset Password
          </a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
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
        message: 'If an account with that email exists, we sent a password reset link.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Forgot password error:', error)
    
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