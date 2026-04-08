import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-foreground/5 rounded-[14px] shadow-card p-8 text-center">
        <h1 className="font-display text-3xl text-primary mb-2">HomeInOne</h1>
        <p className="text-lg text-foreground mb-1">
          Bienvenue, {session.user.name ?? session.user.email}
        </p>
        {session.user.householdId ? (
          <p className="text-sm text-foreground/60 mb-8">Votre foyer est configuré.</p>
        ) : (
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-8">
            Vous n&apos;avez pas encore de foyer.{' '}
            <a href="/create-household" className="underline">
              Créer un foyer
            </a>
          </p>
        )}

        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}
        >
          <button
            type="submit"
            className="rounded-[10px] border border-foreground/20 text-foreground/70 font-medium py-2.5 px-6 hover:bg-foreground/5 transition-colors"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  )
}
