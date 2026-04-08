import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Adapter, AdapterSession, AdapterUser } from '@auth/core/adapters'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { verifyPassword } from '@/lib/password'

// Session TTL in seconds (30 days)
const SESSION_TTL = 30 * 24 * 60 * 60

function redisSessionKey(sessionToken: string): string {
  return `session:${sessionToken}`
}

function redisUserKey(userId: string): string {
  return `session-user:${userId}`
}

/**
 * Build an adapter that stores sessions in Redis and delegates
 * user/account management to the Prisma adapter.
 */
function buildAdapter(): Adapter {
  // Cast is required because @auth/prisma-adapter expects PrismaClient from @prisma/client
  // but our client is generated locally in src/generated/prisma — the API is identical
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prismaAdapter = PrismaAdapter(prisma as any)

  return {
    ...prismaAdapter,

    async createSession(session: {
      sessionToken: string
      userId: string
      expires: Date
    }): Promise<AdapterSession> {
      const ttl = Math.floor((session.expires.getTime() - Date.now()) / 1000)
      const payload = JSON.stringify({
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires.toISOString(),
      })
      await redis.set(redisSessionKey(session.sessionToken), payload, 'EX', ttl > 0 ? ttl : SESSION_TTL)
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      }
    },

    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const raw = await redis.get(redisSessionKey(sessionToken))
      if (!raw) return null

      const parsed = JSON.parse(raw) as {
        sessionToken: string
        userId: string
        expires: string
      }

      const expires = new Date(parsed.expires)
      if (expires < new Date()) {
        await redis.del(redisSessionKey(sessionToken))
        return null
      }

      // Fetch user from cache or Prisma
      let userRaw = await redis.get(redisUserKey(parsed.userId))
      let user: AdapterUser

      if (userRaw) {
        const cachedUser = JSON.parse(userRaw) as AdapterUser & { emailVerified: string | null }
        user = {
          ...cachedUser,
          emailVerified: cachedUser.emailVerified ? new Date(cachedUser.emailVerified) : null,
        }
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { id: parsed.userId },
        })
        if (!dbUser) {
          await redis.del(redisSessionKey(sessionToken))
          return null
        }
        user = {
          id: dbUser.id,
          email: dbUser.email,
          emailVerified: dbUser.emailVerified,
          name: dbUser.name ?? null,
          image: dbUser.avatarUrl ?? null,
        }
        // Cache user for the session TTL
        await redis.set(redisUserKey(parsed.userId), JSON.stringify(user), 'EX', SESSION_TTL)
      }

      return {
        session: {
          sessionToken: parsed.sessionToken,
          userId: parsed.userId,
          expires,
        },
        user,
      }
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ): Promise<AdapterSession | null | undefined> {
      const raw = await redis.get(redisSessionKey(session.sessionToken))
      if (!raw) return null

      const existing = JSON.parse(raw) as {
        sessionToken: string
        userId: string
        expires: string
      }

      const updated = {
        sessionToken: session.sessionToken,
        userId: session.userId ?? existing.userId,
        expires: session.expires?.toISOString() ?? existing.expires,
      }

      const expires = new Date(updated.expires)
      const ttl = Math.floor((expires.getTime() - Date.now()) / 1000)
      await redis.set(
        redisSessionKey(session.sessionToken),
        JSON.stringify(updated),
        'EX',
        ttl > 0 ? ttl : SESSION_TTL
      )

      return {
        sessionToken: updated.sessionToken,
        userId: updated.userId,
        expires,
      }
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await redis.del(redisSessionKey(sessionToken))
    },
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: buildAdapter(),
  session: {
    strategy: 'database',
    maxAge: SESSION_TTL,
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
        })

        if (!user || !user.passwordHash) return null

        const isValid = await verifyPassword(credentials.password, user.passwordHash)
        if (!isValid) return null

        // Fetch first household membership to populate session
        const membership = await prisma.householdMember.findFirst({
          where: { userId: user.id },
          orderBy: { joinedAt: 'asc' },
        })

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
    async session({ session, user }) {
      // Enrich session with householdId and role from DB
      const membership = await prisma.householdMember.findFirst({
        where: { userId: user.id },
        orderBy: { joinedAt: 'asc' },
      })

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          householdId: membership?.householdId ?? null,
          role: membership?.role ?? null,
        },
      }
    },
  },
  pages: {
    signIn: '/login',
  },
})
