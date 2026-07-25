'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveSession } from '@/lib/auth'
import { redirectAfterLogin } from '@/lib/redirects'
import AuthShell from '@/components/site/AuthShell'

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (!agree) {
      setError('Please accept the terms and conditions.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(
          data.message ||
            (data.errors && Object.values(data.errors).flat()[0]) ||
            'Something went wrong.'
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
  const req = <span className="text-red-500"> *</span>

  return (
    <AuthShell>
      <h1 className="text-[32px] font-bold leading-tight text-black">
        Get Started Now
      </h1>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name{req}
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name{req}
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address{req}
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
            Password{req}
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#333]">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-[18px] w-[18px] accent-[#d97a3a]"
          />
          I agree to the terms and conditions
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full rounded-full bg-[#d97a3a] font-[family-name:var(--font-inter)] text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f] disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? 'Creating account…' : 'Register'}
        </button>

        <p className="text-center text-[14px] text-black">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-[#6155f5] underline underline-offset-2 hover:opacity-80"
          >
            Log in
          </a>
        </p>
      </form>
    </AuthShell>
  )
}
