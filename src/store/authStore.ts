import { create } from 'zustand'
import type { Tenant, User } from '@/types/auth'

interface AuthState {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setTenant: (tenant: Tenant) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenant: null,
  accessToken: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setTenant: (tenant) => set({ tenant }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => {
    localStorage.removeItem('hub-refreshToken')
    set({ user: null, tenant: null, accessToken: null, isAuthenticated: false })
  },
}))
