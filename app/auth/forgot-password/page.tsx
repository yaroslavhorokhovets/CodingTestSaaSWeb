'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send reset email')
      }

      setEmailSent(true)
      toast.success(
        locale === 'fr' 
          ? 'Email de réinitialisation envoyé avec succès'
          : 'Password reset email sent successfully'
      )
      
    } catch (error) {
      console.error('Error sending reset email:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : (locale === 'fr' ? 'Erreur lors de l\'envoi de l\'email' : 'Error sending email')
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'fr' ? 'Email envoyé' : 'Email sent'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? `Nous avons envoyé un lien de réinitialisation à ${getValues('email')}`
                : `We've sent a reset link to ${getValues('email')}`
              }
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {locale === 'fr' 
                  ? 'Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.'
                  : 'Check your inbox and follow the instructions to reset your password.'
                }
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setEmailSent(false)}
                  className="btn-secondary"
                >
                  {locale === 'fr' ? 'Envoyer un autre email' : 'Send another email'}
                </button>
                
                <Link href="/auth/login" className="text-center text-primary-600 hover:text-primary-500 text-sm">
                  {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Link href="/auth/login" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {locale === 'fr' ? 'Retour' : 'Back'}
          </Link>
          <LanguageSwitcher />
        </div>
        
        <div className="text-center">
          <EnvelopeIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'fr' ? 'Mot de passe oublié' : 'Forgot password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {locale === 'fr' 
              ? 'Entrez votre adresse email pour recevoir un lien de réinitialisation'
              : 'Enter your email address to receive a reset link'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('common.email')}
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="input-field"
                  placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {locale === 'fr' ? 'Envoi...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {locale === 'fr' ? 'Envoyer le lien' : 'Send reset link'}
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {locale === 'fr' ? 'Vous vous souvenez de votre mot de passe ?' : 'Remember your password?'}{' '}
                <Link href="/auth/login" className="text-primary-600 hover:text-primary-500">
                  {t('common.login')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}