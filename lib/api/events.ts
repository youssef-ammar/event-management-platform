import { apiFetch } from './client'
import type { ActivityItem, Event, EventStep, StatsCard } from '@/lib/types'

interface EventStepInput {
  step: EventStep
  label: string
  date: string
  time: string
  address: string
}

interface CreateEventInput {
  name: string
  type: Event['type']
  date: string
  venue: string
  coupleNames?: string
  coverImageUrl?: string
  steps?: EventStepInput[]
}

type UpdateEventInput = Partial<CreateEventInput>

export function listEvents() {
  return apiFetch<Event[]>('/events')
}

export function createEvent(body: CreateEventInput) {
  return apiFetch<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getEvent(eventId: string) {
  return apiFetch<Event>(`/events/${eventId}`)
}

export function updateEvent(eventId: string, body: UpdateEventInput) {
  return apiFetch<Event>(`/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function getDashboard(eventId: string) {
  return apiFetch<{ stats: StatsCard[]; activity: ActivityItem[] }>(`/events/${eventId}/dashboard`)
}
