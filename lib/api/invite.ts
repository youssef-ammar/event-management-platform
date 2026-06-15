import { apiFetch } from './client'
import type { Event, EventStep, Guest, GiftItem, KittyGoal, Message, Photo, PublicSeatingTable, RSVPStatus } from '@/lib/types'

export function getInvite(token: string) {
  return apiFetch<Event>(`/invite/${token}`)
}

export function getGuestByEmail(token: string, email: string) {
  return apiFetch<Guest>(`/invite/${token}/guests?email=${encodeURIComponent(email)}`)
}

export function submitRsvp(
  token: string,
  guestId: string,
  body: { rsvpStatus?: RSVPStatus; steps?: EventStep[]; dietaryRestrictions?: string }
) {
  return apiFetch<Guest>(`/invite/${token}/guests/${guestId}/rsvp`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function getPublicTables(token: string) {
  return apiFetch<PublicSeatingTable[]>(`/invite/${token}/tables`)
}

export function getPublicMessages(token: string) {
  return apiFetch<Message[]>(`/invite/${token}/messages`)
}

export function voteOnPublicPoll(token: string, messageId: string, body: { guestId: string; optionId: string }) {
  return apiFetch<Message>(`/invite/${token}/messages/${messageId}/votes`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getPublicGifts(token: string) {
  return apiFetch<GiftItem[]>(`/invite/${token}/gifts`)
}

export function reservePublicGift(token: string, giftId: string, body: { reservedByName: string; reservedByGuestId?: string }) {
  return apiFetch<GiftItem>(`/invite/${token}/gifts/${giftId}/reserve`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getPublicKitties(token: string) {
  return apiFetch<KittyGoal[]>(`/invite/${token}/kitties`)
}

export function contributePublicKitty(
  token: string,
  kittyId: string,
  body: { name: string; amount: number; message?: string; avatarColor?: string; guestId?: string }
) {
  return apiFetch<KittyGoal>(`/invite/${token}/kitties/${kittyId}/contributions`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function uploadPublicPhoto(token: string, formData: FormData) {
  return apiFetch<Photo>(`/invite/${token}/photos`, {
    method: 'POST',
    body: formData,
  })
}
