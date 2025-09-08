'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
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

      setIsEmailSent(true)
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

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'fr' ? 'Email envoyé' : 'Email sent'}
            </h2>
            <p className="text-gray-600 mt-2">
              {locale === 'fr' 
                ? 'Vérifiez votre boîte de réception pour les instructions de réinitialisation.'
                : 'Check your inbox for reset instructions.'
              }
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                {locale === 'fr' 
                  ? 'Vous n\'avez pas reçu l\'email ?'
                  : 'Didn\'t receive the email?'
                }
              </p>
              <button
                onClick={() => setIsEmailSent(false)}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                {locale === 'fr' ? 'Réessayer' : 'Try again'}
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <ArrowLeftIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-600">
                {locale === 'fr' ? 'Retour' : 'Back'}
              </span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {locale === 'fr' ? 'Mot de passe oublié' : 'Forgot password'}
          </h2>
          <p className="text-gray-600 mt-2">
            {locale === 'fr' 
              ? 'Entrez votre adresse email pour recevoir un lien de réinitialisation'
              : 'Enter your email address to receive a reset link'
            }
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('common.email')}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="input-field pl-10"
                  placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
                />
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
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
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}