import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'

// Session TTL: 30 days
const SESSION_MAX_AGE = 30 * 24 * 60 * 60

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== 'string' ||
          typeof credentials?.password !== 'string'
        ) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            households: {
              orderBy: { joinedAt: 'asc' },
              take: 1,
            },
          },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await verifyPassword(credentials.password, user.passwordHash)
        if (!isValid) return null

        const membership = user.households[0] ?? null

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          image: user.avatarUrl ?? null,
          householdId: membership?.householdId ?? null,
          role: membership?.role ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, `user` is populated — persist extra fields into the token
      if (user) {
        token.id = user.id
        token.householdId = (user as { householdId?: string | null }).householdId ?? null
        token.role = (user as { role?: string | null }).role ?? null
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          householdId: (token.householdId as string | null) ?? null,
          role: (token.role as string | null) ?? null,
        },
      }
    },
  },
  pages: {
    signIn: '/login',
  },
})
