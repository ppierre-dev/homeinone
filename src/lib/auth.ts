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
      // On sign-in, persist extra fields from the authorize() return value
      if (user) {
        token.householdId = (user as { householdId?: string | null }).householdId ?? null
        token.role = (user as { role?: string | null }).role ?? null
      }
      // If householdId is missing (new user who just created their household),
      // fetch it from DB — token.sub is always set by NextAuth from user.id
      if (!token.householdId && token.sub) {
        const membership = await prisma.householdMember.findFirst({
          where: { userId: token.sub },
          orderBy: { joinedAt: 'asc' },
        })
        if (membership) {
          token.householdId = membership.householdId
          token.role = membership.role
        }
      }
      return token
    },
    async session({ session, token }) {
      let householdId = (token.householdId as string | null) ?? null
      let role = (token.role as string | null) ?? null

      // token.sub is the standard NextAuth JWT user identifier
      const userId = (token.id as string | null) ?? token.sub ?? null

      // If token has no householdId, fetch from DB — handles the case where
      // the household was created after the JWT was issued (register flow)
      if (!householdId && userId) {
        const membership = await prisma.householdMember.findFirst({
          where: { userId },
          orderBy: { joinedAt: 'asc' },
        })
        householdId = membership?.householdId ?? null
        role = membership?.role ?? null
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: userId ?? '',
          householdId,
          role,
        },
      }
    },
  },
  pages: {
    signIn: '/login',
  },
})
