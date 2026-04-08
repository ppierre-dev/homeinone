'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email ou mot de passe incorrect.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="bg-card border border-card-border rounded-[14px] shadow-card p-8">
      <h2 className="font-display text-2xl text-foreground mb-6">Connexion</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground/80">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[10px] border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="vous@exemple.fr"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground/80">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[10px] border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
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
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
