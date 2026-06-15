const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
const AUTH_STORAGE_KEY = 'fairepart_auth'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let token: string | undefined
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
      token = raw ? JSON.parse(raw)?.token : undefined
    } catch {
      token = undefined
    }
  }

  const isFormData = options.body instanceof FormData

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => undefined)

  if (!res.ok) {
    throw new ApiError(data?.message ?? `Erreur ${res.status}`, res.status)
  }

  return data as T
}
