import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import {
  EventQuerySchema,
  CreateEventSchema,
} from '@/modules/calendar/services/calendar.validation'

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

// GET /api/calendar/events
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

  const searchParams = request.nextUrl.searchParams
  const rawQuery = {
    start: searchParams.get('start') ?? undefined,
    end: searchParams.get('end') ?? undefined,
    memberId: searchParams.get('memberId') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    perPage: searchParams.get('perPage') ?? undefined,
  }

  const parsed = EventQuerySchema.safeParse(rawQuery)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Paramètres de requête invalides',
        },
      },
      { status: 400 }
    )
  }

  const { start, end, memberId, categoryId, page, perPage } = parsed.data

  const where = {
    householdId,
    ...(start || end
      ? {
          startDate: {
            ...(start ? { gte: new Date(start) } : {}),
            ...(end ? { lte: new Date(end) } : {}),
          },
        }
      : {}),
    ...(memberId
      ? {
          assignments: {
            some: { userId: memberId },
          },
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
  }

  const [total, events] = await prisma.$transaction([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      include: eventInclude,
      orderBy: { startDate: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ])

  return NextResponse.json({
    data: events,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  })
}

// POST /api/calendar/events
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const userId = token?.sub
  const householdId = token?.householdId as string | null

  if (!userId || !householdId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_JSON', message: 'Corps de requête invalide' } },
      { status: 400 }
    )
  }

  const parsed = CreateEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Données invalides',
        },
      },
      { status: 400 }
    )
  }

  const { title, description, startDate, endDate, isAllDay, location, rrule, categoryId, assigneeIds, reminders } =
    parsed.data

  // Vérifier que tous les assigneeIds appartiennent au household
  if (assigneeIds.length > 0) {
    const members = await prisma.householdMember.findMany({
      where: { householdId, userId: { in: assigneeIds } },
      select: { userId: true },
    })
    if (members.length !== assigneeIds.length) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ASSIGNEES',
            message: "Certains membres assignés n'appartiennent pas au foyer",
          },
        },
        { status: 400 }
      )
    }
  }

  const event = await prisma.$transaction(async (tx) => {
    const created = await tx.event.create({
      data: {
        householdId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isAllDay,
        location,
        rrule,
        categoryId,
        createdById: userId,
        assignments: {
          create: assigneeIds.map((assigneeId) => ({ userId: assigneeId })),
        },
        reminders: {
          create: reminders.map((r) => ({
            userId,
            minutesBefore: r.minutesBefore,
          })),
        },
      },
      include: eventInclude,
    })
    return created
  })

  return NextResponse.json({ data: event }, { status: 201 })
}
