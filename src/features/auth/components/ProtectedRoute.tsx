import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

export default function ProtectedRoute() {
  const { isLoading } = useAuth()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
          role="status"
          aria-label="Cargando"
        />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
