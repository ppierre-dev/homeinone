import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
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

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).name !== 'string'
  ) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Le champ name est requis' } },
      { status: 400 }
    )
  }

  const { name } = body as { name: string }
  const trimmedName = name.trim()

  if (!trimmedName) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Le nom du foyer est requis' } },
      { status: 400 }
    )
  }

  const household = await prisma.household.create({
    data: {
      name: trimmedName,
      members: {
        create: {
          userId: session.user.id,
          role: 'OWNER',
        },
      },
    },
  })

  return NextResponse.json({ data: { householdId: household.id } }, { status: 201 })
}
