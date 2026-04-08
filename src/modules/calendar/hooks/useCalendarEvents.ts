import { useQuery } from '@tanstack/react-query'
import type { EventWithRelations } from '@/modules/calendar/types/calendar.types'

export type CalendarEventsResponse = {
  data: EventWithRelations[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export function useCalendarEvents(start: Date, end: Date) {
  return useQuery<CalendarEventsResponse>({
    queryKey: ['calendar-events', start.toISOString(), end.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
        perPage: '200',
      })
      const res = await fetch(`/api/calendar/events?${params}`)
      if (!res.ok) {
        throw new Error('Failed to fetch events')
      }
      return res.json() as Promise<CalendarEventsResponse>
    },
    enabled: start < end,
  })
}
