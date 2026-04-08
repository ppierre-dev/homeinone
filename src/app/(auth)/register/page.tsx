'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const json = (await response.json()) as
      | { data: { userId: string } }
      | { error: { code: string; message: string } }

    if (!response.ok || 'error' in json) {
      setLoading(false)
      setError('error' in json ? json.error.message : 'Une erreur est survenue.')
      return
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Compte créé mais connexion automatique échouée. Veuillez vous connecter.')
      router.push('/login')
      return
    }

    router.push('/create-household')
  }

  return (
    <div className="bg-white dark:bg-foreground/5 rounded-[14px] shadow-card p-8">
      <h2 className="font-display text-2xl text-foreground mb-6">Créer un compte</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground/80">
            Votre nom
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[10px] border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Jean Dupont"
          />
        </div>

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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[10px] border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Création du compte...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
