import { apiFetch } from './client'
import type { EventSettings } from '@/lib/types'

export function getSettings(eventId: string) {
  return apiFetch<EventSettings>(`/events/${eventId}/settings`)
}

export function updateSettings(eventId: string, body: Partial<EventSettings>) {
  return apiFetch<EventSettings>(`/events/${eventId}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
