'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const THEMES = ['system', 'light', 'dark'] as const
type Theme = (typeof THEMES)[number]

const THEME_ICONS: Record<Theme, string> = {
  system: '💻',
  light: '☀️',
  dark: '🌙',
}

const THEME_LABELS: Record<Theme, string> = {
  system: 'Thème système',
  light: 'Thème clair',
  dark: 'Thème sombre',
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Évite les erreurs d'hydratation : on ne rend le contenu réel qu'après montage
  // (pattern recommandé par next-themes pour la détection côté client)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  function cycleTheme() {
    const current = (theme ?? 'system') as Theme
    const currentIndex = THEMES.indexOf(current)
    const nextIndex = (currentIndex + 1) % THEMES.length
    setTheme(THEMES[nextIndex])
  }

  const currentTheme = (theme ?? 'system') as Theme

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="w-9 h-9 rounded-btn flex items-center justify-center text-lg hover:bg-card-border/40 transition-colors"
      aria-label={mounted ? THEME_LABELS[currentTheme] : 'Changer le thème'}
      title={mounted ? THEME_LABELS[currentTheme] : 'Changer le thème'}
      suppressHydrationWarning
    >
      <span suppressHydrationWarning>
        {mounted ? THEME_ICONS[currentTheme] : '💻'}
      </span>
    </button>
  )
}
