import { apiFetch } from './client'
import type { KittyGoal } from '@/lib/types'

interface KittyInput {
  name: string
  description: string
  imageUrl?: string
  targetAmount: number
}

type UpdateKittyInput = Partial<KittyInput> & { isActive?: boolean }

interface ContributionInput {
  name: string
  amount: number
  message?: string
  avatarColor?: string
  guestId?: string
}

export function listKitties(eventId: string) {
  return apiFetch<KittyGoal[]>(`/events/${eventId}/kitties`)
}

export function createKitty(eventId: string, body: KittyInput) {
  return apiFetch<KittyGoal>(`/events/${eventId}/kitties`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateKitty(eventId: string, kittyId: string, body: UpdateKittyInput) {
  return apiFetch<KittyGoal>(`/events/${eventId}/kitties/${kittyId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deleteKitty(eventId: string, kittyId: string) {
  return apiFetch<void>(`/events/${eventId}/kitties/${kittyId}`, {
    method: 'DELETE',
  })
}

export function addContribution(eventId: string, kittyId: string, body: ContributionInput) {
  return apiFetch<KittyGoal>(`/events/${eventId}/kitties/${kittyId}/contributions`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
