import { apiFetch } from './client'
import type { Guest } from '@/lib/types'

export function listGuests(eventId: string) {
  return apiFetch<Guest[]>(`/events/${eventId}/guests`)
}

export function createGuest(eventId: string, body: Partial<Guest>) {
  return apiFetch<Guest>(`/events/${eventId}/guests`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateGuest(eventId: string, guestId: string, body: Partial<Guest>) {
  return apiFetch<Guest>(`/events/${eventId}/guests/${guestId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deleteGuest(eventId: string, guestId: string) {
  return apiFetch<void>(`/events/${eventId}/guests/${guestId}`, {
    method: 'DELETE',
  })
}
