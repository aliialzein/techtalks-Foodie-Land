'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GoogleButton from '@/components/auth/GoogleButton'
import { saveSession } from '@/lib/auth'
import { redirectAfterLogin } from '@/lib/redirects'
import AuthShell from '@/components/site/AuthShell'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(
          data.message ||
            (data.errors && Object.values(data.errors).flat()[0]) ||
            'Invalid email or password.'
        )
        return
      }
      saveSession(data)
      redirectAfterLogin(router, data.user)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'h-12 w-full rounded-full border border-[#d9d9d9] bg-white px-5 text-[15px] text-[#242424] outline-none transition-colors placeholder:text-[#bdbdbd] focus:border-[#d97a3a] focus:ring-[3px] focus:ring-[#d97a3a]/15'
  const labelClass = 'mb-1.5 block text-[14px] font-bold text-black'

  return (
    <AuthShell>
      <h1 className="text-[32px] font-bold leading-tight text-black">
        Welcome Back!
      </h1>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <div className="mt-1.5 text-right">
            <a
              href="/forgotpassword"
              className="text-[12px] text-[#6155f5] underline underline-offset-2 hover:opacity-80"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#333]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-[18px] w-[18px] accent-[#d97a3a]"
          />
          Remember Me
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-[#d97a3a] font-[family-name:var(--font-inter)] text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f] disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>

        <p className="text-center text-[14px] text-black">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="text-[#6155f5] underline underline-offset-2 hover:opacity-80"
          >
            Sign up
          </a>
        </p>

        <div className="my-1 flex items-center gap-4">
          <div className="h-0.5 flex-1 bg-[#666]/25" />
          <span className="text-[16px] text-[#666]">OR</span>
          <div className="h-0.5 flex-1 bg-[#666]/25" />
        </div>

        <GoogleButton onError={setError} />
      </form>
    </AuthShell>
  )
}
