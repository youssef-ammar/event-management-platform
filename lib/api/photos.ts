import { apiFetch } from './client'
import type { Photo } from '@/lib/types'

export function listPhotos(eventId: string, approved?: boolean) {
  const query = approved !== undefined ? `?approved=${approved}` : ''
  return apiFetch<Photo[]>(`/events/${eventId}/photos${query}`)
}

export function uploadPhoto(eventId: string, formData: FormData) {
  return apiFetch<Photo>(`/events/${eventId}/photos`, {
    method: 'POST',
    body: formData,
  })
}

export function updatePhotoApproval(eventId: string, photoId: string, body: { approved: boolean }) {
  return apiFetch<Photo>(`/events/${eventId}/photos/${photoId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deletePhoto(eventId: string, photoId: string) {
  return apiFetch<void>(`/events/${eventId}/photos/${photoId}`, {
    method: 'DELETE',
  })
}
