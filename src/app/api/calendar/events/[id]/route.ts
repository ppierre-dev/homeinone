import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import {
  UpdateEventSchema,
  RecurrenceScopeSchema,
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

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/calendar/events/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const userId = token?.sub
  const householdId = token?.householdId as string | null

  if (!userId || !householdId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } },
      { status: 401 }
    )
  }

  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: eventInclude,
  })

  if (!event) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Événement introuvable' } },
      { status: 404 }
    )
  }

  if (event.householdId !== householdId) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Accès interdit' } },
      { status: 403 }
    )
  }

  return NextResponse.json({ data: event })
}

// PUT /api/calendar/events/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const userId = token?.sub
  const householdId = token?.householdId as string | null

  if (!userId || !householdId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } },
      { status: 401 }
    )
  }

  const { id } = await params

  const existingEvent = await prisma.event.findUnique({
    where: { id },
  })

  if (!existingEvent) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Événement introuvable' } },
      { status: 404 }
    )
  }

  if (existingEvent.householdId !== householdId) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Accès interdit' } },
      { status: 403 }
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

  const parsed = UpdateEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Données invalides' } },
      { status: 400 }
    )
  }

  const rawScope = request.nextUrl.searchParams.get('scope') ?? undefined
  const parsedScope = RecurrenceScopeSchema.safeParse(rawScope)
  if (!parsedScope.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Scope invalide' } },
      { status: 400 }
    )
  }

  // Par défaut : 'this' si l'event est récurrent, 'all' sinon
  const isRecurring = Boolean(existingEvent.rrule)
  const scope = rawScope ? parsedScope.data : isRecurring ? 'this' : 'all'

  const { title, description, startDate, endDate, isAllDay, location, rrule, categoryId, assigneeIds, reminders } =
    parsed.data

  // Vérifier les assignees si fournis
  if (assigneeIds && assigneeIds.length > 0) {
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

  const updateData = {
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
    ...(endDate !== undefined ? { endDate: new Date(endDate) } : {}),
    ...(isAllDay !== undefined ? { isAllDay } : {}),
    ...(location !== undefined ? { location } : {}),
    ...(rrule !== undefined ? { rrule } : {}),
    ...(categoryId !== undefined ? { categoryId } : {}),
  }

  let resultEvent: typeof existingEvent

  if (scope === 'all') {
    // Modifier l'événement directement (+ recréer les assignments et reminders si fournis)
    resultEvent = await prisma.$transaction(async (tx) => {
      if (assigneeIds !== undefined) {
        await tx.eventAssignment.deleteMany({ where: { eventId: id } })
      }
      if (reminders !== undefined) {
        await tx.eventReminder.deleteMany({ where: { eventId: id } })
      }

      return tx.event.update({
        where: { id },
        data: {
          ...updateData,
          ...(assigneeIds !== undefined
            ? {
                assignments: {
                  create: assigneeIds.map((uid) => ({ userId: uid })),
                },
              }
            : {}),
          ...(reminders !== undefined
            ? {
                reminders: {
                  create: reminders.map((r) => ({
                    userId,
                    minutesBefore: r.minutesBefore,
                  })),
                },
              }
            : {}),
        },
        include: eventInclude,
      })
    })
  } else if (scope === 'this') {
    // Créer une occurrence d'exception pour cette date précise
    const exceptionStartDate = startDate ? new Date(startDate) : existingEvent.startDate
    const exceptionEndDate = endDate ? new Date(endDate) : existingEvent.endDate

    resultEvent = await prisma.$transaction(async (tx) => {
      return tx.event.create({
        data: {
          householdId,
          title: title ?? existingEvent.title,
          description: description !== undefined ? description : existingEvent.description,
          startDate: exceptionStartDate,
          endDate: exceptionEndDate,
          isAllDay: isAllDay !== undefined ? isAllDay : existingEvent.isAllDay,
          location: location !== undefined ? location : existingEvent.location,
          categoryId: categoryId !== undefined ? categoryId : existingEvent.categoryId,
          createdById: userId,
          recurringEventId: id,
          isException: true,
          assignments: {
            create: (assigneeIds ?? []).map((uid) => ({ userId: uid })),
          },
          reminders: {
            create: (reminders ?? []).map((r) => ({
              userId,
              minutesBefore: r.minutesBefore,
            })),
          },
        },
        include: eventInclude,
      })
    })
  } else {
    // scope === 'future' : scinder la série
    // Tronquer l'original avec UNTIL=date et créer une nouvelle série
    const futureStart = startDate ? new Date(startDate) : existingEvent.startDate

    // Formater la date UNTIL au format RFC 5545 : YYYYMMDDTHHMMSSZ
    const untilDate = new Date(futureStart)
    untilDate.setSeconds(untilDate.getSeconds() - 1)
    const until = untilDate
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')

    const originalRrule = existingEvent.rrule ?? ''
    const truncatedRrule = originalRrule.includes('UNTIL=')
      ? originalRrule.replace(/UNTIL=[^;]+/, `UNTIL=${until}`)
      : originalRrule
        ? `${originalRrule};UNTIL=${until}`
        : `UNTIL=${until}`

    resultEvent = await prisma.$transaction(async (tx) => {
      // Mettre à jour la série originale avec UNTIL
      await tx.event.update({
        where: { id },
        data: { rrule: truncatedRrule },
      })

      // Créer la nouvelle série à partir de la date future
      return tx.event.create({
        data: {
          householdId,
          title: title ?? existingEvent.title,
          description: description !== undefined ? description : existingEvent.description,
          startDate: futureStart,
          endDate: endDate ? new Date(endDate) : existingEvent.endDate,
          isAllDay: isAllDay !== undefined ? isAllDay : existingEvent.isAllDay,
          location: location !== undefined ? location : existingEvent.location,
          rrule: rrule ?? existingEvent.rrule,
          categoryId: categoryId !== undefined ? categoryId : existingEvent.categoryId,
          createdById: userId,
          assignments: {
            create: (assigneeIds ?? []).map((uid) => ({ userId: uid })),
          },
          reminders: {
            create: (reminders ?? []).map((r) => ({
              userId,
              minutesBefore: r.minutesBefore,
            })),
          },
        },
        include: eventInclude,
      })
    })
  }

  return NextResponse.json({ data: resultEvent })
}

// DELETE /api/calendar/events/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const userId = token?.sub
  const householdId = token?.householdId as string | null

  if (!userId || !householdId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } },
      { status: 401 }
    )
  }

  const { id } = await params

  const existingEvent = await prisma.event.findUnique({
    where: { id },
  })

  if (!existingEvent) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Événement introuvable' } },
      { status: 404 }
    )
  }

  if (existingEvent.householdId !== householdId) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Accès interdit' } },
      { status: 403 }
    )
  }

  const rawScope = request.nextUrl.searchParams.get('scope') ?? undefined
  const parsedScope = RecurrenceScopeSchema.safeParse(rawScope)
  if (!parsedScope.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Scope invalide' } },
      { status: 400 }
    )
  }

  const isRecurring = Boolean(existingEvent.rrule)
  const scope = rawScope ? parsedScope.data : isRecurring ? 'this' : 'all'

  if (scope === 'all') {
    // Supprimer l'événement et toutes ses exceptions (cascade via Prisma)
    await prisma.event.delete({ where: { id } })
  } else if (scope === 'this') {
    // Marquer comme exception supprimée : créer un event exception vide (isException=true)
    // pour signaler que cette occurrence est exclue
    const exDate = existingEvent.startDate
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')

    const originalRrule = existingEvent.rrule ?? ''
    const updatedRrule = originalRrule.includes('EXDATE=')
      ? originalRrule.replace(/EXDATE=([^;]*)/, `EXDATE=$1,${exDate}`)
      : originalRrule
        ? `${originalRrule};EXDATE=${exDate}`
        : `EXDATE=${exDate}`

    await prisma.event.update({
      where: { id },
      data: { rrule: updatedRrule },
    })
  } else {
    // scope === 'future' : tronquer la série à la date de l'occurrence
    const until = existingEvent.startDate
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')

    const originalRrule = existingEvent.rrule ?? ''
    const truncatedRrule = originalRrule.includes('UNTIL=')
      ? originalRrule.replace(/UNTIL=[^;]+/, `UNTIL=${until}`)
      : originalRrule
        ? `${originalRrule};UNTIL=${until}`
        : `UNTIL=${until}`

    // Supprimer toutes les exceptions futures
    await prisma.$transaction(async (tx) => {
      await tx.event.deleteMany({
        where: {
          recurringEventId: id,
          startDate: { gte: existingEvent.startDate },
        },
      })
      await tx.event.update({
        where: { id },
        data: { rrule: truncatedRrule },
      })
    })
  }

  return new NextResponse(null, { status: 204 })
}
