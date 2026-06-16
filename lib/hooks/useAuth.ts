'use client'

import { useLocalStorage } from './useLocalStorage'
import * as authApi from '@/lib/api/auth'
import type { User } from '@/lib/types'

interface AuthState {
  token: string
  user: User
}

export function useAuth() {
  const [auth, setAuth] = useLocalStorage<AuthState | null>('fairepart_auth', null)

  return {
    user: auth?.user ?? null,
    token: auth?.token ?? null,
    isAuthenticated: !!auth?.token,
    login: async (email: string, password: string) => {
      const result = await authApi.login(email, password)
      setAuth(result)
      return result
    },
    loginWithFacebook: async (accessToken: string) => {
      const result = await authApi.loginWithFacebook(accessToken)
      setAuth(result)
      return result
    },
    register: async (name: string, email: string, password: string) => {
      const result = await authApi.register(name, email, password)
      setAuth(result)
      return result
    },
    updateProfile: async (body: { name?: string; phone?: string }) => {
      const { user } = await authApi.updateMe(body)
      setAuth((a) => (a ? { ...a, user } : a))
      return user
    },
    logout: () => setAuth(null),
  }
}
