import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const modules = [
  { href: '/calendar', label: 'Agenda', icon: '📅', color: 'bg-module-agenda/10 text-module-agenda border-module-agenda/20' },
  { href: '/notes', label: 'Notes & Listes', icon: '📝', color: 'bg-module-notes/10 text-module-notes border-module-notes/20' },
  { href: '/maintenance', label: 'Entretien logement', icon: '🔧', color: 'bg-module-logement/10 text-module-logement border-module-logement/20' },
  { href: '/vehicles', label: 'Véhicules', icon: '🚗', color: 'bg-module-vehicules/10 text-module-vehicules border-module-vehicules/20' },
  { href: '/inventory', label: 'Inventaire', icon: '📦', color: 'bg-module-inventaire/10 text-module-inventaire border-module-inventaire/20' },
] as const

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const membership = await prisma.householdMember.findFirst({
    where: { userId: session.user.id },
    include: { household: true },
    orderBy: { joinedAt: 'asc' },
  })

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Message de bienvenue */}
      <div className="mb-6">
        <h2 className="font-display text-2xl text-foreground mb-1">
          Bonjour, {session.user.name ?? 'vous'} 👋
        </h2>
        {!membership && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-[10px]">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Vous n&apos;avez pas encore de foyer.{' '}
              <Link href="/create-household" className="underline font-medium">
                Créer un foyer
              </Link>
            </p>
          </div>
        )}
        {membership && (
          <p className="text-sm text-foreground-muted">Foyer : {membership.household.name}</p>
        )}
      </div>

      {/* Grille des modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className={[
              'flex flex-col items-center justify-center gap-2 p-4 rounded-[14px] border font-medium text-sm transition-opacity hover:opacity-80',
              module.color,
            ].join(' ')}
          >
            <span className="text-3xl leading-none">{module.icon}</span>
            <span className="text-center leading-tight">{module.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
