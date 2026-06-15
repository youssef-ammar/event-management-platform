import { apiFetch } from './client'
import type { Notification } from '@/lib/types'

export function listNotifications(eventId: string) {
  return apiFetch<Notification[]>(`/events/${eventId}/notifications`)
}

export function markRead(eventId: string, notificationId: string) {
  return apiFetch<Notification>(`/events/${eventId}/notifications/${notificationId}/read`, {
    method: 'PATCH',
  })
}

export function markAllRead(eventId: string) {
  return apiFetch<void>(`/events/${eventId}/notifications/read-all`, {
    method: 'PATCH',
  })
}
