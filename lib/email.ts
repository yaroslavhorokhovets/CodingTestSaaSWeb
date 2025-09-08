import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Create transporter (configure with your email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Healthcare AI Assistant!</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for joining our platform. We're excited to help you revolutionize your medical practice with AI-powered tools.</p>
      <p>Your account has been created successfully. You can now:</p>
      <ul>
        <li>Start new consultations with real-time transcription</li>
        <li>Generate structured SOAP/DAP notes</li>
        <li>Create medical documents automatically</li>
        <li>Export data in multiple formats</li>
      </ul>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Healthcare AI Assistant Team</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Healthcare AI Assistant',
    html,
  })
}