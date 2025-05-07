'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light')
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  if (!mounted) {
    return (
      <button className="p-2 rounded-full">
        <SunIcon className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <SunIcon
          className={`absolute w-5 h-5 transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-180 scale-50'
          }`}
        />
        <MoonIcon
          className={`absolute w-5 h-5 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-180 scale-50'
          }`}
        />
      </div>
    </button>
  )
}