import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/core/components/layout/Sidebar'
import { BottomNav } from '@/core/components/layout/BottomNav'
import { Header } from '@/core/components/layout/Header'

interface ShellProps {
  children: React.ReactNode
}

export async function Shell({ children }: ShellProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — desktop uniquement (hidden sur mobile) */}
      <Sidebar />

      {/* Zone principale */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>

        {/* Bottom nav — mobile uniquement (hidden sur desktop) */}
        <BottomNav />
      </div>
    </div>
  )
}
