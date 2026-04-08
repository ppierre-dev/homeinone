'use client'

import { useTranslations } from 'next-intl'
import type { EventWithRelations } from '@/modules/calendar/types/calendar.types'

type EventDetailPanelProps = {
  event: EventWithRelations
  onClose: () => void
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const t = useTranslations('calendar')

  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null
  const color = event.category?.color ?? '#4a7c59'

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom sheet on mobile, side panel on desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        className={`
          fixed z-50 bg-card border border-card-border shadow-[0_8px_24px_rgba(0,0,0,0.1)]
          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 rounded-t-[20px]
          /* Desktop: right panel */
          md:bottom-auto md:top-1/2 md:right-6 md:left-auto md:-translate-y-1/2
          md:w-[400px] md:rounded-[14px]
          max-h-[85vh] overflow-y-auto
        `}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-card-border" />
        </div>

        {/* Header coloré selon la catégorie */}
        <div
          className="flex items-start justify-between px-5 py-4 gap-3"
          style={{ borderLeft: `4px solid ${color}` }}
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {event.category && (
              <span
                className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${color}22`,
                  color,
                }}
              >
                {event.category.name}
              </span>
            )}
            <h2 className="text-lg font-semibold text-foreground leading-snug">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-foreground-muted hover:bg-card-border transition-colors"
            aria-label={t('close')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-6 flex flex-col gap-4">
          {/* Dates */}
          <section aria-label={t('detail.dates')}>
            <div className="flex items-start gap-3 text-sm text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground-muted shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div>
                {event.isAllDay ? (
                  <p>
                    {formatDate(startDate)}
                    {endDate &&
                      endDate.toDateString() !== startDate.toDateString() && (
                        <> &rarr; {formatDate(endDate)}</>
                      )}
                  </p>
                ) : (
                  <>
                    <p>{formatDate(startDate)}</p>
                    <p className="text-foreground-muted">
                      {formatTime(startDate)}
                      {endDate && <> &ndash; {formatTime(endDate)}</>}
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Location */}
          {event.location && (
            <section aria-label={t('detail.location')}>
              <div className="flex items-start gap-3 text-sm text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground-muted shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p>{event.location}</p>
              </div>
            </section>
          )}

          {/* Description */}
          {event.description && (
            <section aria-label={t('detail.description')}>
              <div className="flex items-start gap-3 text-sm text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground-muted shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <line x1="17" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="17" y1="18" x2="3" y2="18" />
                </svg>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
            </section>
          )}

          {/* Members */}
          {event.assignments.length > 0 && (
            <section aria-label={t('detail.assignees')}>
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground-muted shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <div className="flex flex-wrap gap-2">
                  {event.assignments.map((assignment) => {
                    const memberColor = assignment.user.color ?? '#3498DB'
                    const initials = (assignment.user.name ?? '')
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                    return (
                      <span
                        key={assignment.userId}
                        className="inline-flex items-center gap-1.5 text-sm font-medium"
                      >
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-semibold"
                          style={{ backgroundColor: memberColor }}
                          aria-hidden="true"
                        >
                          {initials}
                        </span>
                        <span className="text-foreground">
                          {assignment.user.name}
                        </span>
                      </span>
                    )
                  })}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
