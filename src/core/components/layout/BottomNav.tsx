'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Accueil', icon: '🏠' },
  { href: '/calendar', label: 'Agenda', icon: '📅' },
  { href: '/notes', label: 'Notes', icon: '📝' },
  { href: '/maintenance', label: 'Logement', icon: '🔧' },
  { href: '/vehicles', label: 'Véhicules', icon: '🚗' },
  { href: '/inventory', label: 'Inventaire', icon: '📦' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-foreground-muted hover:text-foreground',
            ].join(' ')}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
