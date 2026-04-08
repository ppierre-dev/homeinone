'use client'

import { useCallback, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { DatesSetArg, EventClickArg } from '@fullcalendar/core'
import frLocale from '@fullcalendar/core/locales/fr'
import { useTranslations } from 'next-intl'
import { useCalendarEvents } from '@/modules/calendar/hooks/useCalendarEvents'
import type { EventWithRelations } from '@/modules/calendar/types/calendar.types'
import { EventDetailPanel } from '@/modules/calendar/components/EventDetailPanel'

const PRIMARY_COLOR = '#4a7c59'

type CalendarRange = {
  start: Date
  end: Date
}

function buildFullCalendarEvents(events: EventWithRelations[]) {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate ?? undefined,
    allDay: event.isAllDay,
    backgroundColor: event.category?.color ?? PRIMARY_COLOR,
    borderColor: event.category?.color ?? PRIMARY_COLOR,
    extendedProps: { event },
  }))
}

export function CalendarView() {
  const t = useTranslations('calendar')
  const calendarRef = useRef<FullCalendar>(null)

  const now = new Date()
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [range, setRange] = useState<CalendarRange>({
    start: defaultStart,
    end: defaultEnd,
  })
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithRelations | null>(null)

  const { data, isLoading, isError } = useCalendarEvents(range.start, range.end)

  const fcEvents = data?.data ? buildFullCalendarEvents(data.data) : []

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    setRange({ start: arg.start, end: arg.end })
  }, [])

  const handleEventClick = useCallback((arg: EventClickArg) => {
    const event = arg.event.extendedProps.event as EventWithRelations
    setSelectedEvent(event)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedEvent(null)
  }, [])

  return (
    <div className="relative flex flex-col gap-4">
      {/* Loading / error indicators */}
      {isLoading && (
        <p className="text-sm text-foreground-muted px-1">{t('loading')}</p>
      )}
      {isError && (
        <p className="text-sm text-red-500 px-1">{t('errorLoading')}</p>
      )}

      {/* FullCalendar */}
      <div className="fc-wrapper rounded-[14px] overflow-hidden border border-card-border bg-card shadow-[var(--shadow-card)]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={frLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          buttonText={{
            today: t('today'),
          }}
          height="auto"
          datesSet={handleDatesSet}
          events={fcEvents}
          eventClick={handleEventClick}
          eventContent={(arg) => (
            <EventContent event={arg.event.extendedProps.event as EventWithRelations} title={arg.event.title} />
          )}
          dayMaxEvents={3}
          moreLinkText={(n) => `+${n}`}
          nowIndicator
        />
      </div>

      {/* Event detail panel */}
      {selectedEvent && (
        <EventDetailPanel event={selectedEvent} onClose={handleClosePanel} />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* EventContent — rendu personnalisé pour chaque événement dans FullCalendar  */
/* -------------------------------------------------------------------------- */

type EventContentProps = {
  event: EventWithRelations
  title: string
}

function EventContent({ event, title }: EventContentProps) {
  const color = event.category?.color ?? PRIMARY_COLOR

  return (
    <div
      className="flex items-center gap-1 px-1 py-0.5 w-full overflow-hidden rounded-sm text-white text-xs font-medium leading-tight"
      style={{ backgroundColor: color, borderLeft: `3px solid ${adjustColor(color)}` }}
    >
      <span className="truncate flex-1">{title}</span>
      {/* Pastilles couleur des membres assignés */}
      {event.assignments.length > 0 && (
        <span className="flex items-center gap-0.5 shrink-0">
          {event.assignments.slice(0, 3).map((assignment) => (
            <MemberDot key={assignment.userId} color={assignment.user.color ?? '#3498DB'} name={assignment.user.name ?? ''} />
          ))}
        </span>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MemberDot — pastille couleur d'un membre assigné                           */
/* -------------------------------------------------------------------------- */

type MemberDotProps = {
  color: string
  name: string
}

function MemberDot({ color, name }: MemberDotProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <span
      title={name}
      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[8px] font-semibold border border-white/30 shrink-0"
      style={{ backgroundColor: color }}
      aria-label={name}
    >
      {initials}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Utilitaire : assombrit légèrement une couleur hex pour la bordure gauche   */
/* -------------------------------------------------------------------------- */

function adjustColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex
  const r = Math.max(0, parseInt(result[1], 16) - 30)
  const g = Math.max(0, parseInt(result[2], 16) - 30)
  const b = Math.max(0, parseInt(result[3], 16) - 30)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
