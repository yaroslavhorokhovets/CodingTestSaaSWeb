'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  ArrowLeftIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
  
  const email = searchParams.get('email')
  const purpose = searchParams.get('purpose') || 'verification'

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

  // Timer for resend functionality
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
          purpose,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Invalid OTP')
      }

      setIsVerified(true)
      toast.success(
        locale === 'fr' 
          ? 'Code vérifié avec succès'
          : 'Code verified successfully'
      )
      
      // Redirect based on purpose
      setTimeout(() => {
        if (purpose === 'registration') {
          router.push('/auth/login')
        } else if (purpose === 'password-reset') {
          router.push(`/auth/reset-password?token=${searchParams.get('token')}`)
        } else {
          router.push('/dashboard')
        }
      }, 2000)
      
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : (locale === 'fr' ? 'Code invalide' : 'Invalid code')
      )
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
        body: JSON.stringify({
          email,
          purpose,
        }),
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
              {locale === 'fr' ? 'Vérifié avec succès' : 'Successfully verified'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'fr' 
                ? 'Votre code a été vérifié avec succès'
                : 'Your code has been verified successfully'
              }
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">
                {locale === 'fr' ? 'Redirection...' : 'Redirecting...'}
              </p>
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
          <ShieldCheckIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'fr' ? 'Vérification du code' : 'Code verification'}
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
                {locale === 'fr' ? 'Code de vérification' : 'Verification code'}
              </label>
              <div className="mt-1">
                <input
                  {...register('otp')}
                  type="text"
                  maxLength={6}
                  className="input-field text-center text-2xl tracking-widest"
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

            <div>
              <button
                type="submit"
                disabled={isLoading || !otpValue || otpValue.length !== 6}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {locale === 'fr' ? 'Vérification...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    {locale === 'fr' ? 'Vérifier le code' : 'Verify code'}
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={isLoading}
                  className="text-primary-600 hover:text-primary-500 text-sm"
                >
                  {locale === 'fr' ? 'Renvoyer le code' : 'Resend code'}
                </button>
              ) : (
                <p className="text-sm text-gray-600">
                  {locale === 'fr' ? 'Renvoyer dans' : 'Resend in'} {formatTime(timeLeft)}
                </p>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {locale === 'fr' ? 'Vous n\'avez pas reçu le code ?' : 'Didn\'t receive the code?'}{' '}
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={!canResend || isLoading}
                  className="text-primary-600 hover:text-primary-500"
                >
                  {locale === 'fr' ? 'Vérifiez votre email' : 'Check your email'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}