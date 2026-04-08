import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { SearchQuerySchema } from '@/modules/calendar/services/calendar.validation'

export const dynamic = 'force-dynamic'

const eventInclude = {
  category: true,
  assignments: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          color: true,
        },
      },
    },
  },
  reminders: true,
} as const

// GET /api/calendar/events/search?q=
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const userId = token?.sub
  const householdId = token?.householdId as string | null

  if (!userId || !householdId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } },
      { status: 401 }
    )
  }

  const rawQuery = {
    q: request.nextUrl.searchParams.get('q') ?? undefined,
  }

  const parsed = SearchQuerySchema.safeParse(rawQuery)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Le paramètre q est requis (2 caractères minimum)',
        },
      },
      { status: 400 }
    )
  }

  const { q } = parsed.data

  const events = await prisma.event.findMany({
    where: {
      householdId,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: eventInclude,
    orderBy: { startDate: 'asc' },
    take: 50,
  })

  return NextResponse.json({ data: events })
}
