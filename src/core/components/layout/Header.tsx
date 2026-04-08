'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/core/components/layout/ThemeToggle'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/calendar': 'Agenda',
  '/notes': 'Notes & Listes',
  '/maintenance': 'Entretien logement',
  '/vehicles': 'Véhicules',
  '/inventory': 'Inventaire',
}

function getPageTitle(pathname: string): string {
  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return title
    }
  }
  return 'HomeInOne'
}

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const title = getPageTitle(pathname)

  const userInitial = (
    session?.user?.name ?? session?.user?.email ?? '?'
  )[0].toUpperCase()

  // Ferme le menu au clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-card border-b border-card-border flex-shrink-0">
      {/* Titre de la page */}
      <h1 className="font-display text-lg text-foreground">{title}</h1>

      {/* Actions header : toggle thème + menu utilisateur */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Avatar + menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold hover:bg-primary/30 transition-colors"
            aria-label="Menu utilisateur"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            {userInitial}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-card border border-card-border rounded-[14px] shadow-card py-1 z-50">
              {/* Infos utilisateur */}
              <div className="px-4 py-2.5 border-b border-card-border">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name ?? 'Utilisateur'}
                </p>
                <p className="text-xs text-foreground-muted truncate">{session?.user?.email}</p>
              </div>

              {/* Actions */}
              <div className="py-1">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-foreground-muted hover:bg-card-border/40 hover:text-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Profil
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-foreground-muted hover:bg-card-border/40 hover:text-foreground transition-colors"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
