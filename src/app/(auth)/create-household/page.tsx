'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CreateHouseholdPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="bg-white dark:bg-foreground/5 rounded-[14px] shadow-card p-8 text-center">
        <p className="text-sm text-foreground/60">Chargement...</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const response = await fetch('/api/households', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    const json = (await response.json()) as
      | { data: { householdId: string } }
      | { error: { code: string; message: string } }

    setLoading(false)

    if (!response.ok || 'error' in json) {
      setError('error' in json ? json.error.message : 'Une erreur est survenue.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="bg-white dark:bg-foreground/5 rounded-[14px] shadow-card p-8">
      <h2 className="font-display text-2xl text-foreground mb-2">Créer votre foyer</h2>
      <p className="text-sm text-foreground/60 mb-6">
        Bienvenue {session?.user?.name ?? ''} ! Donnez un nom à votre foyer pour commencer.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="householdName" className="text-sm font-medium text-foreground/80">
            Nom du foyer
          </label>
          <input
            id="householdName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[10px] border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Famille Dupont"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-[10px] px-4 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[10px] bg-primary text-white font-medium py-2.5 px-4 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Création...' : 'Créer mon foyer'}
        </button>
      </form>
    </div>
  )
}
