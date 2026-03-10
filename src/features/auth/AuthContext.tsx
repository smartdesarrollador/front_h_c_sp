import React, { createContext, useContext, useEffect, useState } from 'react'
import { publicClient, apiClient } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { User, Tenant } from '@/types/auth'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  organization_name: string
  plan: string
}

export type LoginResult = { ok: true } | { mfaRequired: true; mfaToken: string }

interface AuthContextValue {
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const refresh = localStorage.getItem('hub-refreshToken')
    if (refresh) {
      publicClient
        .post<{ access_token: string; refresh_token: string }>(
          '/auth/refresh-token',
          { refresh_token: refresh },
        )
        .then(({ data }) => {
          useAuthStore.getState().setAccessToken(data.access_token)
          localStorage.setItem('hub-refreshToken', data.refresh_token)
          const savedUser = localStorage.getItem('hub-authUser')
          const savedTenant = localStorage.getItem('hub-authTenant')
          if (savedUser) useAuthStore.getState().setUser(JSON.parse(savedUser) as User)
          if (savedTenant) useAuthStore.getState().setTenant(JSON.parse(savedTenant) as Tenant)
        })
        .catch(() => useAuthStore.getState().clearAuth())
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  async function login(email: string, password: string): Promise<LoginResult> {
    const { data } = await publicClient.post<
      | { access_token: string; refresh_token: string; user: User; tenant: Tenant }
      | { mfa_required: true; mfa_token: string }
    >('/auth/login', { email, password })

    if ('mfa_required' in data) {
      return { mfaRequired: true, mfaToken: data.mfa_token }
    }

    useAuthStore.getState().setUser(data.user)
    useAuthStore.getState().setTenant(data.tenant)
    useAuthStore.getState().setAccessToken(data.access_token)
    localStorage.setItem('hub-refreshToken', data.refresh_token)
    localStorage.setItem('hub-authUser', JSON.stringify(data.user))
    localStorage.setItem('hub-authTenant', JSON.stringify(data.tenant))
    return { ok: true }
  }

  async function logout(): Promise<void> {
    await apiClient.post('/auth/logout').catch(() => {})
    useAuthStore.getState().clearAuth()
    localStorage.removeItem('hub-refreshToken')
    localStorage.removeItem('hub-authUser')
    localStorage.removeItem('hub-authTenant')
  }

  async function register(data: RegisterRequest): Promise<void> {
    await publicClient.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      organization_name: data.organization_name,
      plan: data.plan,
    })
  }

  return (
    <AuthContext.Provider value={{ isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
