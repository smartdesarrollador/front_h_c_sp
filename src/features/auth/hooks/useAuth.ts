import { useAuthContext } from '@/features/auth/AuthContext'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { isLoading, login, logout, register } = useAuthContext()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return { user, isAuthenticated, isLoading, login, logout, register }
}
