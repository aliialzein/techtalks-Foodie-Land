'use client'

import {useState, useEffect} from 'react'
import {ChefHat} from 'lucide-react'

interface PageLoaderProps{
    minDuration?:number
}

export default function PageLoader({minDuration=300}:PageLoaderProps) {
    const[visible,setVisible] = useState(true)
    const [fading, setFading] = useState(false)
    // const [theme,setTheme] = useState<'light' | 'dark'| null>(null)

    const[theme,setTheme] = useState<'light'|'dark'>(()=>{
    if (typeof window === 'undefined') return 'dark'
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'dark'    
    })

// useEffect(() => {
//     const saved = localStorage.getItem('foodieland-theme') as 'light' | 'dark' | null
//     if (saved) {
//       setTheme(saved)
//       return
//     }
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//     setTheme(prefersDark ? 'dark' : 'light')

//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
//     const handler = (e: MediaQueryListEvent) => {
//       if (!localStorage.getItem('foodieland-theme')) {
//         setTheme(e.matches ? 'dark' : 'light')
//       }
//     }
//     mediaQuery.addEventListener('change', handler)
//     return () => mediaQuery.removeEventListener('change', handler)
//   }, [])

    

    useEffect(()=>{
        const start = Date.now()

        const handleLoad =()=>{
            const passedTime = Date.now() - start
            const remainingTime = Math.max(0,minDuration - passedTime)
        

            setTimeout(()=>{
                setFading(true)
                setTimeout(()=>setVisible(false),400)
            },remainingTime)
        }
        if (document.readyState === 'complete') {
            handleLoad()
        } else {
            window.addEventListener('load', handleLoad)
            return () => window.removeEventListener('load', handleLoad)
    }
    },[minDuration])

    if (!visible) return null
    const dark = theme ==='dark'

    return (
        <div
        className={`fixed inset-0 z-9999 flex items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${
        dark
            ? 'bg-linear-to-br from-[#0f0f0f] via-[#1a0a00] to-[#0f0f0f]'
            : 'bg-linear-to-br from-[#fff7f0] via-[#ffe8d6] to-[#fff3eb]'
        }`}
        >
        <div className="flex flex-col items-center gap-7">

        <div className="relative w-18 h-18">
            <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-orange-600 animate-spin" />

            <div className="absolute inset-0 flex items-center justify-center">
            <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center animate-pulse ${
                dark
                    ? 'bg-orange-600/10 border border-orange-500/25'
                    : 'bg-orange-600/5 border border-orange-500/15'
                }`}
            >
                <ChefHat className="w-5 h-5 text-orange-600" />
            </div>
        </div>
      </div>

      <span
        className={`text-lg font-semibold tracking-tight ${
          dark ? 'text-white/90' : 'text-gray-900'
        }`}
      >
        Foodie<span className="text-orange-600">Land</span>
      </span>

      <div className="flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce" />
        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce [animation-delay:150ms]" />
        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
)
}
