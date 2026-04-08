import type { EventModel } from '@/generated/prisma/models/Event'
import type { EventAssignmentModel } from '@/generated/prisma/models/EventAssignment'
import type { EventReminderModel } from '@/generated/prisma/models/EventReminder'
import type { CategoryModel } from '@/generated/prisma/models/Category'
import type { UserModel } from '@/generated/prisma/models/User'

export type EventWithRelations = EventModel & {
  category: CategoryModel | null
  assignments: (EventAssignmentModel & {
    user: Pick<UserModel, 'id' | 'name' | 'avatarUrl' | 'color'>
  })[]
  reminders: EventReminderModel[]
}

export type EventListMeta = {
  total: number
  page: number
  perPage: number
  totalPages: number
}

export type EventListResponse = {
  data: EventWithRelations[]
  meta: EventListMeta
}

export type EventResponse = {
  data: EventWithRelations
}

export type ApiError = {
  error: {
    code: string
    message: string
  }
}
