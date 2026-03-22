import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { User, Tenant } from '@/types/auth'

function decodeB64<T>(value: string): T {
  return JSON.parse(atob(value)) as T
}

export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { setUser, setTenant, setAccessToken } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(search)
    const error = params.get('error')

    if (error) {
      navigate('/login', { state: { error }, replace: true })
      return
    }

    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const userB64 = params.get('user')
    const tenantB64 = params.get('tenant')

    if (!accessToken || !refreshToken || !userB64 || !tenantB64) {
      navigate('/login', { state: { error: 'auth_failed' }, replace: true })
      return
    }

    try {
      const user = decodeB64<User>(userB64)
      const tenant = decodeB64<Tenant>(tenantB64)

      localStorage.setItem('hub-refreshToken', refreshToken)
      localStorage.setItem('hub-authUser', JSON.stringify(user))
      localStorage.setItem('hub-authTenant', JSON.stringify(tenant))

      setUser(user)
      setTenant(tenant)
      setAccessToken(accessToken)

      navigate('/dashboard', { replace: true })
    } catch {
      navigate('/login', { state: { error: 'auth_failed' }, replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      role="status"
      aria-label="Procesando autenticación con Google"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Procesando autenticación con Google...
        </p>
      </div>
    </div>
  )
}
