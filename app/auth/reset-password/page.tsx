'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeftIcon,
  LockClosedIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      toast.error(
        locale === 'fr' 
          ? 'Token de réinitialisation manquant'
          : 'Missing reset token'
      )
      router.push('/auth/forgot-password')
      return
    }
    setToken(tokenParam)
  }, [searchParams, router, locale])

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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'fr' ? 'Mot de passe réinitialisé' : 'Password reset'}
            </h2>
            <p className="text-gray-600 mt-2">
              {locale === 'fr' 
                ? 'Votre mot de passe a été réinitialisé avec succès.'
                : 'Your password has been reset successfully.'
              }
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/auth/login" 
              className="btn-primary"
            >
              {locale === 'fr' ? 'Se connecter' : 'Sign in'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">
            {locale === 'fr' ? 'Vérification du token...' : 'Verifying token...'}
          </p>
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
            <Link href="/auth/login" className="flex items-center">
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
            {locale === 'fr' ? 'Nouveau mot de passe' : 'New password'}
          </h2>
          <p className="text-gray-600 mt-2">
            {locale === 'fr' 
              ? 'Entrez votre nouveau mot de passe'
              : 'Enter your new password'
            }
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Nouveau mot de passe' : 'New password'}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pl-10 pr-10"
                  placeholder={locale === 'fr' ? 'Mot de passe' : 'Password'}
                />
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Confirmer le mot de passe' : 'Confirm password'}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pl-10 pr-10"
                  placeholder={locale === 'fr' ? 'Confirmer le mot de passe' : 'Confirm password'}
                />
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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