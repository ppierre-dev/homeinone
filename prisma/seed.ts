/**
 * Seed initial — HomeInOne Sprint 0
 *
 * Crée un utilisateur de démo et un foyer de démo pour faciliter le développement.
 * Les modèles Category et MaintenanceTemplate seront seedés dans les sprints suivants
 * une fois les modules Inventaire et Entretien développés.
 *
 * Idempotent : peut être relancé sans créer de doublons (upsert).
 */

import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('Seeding database...')

    // ── Utilisateur démo ─────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('demo1234', 12)

    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@homeinone.app' },
      update: {},
      create: {
        email: 'demo@homeinone.app',
        name: 'Demo User',
        passwordHash,
        locale: 'fr',
        theme: 'system',
      },
    })

    console.log(`User upserted: ${demoUser.email} (id: ${demoUser.id})`)

    // ── Foyer démo ───────────────────────────────────────────────────────────
    // On cherche un foyer dont l'utilisateur démo est OWNER
    const existingMembership = await prisma.householdMember.findFirst({
      where: {
        userId: demoUser.id,
        role: 'OWNER',
      },
      include: { household: true },
    })

    if (!existingMembership) {
      const demoHousehold = await prisma.household.create({
        data: {
          name: 'Foyer Démo',
          members: {
            create: {
              userId: demoUser.id,
              role: 'OWNER',
            },
          },
        },
      })
      console.log(`Household created: ${demoHousehold.name} (id: ${demoHousehold.id})`)
    } else {
      console.log(
        `Household already exists: ${existingMembership.household.name} (id: ${existingMembership.householdId})`,
      )
    }

    console.log('Seeding complete.')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error: unknown) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
