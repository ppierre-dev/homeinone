import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      householdId?: string | null
      role?: string | null
    }
  }
}
