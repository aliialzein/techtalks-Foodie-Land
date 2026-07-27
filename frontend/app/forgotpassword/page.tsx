'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthShell from '@/components/site/AuthShell'

type Step = 'email' | 'otp' | 'password' | 'success'

const RESEND_COOLDOWN = 60

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>('email')

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN)

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function extractMessage(data: any, fallback: string) {
    return (
      data?.message ||
      (data?.errors &&
        (Array.isArray(data.errors)
          ? data.errors[0]?.message
          : Object.values(data.errors).flat()[0])) ||
      fallback
    )
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()

    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setStep('otp')
          startCooldown()
          return
        }

        setError(extractMessage(data, 'Something went wrong.'))
        return
      }

      setStep('otp')
      startCooldown()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()

    setError('')

    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(extractMessage(data, 'Invalid or expired code.'))
        return
      }

      setResetToken(data.resetToken)
      setStep('password')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()

    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(extractMessage(data, 'Could not reset password.'))
        return
      }

      setStep('success')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (cooldown > 0) return

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok && res.status !== 429) {
        setError(extractMessage(data, 'Could not resend code.'))
        return
      }

      startCooldown()
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'h-12 w-full rounded-full border border-[#d9d9d9] bg-white px-5 text-[15px] text-[#242424] outline-none transition-colors placeholder:text-[#bdbdbd] focus:border-[#d97a3a] focus:ring-[3px] focus:ring-[#d97a3a]/15'

  const labelClass =
    'mb-1.5 block text-[14px] font-bold text-black'

  const buttonClass =
    'h-12 w-full rounded-full bg-[#d97a3a] font-[family-name:var(--font-inter)] text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f] disabled:opacity-60 disabled:hover:translate-y-0'

  return (
    <AuthShell>
      <h1 className="text-[32px] font-bold leading-tight text-black">
        {step === 'email' && 'Forgot Password'}
        {step === 'otp' && 'Check Your Email'}
        {step === 'password' && 'Create New Password'}
        {step === 'success' && 'Password Updated'}
      </h1>

      {step === 'email' && (
        <p className="mt-2 text-[14px] text-[#666]">
          Enter your email address and we'll send you a verification code.
        </p>
      )}

      {step === 'otp' && (
        <p className="mt-2 text-[14px] text-[#666]">
          Enter the 6-digit code sent to <strong>{email}</strong>.
        </p>
      )}

      {step === 'password' && (
        <p className="mt-2 text-[14px] text-[#666]">
          Choose a strong new password.
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="mt-6 flex flex-col gap-4">
          <div>
            <label className={labelClass}>Email address</label>

            <input
              className={inputClass}
              type="email"
              placeholder="Enter your email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={buttonClass}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>

          <p className="text-center text-[14px]">
            <a
              href="/login"
              className="text-[#6155f5] underline underline-offset-2 hover:opacity-80"
            >
              Back to login
            </a>
          </p>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="mt-6 flex flex-col gap-4">
          <div>
            <label className={labelClass}>Verification code</label>

            <input
              className={`${inputClass} text-center tracking-[0.45em]`}
              autoFocus
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={buttonClass}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <p className="text-center text-[14px]">
            {cooldown > 0 ? (
              <span className="text-[#999]">
                Resend code in {cooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#6155f5] underline underline-offset-2"
              >
                Resend code
              </button>
            )}
          </p>

          <button
            type="button"
            onClick={() => {
              setOtp('')
              setError('')
              setStep('email')
            }}
            className="text-[14px] text-[#6155f5] underline underline-offset-2"
          >
            Use another email
          </button>
        </form>
      )}

      {step === 'password' && (
        <form
          onSubmit={handleResetPassword}
          className="mt-6 flex flex-col gap-4"
        >
          <div>
            <label className={labelClass}>New password</label>

            <input
              className={inputClass}
              type="password"
              placeholder="Minimum 8 characters"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Confirm password</label>

            <input
              className={inputClass}
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={buttonClass}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {step === 'success' && (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-center text-[#666]">
            Your password has been reset successfully.
          </p>

          <button
            className={buttonClass}
            onClick={() => router.push('/login')}
          >
            Back to Login
          </button>
        </div>
      )}
    </AuthShell>
  )
}