'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type OtpInput = z.infer<typeof otpSchema>

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const otpInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
  })

  const otp = watch('otp')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (!emailParam) {
      toast.error(
        locale === 'fr' 
          ? 'Email manquant'
          : 'Missing email'
      )
      router.push('/auth/login')
      return
    }
    setEmail(emailParam)
  }, [searchParams, router, locale])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  useEffect(() => {
    if (otp && otp.length === 6) {
      handleSubmit(onSubmit)()
    }
  }, [otp])

  const onSubmit = async (data: OtpInput) => {
    if (!email) return
    
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

      setIsVerified(true)
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
          : (locale === 'fr' ? 'Code OTP invalide' : 'Invalid OTP')
      )
      setValue('otp', '')
      if (otpInputRef.current) {
        otpInputRef.current.focus()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async () => {
    if (!email) return
    
    setIsLoading(true)
    
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
          ? 'Nouveau code envoyé'
          : 'New code sent'
      )
      
    } catch (error) {
      console.error('Error resending OTP:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : (locale === 'fr' ? 'Erreur lors de l\'envoi' : 'Error sending code')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'fr' ? 'Email vérifié' : 'Email verified'}
            </h2>
            <p className="text-gray-600 mt-2">
              {locale === 'fr' 
                ? 'Votre email a été vérifié avec succès.'
                : 'Your email has been verified successfully.'
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

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">
            {locale === 'fr' ? 'Chargement...' : 'Loading...'}
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
            {locale === 'fr' ? 'Vérification email' : 'Email verification'}
          </h2>
          <p className="text-gray-600 mt-2">
            {locale === 'fr' 
              ? `Entrez le code à 6 chiffres envoyé à ${email}`
              : `Enter the 6-digit code sent to ${email}`
            }
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Code de vérification' : 'Verification code'}
              </label>
              <div className="mt-1">
                <input
                  {...register('otp')}
                  ref={otpInputRef}
                  type="text"
                  maxLength={6}
                  className="input-field text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </div>
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {locale === 'fr' ? 'Code valide pendant' : 'Code valid for'} {formatTime(timeLeft)}
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !otp || otp.length !== 6}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {locale === 'fr' ? 'Vérification...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {locale === 'fr' ? 'Vérifier' : 'Verify'}
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={resendOtp}
                disabled={isLoading}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                {locale === 'fr' ? 'Renvoyer le code' : 'Resend code'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                {locale === 'fr' 
                  ? 'Vous pourrez renvoyer le code dans'
                  : 'You can resend the code in'
                } {formatTime(timeLeft)}
              </p>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              href="/auth/login" 
              className="text-gray-600 hover:text-gray-500 font-medium"
            >
              {locale === 'fr' ? 'Retour à la connexion' : 'Back to login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}