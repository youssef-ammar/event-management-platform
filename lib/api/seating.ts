import { apiFetch } from './client'
import type { Guest, SeatingTable } from '@/lib/types'

interface TableInput {
  name: string
  capacity: number
  shape?: 'round' | 'rectangular'
  position?: { x: number; y: number }
}

export function listTables(eventId: string) {
  return apiFetch<SeatingTable[]>(`/events/${eventId}/seating/tables`)
}

export function createTable(eventId: string, body: TableInput) {
  return apiFetch<SeatingTable>(`/events/${eventId}/seating/tables`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateTable(eventId: string, tableId: string, body: Partial<TableInput>) {
  return apiFetch<SeatingTable>(`/events/${eventId}/seating/tables/${tableId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deleteTable(eventId: string, tableId: string) {
  return apiFetch<void>(`/events/${eventId}/seating/tables/${tableId}`, {
    method: 'DELETE',
  })
}

export function assignGuest(eventId: string, body: { guestId: string; tableId: string | null }) {
  return apiFetch<Guest>(`/events/${eventId}/seating/assign`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
