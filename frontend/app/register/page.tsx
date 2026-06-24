'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ChefHat } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('foodieland-theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      return
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('foodieland-theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Something went wrong.')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const dark = theme === 'dark'

  const inputClass = `
    w-full px-3.5 py-2.5 rounded-xl text-sm outline-none
    transition-all duration-200
    focus:ring-[3px] focus:ring-orange-500/20 focus:border-orange-500
    ${dark
      ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20'
      : 'bg-white/70 border border-black/10 text-gray-900 placeholder:text-black/25'
    }
  `

  const labelClass = `
    block text-[0.7rem] font-medium tracking-widest uppercase mb-1.5
    ${dark ? 'text-white/35' : 'text-black/40'}
  `

  return (
    <div className={`
      min-h-screen flex items-center justify-center px-4
      relative overflow-hidden transition-all duration-500
      ${dark
        ? 'bg-linear-to-br from-[#0f0f0f] via-[#1a0a00] to-[#0f0f0f]'
        : 'bg-linear-to-br from-[#fff7f0] via-[#ffe8d6] to-[#fff3eb]'
      }
    `}>

      <div className={`
        absolute -top-24 -right-20 w-96 h-96 rounded-full
        blur-[80px] pointer-events-none
        ${dark ? 'bg-orange-600/20' : 'bg-orange-500/15'}
      `}/>
      <div className={`
        absolute -bottom-20 -left-16 w-72 h-72 rounded-full
        blur-[80px] pointer-events-none
        ${dark ? 'bg-orange-400/[0.14]' : 'bg-orange-300/12'}
      `}/>
      <div className={`
        absolute top-[40%] left-[10%] w-48 h-48 rounded-full
        blur-[80px] pointer-events-none
        ${dark ? 'bg-orange-600/8' : 'bg-orange-500/[0.07]'}
      `}/>

      <div className={`
        relative z-10 w-full max-w-md rounded-3xl p-10
        backdrop-blur-2xl
        ${dark
          ? 'bg-[rgba(20,10,5,0.55)] border border-white/8 shadow-[0_8px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-white/50 border border-white/75 shadow-[0_8px_48px_rgba(180,80,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]'
        }
      `}>

        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-linear-to-br from-orange-600 to-orange-400 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(234,88,12,0.4)]">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className={`text-[1.05rem] font-semibold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            Foodie<span className="text-orange-600">Land</span>
          </span>
        </div>

        <h1 className={`text-2xl font-semibold tracking-tight mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
          Create your account
        </h1>
        <p className={`text-sm mb-7 ${dark ? 'text-white/40' : 'text-black/45'}`}>
          Sign up to get started
        </p>

        {error && (
          <div className={`
            text-sm rounded-xl px-3.5 py-2.5 mb-5 border
            ${dark
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-red-50 border-red-200 text-red-600'
            }
          `}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={labelClass}>First name</label>
              <input
                id="firstName"
                type="text"
                placeholder="Ali"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Alzein"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-14`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-14`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className={`flex items-center gap-2 cursor-pointer ${dark ? 'text-white/40' : 'text-black/45'}`}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-orange-600 w-3.5 h-3.5"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl text-sm font-semibold text-white
              bg-linear-to-r from-orange-600 to-orange-400
              shadow-[0_4px_20px_rgba(234,88,12,0.35)]
              hover:shadow-[0_6px_24px_rgba(234,88,12,0.45)]
              hover:-translate-y-px transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
            "
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className={`text-center text-[0.82rem] mt-5 ${dark ? 'text-white/35' : 'text-black/40'}`}>
          Already have an account?{' '}
          <a href="/login" className="text-orange-600 hover:underline font-medium">
            Sign in
          </a>
        </p>

      </div>
    </div>
  )
}