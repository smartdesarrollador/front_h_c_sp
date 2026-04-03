import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/v1`

/**
 * Cliente público (sin token). Para login, register, refresh, etc.
 */
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Cliente autenticado. Adjunta Authorization header automáticamente.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: añade el token de acceso en cada petición
apiClient.interceptors.request.use((config) => {
  const { accessToken, tenant } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  if (tenant?.subdomain) {
    config.headers['X-Tenant-Slug'] = tenant.subdomain
  }
  return config
})

// Response interceptor: maneja 401 e intenta refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('hub-refreshToken')

      if (refreshToken) {
        try {
          const { data } = await publicClient.post<{
            access_token: string
            refresh_token: string
          }>('/auth/refresh-token', { refresh_token: refreshToken })

          useAuthStore.getState().setAccessToken(data.access_token)
          localStorage.setItem('hub-refreshToken', data.refresh_token)

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`
          return apiClient(originalRequest)
        } catch {
          useAuthStore.getState().clearAuth()
          localStorage.removeItem('hub-refreshToken')
          localStorage.removeItem('hub-authUser')
          localStorage.removeItem('hub-authTenant')
          window.location.href = '/login'
        }
      } else {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
