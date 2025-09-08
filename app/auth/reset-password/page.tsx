'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeftIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
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
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [passwordReset, setPasswordReset] = useState(false)
  
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    if (token) {
      validateToken()
    } else {
      setIsValidToken(false)
    }
  }, [token])

  const validateToken = async () => {
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

      setPasswordReset(true)
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

  if (passwordReset) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'fr' ? 'Mot de passe réinitialisé' : 'Password reset'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? 'Votre mot de passe a été réinitialisé avec succès'
                : 'Your password has been reset successfully'
              }
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <Link href="/auth/login" className="btn-primary w-full">
                {locale === 'fr' ? 'Se connecter' : 'Sign in'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'fr' ? 'Lien invalide' : 'Invalid link'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? 'Ce lien de réinitialisation est invalide ou a expiré'
                : 'This reset link is invalid or has expired'
              }
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center space-y-4">
              <Link href="/auth/forgot-password" className="btn-primary w-full">
                {locale === 'fr' ? 'Demander un nouveau lien' : 'Request new link'}
              </Link>
              
              <Link href="/auth/login" className="text-center text-primary-600 hover:text-primary-500 text-sm block">
                {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">
              {locale === 'fr' ? 'Validation du lien...' : 'Validating link...'}
            </p>
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
          <LockClosedIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'fr' ? 'Nouveau mot de passe' : 'New password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {locale === 'fr' 
              ? 'Entrez votre nouveau mot de passe'
              : 'Enter your new password'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Nouveau mot de passe' : 'New password'}
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="new-password"
                  className="input-field"
                  placeholder={locale === 'fr' ? 'Minimum 8 caractères' : 'Minimum 8 characters'}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Confirmer le mot de passe' : 'Confirm password'}
              </label>
              <div className="mt-1">
                <input
                  {...register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  className="input-field"
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
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {locale === 'fr' ? 'Réinitialisation...' : 'Resetting...'}
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-4 w-4 mr-2" />
                    {locale === 'fr' ? 'Réinitialiser le mot de passe' : 'Reset password'}
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