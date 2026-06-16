import { apiFetch } from './client'
import type { EventStep, Message, MessageChannel } from '@/lib/types'

interface CreateMessageInput {
  type: Message['type']
  content: string
  channel?: MessageChannel
  steps?: EventStep[]
  scheduledAt?: string
  poll?: {
    question: string
    isAnonymous?: boolean
    options: string[]
  }
}

export function listMessages(eventId: string) {
  return apiFetch<Message[]>(`/events/${eventId}/messages`)
}

export function createMessage(eventId: string, body: CreateMessageInput) {
  return apiFetch<Message>(`/events/${eventId}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function deleteMessage(eventId: string, messageId: string) {
  return apiFetch<void>(`/events/${eventId}/messages/${messageId}`, {
    method: 'DELETE',
  })
}

export function voteOnPoll(eventId: string, messageId: string, body: { guestId: string; optionId: string }) {
  return apiFetch<Message>(`/events/${eventId}/messages/${messageId}/votes`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
