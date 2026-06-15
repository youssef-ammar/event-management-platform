import { apiFetch } from './client'
import type { GiftItem } from '@/lib/types'

interface GiftInput {
  name: string
  description: string
  imageUrl: string
  price?: number
  link?: string
}

type UpdateGiftInput = Partial<GiftInput> & { status?: GiftItem['status'] }

export function listGifts(eventId: string) {
  return apiFetch<GiftItem[]>(`/events/${eventId}/gifts`)
}

export function createGift(eventId: string, body: GiftInput) {
  return apiFetch<GiftItem>(`/events/${eventId}/gifts`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateGift(eventId: string, giftId: string, body: UpdateGiftInput) {
  return apiFetch<GiftItem>(`/events/${eventId}/gifts/${giftId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deleteGift(eventId: string, giftId: string) {
  return apiFetch<void>(`/events/${eventId}/gifts/${giftId}`, {
    method: 'DELETE',
  })
}

export function reserveGift(eventId: string, giftId: string, body: { reservedByName: string; reservedByGuestId?: string }) {
  return apiFetch<GiftItem>(`/events/${eventId}/gifts/${giftId}/reserve`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function unreserveGift(eventId: string, giftId: string) {
  return apiFetch<GiftItem>(`/events/${eventId}/gifts/${giftId}/unreserve`, {
    method: 'POST',
  })
}
