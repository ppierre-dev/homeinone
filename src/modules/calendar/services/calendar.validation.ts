import { z } from 'zod'

export const CreateEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isAllDay: z.boolean().default(false),
  location: z.string().max(500).optional(),
  rrule: z.string().optional(),
  categoryId: z.string().optional(),
  assigneeIds: z.array(z.string()).default([]),
  reminders: z
    .array(
      z.object({
        minutesBefore: z.number().int().min(0),
      })
    )
    .default([]),
})

export const UpdateEventSchema = CreateEventSchema.partial()

export const EventQuerySchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  memberId: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(50),
})

export const RecurrenceScopeSchema = z
  .enum(['this', 'future', 'all'])
  .default('all')

export const SearchQuerySchema = z.object({
  q: z.string().min(2).max(200),
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type EventQueryInput = z.infer<typeof EventQuerySchema>
export type RecurrenceScope = z.infer<typeof RecurrenceScopeSchema>
