'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeftIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type OtpInput = z.infer<typeof otpSchema>

export default function OtpVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
  })

  const otpValue = watch('otp')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      router.push('/auth/login')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const onSubmit = async (data: OtpInput) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Invalid OTP')
      }

      setIsSuccess(true)
      toast.success(
        locale === 'fr' 
          ? 'Email vérifié avec succès' 
          : 'Email verified successfully'
      )
      
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : (locale === 'fr' ? 'Code OTP invalide' : 'Invalid OTP code')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) return
    
    setIsResending(true)
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to resend OTP')
      }

      setTimeLeft(300)
      setCanResend(false)
      toast.success(
        locale === 'fr' 
          ? 'Code OTP renvoyé' 
          : 'OTP code resent'
      )
      
    } catch (error) {
      console.error('Error resending OTP:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : (locale === 'fr' ? 'Erreur lors du renvoi' : 'Error resending code')
      )
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {locale === 'fr' ? 'Vérification réussie' : 'Verification Successful'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? 'Votre email a été vérifié avec succès.'
                : 'Your email has been verified successfully.'
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
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {locale === 'fr' ? 'Vérification OTP' : 'OTP Verification'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {locale === 'fr' 
              ? `Entrez le code à 6 chiffres envoyé à ${email}`
              : `Enter the 6-digit code sent to ${email}`
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Code OTP' : 'OTP Code'}
              </label>
              <div className="mt-1">
                <input
                  {...register('otp')}
                  type="text"
                  maxLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setValue('otp', value)
                  }}
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {locale === 'fr' ? 'Code valide pendant' : 'Code valid for'} {' '}
                <span className="font-medium text-primary-600">
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !otpValue || otpValue.length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {locale === 'fr' ? 'Vérification...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    {locale === 'fr' ? 'Vérifier' : 'Verify'}
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
              <button
                onClick={handleResendOtp}
                disabled={!canResend || isResending}
                className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  locale === 'fr' ? 'Renvoi...' : 'Resending...'
                ) : (
                  locale === 'fr' ? 'Renvoyer le code' : 'Resend code'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}