import { apiFetch } from './client'
import type { InvitationStyle } from '@/lib/types'

export function listInvitationStyles() {
  return apiFetch<InvitationStyle[]>('/invitation-styles')
}
