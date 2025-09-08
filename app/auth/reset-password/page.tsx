'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeftIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      // Validate token
      validateToken(tokenParam)
    } else {
      setIsValidToken(false)
    }
  }, [searchParams])

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/validate-reset-token?token=${token}`)
      if (response.ok) {
        setIsValidToken(true)
      } else {
        setIsValidToken(false)
      }
    } catch (error) {
      console.error('Error validating token:', error)
      setIsValidToken(false)
    }
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to reset password')
      }

      setIsSuccess(true)
      toast.success(
        locale === 'fr' 
          ? 'Mot de passe réinitialisé avec succès' 
          : 'Password reset successfully'
      )
      
    } catch (error) {
      console.error('Error resetting password:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : (locale === 'fr' ? 'Erreur lors de la réinitialisation' : 'Error resetting password')
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {locale === 'fr' ? 'Lien invalide' : 'Invalid Link'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? 'Ce lien de réinitialisation est invalide ou a expiré.'
                : 'This reset link is invalid or has expired.'
              }
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <Link
              href="/auth/forgot-password"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {locale === 'fr' ? 'Demander un nouveau lien' : 'Request new link'}
            </Link>
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {locale === 'fr' ? 'Succès' : 'Success'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? 'Votre mot de passe a été réinitialisé avec succès.'
                : 'Your password has been reset successfully.'
              }
            </p>
          </div>
          
          <div className="mt-8">
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {locale === 'fr' ? 'Se connecter' : 'Sign in'}
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
          <LockClosedIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {locale === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {locale === 'fr' 
              ? 'Entrez votre nouveau mot de passe.'
              : 'Enter your new password.'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder={locale === 'fr' ? 'Minimum 8 caractères' : 'Minimum 8 characters'}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
              </label>
              <div className="mt-1">
                <input
                  {...register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder={locale === 'fr' ? 'Répétez le mot de passe' : 'Repeat password'}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                    {locale === 'fr' ? 'Réinitialisation...' : 'Resetting...'}
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-4 w-4 mr-2" />
                    {locale === 'fr' ? 'Réinitialiser' : 'Reset Password'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}