import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email service (e.g., SendGrid, AWS SES, etc.)
    return nodemailer.createTransporter({
      service: 'gmail', // Change to your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  } else {
    // Development - use Ethereal Email for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    })
  }
}

export const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@healthcare-ai.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    }

    const info = await transporter.sendMail(mailOptions)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Email sent:', info.messageId)
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }
    
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Healthcare AI Assistant',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Welcome to Healthcare AI Assistant!</h2>
        <p>Hello ${firstName},</p>
        <p>Thank you for joining Healthcare AI Assistant. We're excited to help you revolutionize your medical practice with AI-powered tools.</p>
        
        <h3 style="color: #0ea5e9;">What you can do:</h3>
        <ul>
          <li>Real-time consultation transcription</li>
          <li>Automatic SOAP/DAP note generation</li>
          <li>Medical coding suggestions</li>
          <li>Secure document generation</li>
          <li>Compliance with HDS/GDPR standards</li>
        </ul>
        
        <p>Get started by creating your first consultation or exploring the dashboard.</p>
        
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Go to Dashboard
        </a>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Healthcare AI Assistant - Secure Medical Practice Management
        </p>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Password Reset Request</h2>
        <p>You requested a password reset for your Healthcare AI Assistant account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Healthcare AI Assistant - Secure Medical Practice Management
        </p>
      </div>
    `,
  })
}