import { apiFetch } from './client'
import type { User } from '@/lib/types'

interface AuthResponse {
  token: string
  user: User
}

export function register(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getMe() {
  return apiFetch<{ user: User }>('/auth/me')
}

export function updateMe(body: { name?: string; phone?: string }) {
  return apiFetch<{ user: User }>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
