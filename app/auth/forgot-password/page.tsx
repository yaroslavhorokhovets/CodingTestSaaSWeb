'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
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
          ? 'Email de réinitialisation envoyé' 
          : 'Reset email sent successfully'
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
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {locale === 'fr' ? 'Email envoyé' : 'Email sent'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? 'Vérifiez votre boîte de réception pour les instructions de réinitialisation.'
                : 'Check your inbox for reset instructions.'
              }
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/auth/login"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            {locale === 'fr' ? 'Retour' : 'Back'}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="text-center">
          <EnvelopeIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {locale === 'fr' ? 'Mot de passe oublié' : 'Forgot Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {locale === 'fr' 
              ? 'Entrez votre adresse email pour recevoir un lien de réinitialisation.'
              : 'Enter your email address to receive a reset link.'
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {locale === 'fr' ? 'Ou' : 'Or'}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}