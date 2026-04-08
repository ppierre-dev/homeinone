import { auth, signOut } from '@/lib/auth'
import { SidebarNav } from '@/core/components/layout/SidebarNav'

export async function Sidebar() {
  const session = await auth()

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-card border-r border-card-border flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-card-border flex-shrink-0">
        <span className="text-2xl leading-none">🏠</span>
        <span className="font-display text-lg text-primary">HomeInOne</span>
      </div>

      {/* Navigation (Client Component pour usePathname) */}
      <SidebarNav />

      {/* Footer : user info + logout */}
      <div className="px-3 py-4 border-t border-card-border flex-shrink-0">
        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
              {(session.user.name ?? session.user.email ?? '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.name ?? 'Utilisateur'}
              </p>
              <p className="text-xs text-foreground-muted truncate">{session.user.email}</p>
            </div>
          </div>
        )}

        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-foreground-muted hover:bg-card-border/40 hover:text-foreground transition-colors"
          >
            <span className="text-lg leading-none">🚪</span>
            <span>Se déconnecter</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
