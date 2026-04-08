'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠', color: null },
  { href: '/calendar', label: 'Agenda', icon: '📅', color: 'text-module-agenda' },
  { href: '/notes', label: 'Notes', icon: '📝', color: 'text-module-notes' },
  { href: '/maintenance', label: 'Logement', icon: '🔧', color: 'text-module-logement' },
  { href: '/vehicles', label: 'Véhicules', icon: '🚗', color: 'text-module-vehicules' },
  { href: '/inventory', label: 'Inventaire', icon: '📦', color: 'text-module-inventaire' },
] as const

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
              'flex items-center gap-3 px-3 py-2.5 rounded-[10px] font-medium text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-foreground-muted hover:bg-card-border/40 hover:text-foreground',
            ].join(' ')}
          >
            <span
              className={[
                'text-lg leading-none',
                !isActive && item.color ? item.color : '',
              ].join(' ')}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
