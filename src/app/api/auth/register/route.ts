import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

export async function POST(request: NextRequest) {
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
    typeof (body as Record<string, unknown>).email !== 'string' ||
    typeof (body as Record<string, unknown>).password !== 'string' ||
    typeof (body as Record<string, unknown>).name !== 'string'
  ) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Les champs email, password et name sont requis' } },
      { status: 400 }
    )
  }

  const { email, password, name } = body as { email: string; password: string; name: string }

  const trimmedEmail = email.trim().toLowerCase()
  const trimmedName = name.trim()

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Adresse email invalide' } },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Le mot de passe doit contenir au moins 8 caractères' } },
      { status: 400 }
    )
  }

  if (!trimmedName) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Le nom est requis' } },
      { status: 400 }
    )
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  })

  if (existingUser) {
    return NextResponse.json(
      { error: { code: 'EMAIL_ALREADY_EXISTS', message: 'Un compte existe déjà avec cette adresse email' } },
      { status: 409 }
    )
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email: trimmedEmail,
      name: trimmedName,
      passwordHash,
    },
  })

  return NextResponse.json({ data: { userId: user.id } }, { status: 201 })
}
