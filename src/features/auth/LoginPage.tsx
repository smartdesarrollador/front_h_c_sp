import { useState, useEffect, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AuthLayout from '@/features/auth/components/AuthLayout'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { publicClient, apiClient } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { User, Tenant } from '@/types/auth'
import type { SSOTokenResponse } from '@/features/services/types'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

async function redirectViaSSO(service: string) {
  const { data } = await apiClient.post<SSOTokenResponse>('/auth/sso/token/', { service })
  window.location.href = data.redirect_url
}

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const resetSuccess = (location.state as { resetSuccess?: boolean } | null)?.resetSuccess

  const searchParams = new URLSearchParams(location.search)
  const nextService = searchParams.get('next') // 'workspace' | 'vista' | null

  const { mutate: loginMutate, isPending, error, data: loginResult } = useLogin()
  const [mfaToken, setMfaToken] = useState<string | null>(null)
  const [mfaCode, setMfaCode] = useState('')
  const [mfaError, setMfaError] = useState<string | null>(null)
  const [mfaLoading, setMfaLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  // Detectar resultado MFA desde la mutación; si hay ?next, iniciar SSO tras login exitoso
  useEffect(() => {
    if (!loginResult) return
    if ('mfaRequired' in loginResult) {
      setMfaToken(loginResult.mfaToken)
    } else if (nextService) {
      redirectViaSSO(nextService)
    }
  }, [loginResult]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleMfaSubmit(e: FormEvent) {
    e.preventDefault()
    setMfaError(null)
    setMfaLoading(true)
    try {
      const { data } = await publicClient.post<{
        access_token: string
        refresh_token: string
        user: User
        tenant: Tenant
      }>('/auth/mfa/validate/', { mfa_token: mfaToken, code: mfaCode })

      useAuthStore.getState().setUser(data.user)
      useAuthStore.getState().setTenant(data.tenant)
      useAuthStore.getState().setAccessToken(data.access_token)
      localStorage.setItem('hub-refreshToken', data.refresh_token)
      localStorage.setItem('hub-authUser', JSON.stringify(data.user))
      localStorage.setItem('hub-authTenant', JSON.stringify(data.tenant))
      if (nextService) {
        await redirectViaSSO(nextService)
      } else {
        navigate('/dashboard')
      }
    } catch {
      setMfaError('Código MFA inválido. Inténtalo de nuevo.')
    } finally {
      setMfaLoading(false)
    }
  }

  function onSubmit(formData: LoginFormData) {
    loginMutate({ email: formData.email, password: formData.password })
  }

  const errorMessage = error
    ? 'Credenciales inválidas. Verifica tu email y contraseña.'
    : null

  if (mfaToken) {
    return (
      <AuthLayout>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verificación MFA
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Ingresa el código de tu aplicación autenticadora.
        </p>
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código de verificación
            </label>
            <input
              type="text"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest"
              placeholder="000000"
            />
            {mfaError && <p className="text-red-500 text-sm mt-1">{mfaError}</p>}
          </div>
          <button
            type="submit"
            disabled={mfaLoading || mfaCode.length !== 6}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {mfaLoading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      {resetSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4 text-sm text-green-700 dark:text-green-300">
          Contraseña restablecida correctamente. Inicia sesión con tu nueva contraseña.
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Iniciar sesión
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Accede a tu Hub de Servicios</p>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-3 mb-6 text-sm">
        <p className="font-medium text-blue-800 dark:text-blue-300">Demo</p>
        <p className="text-blue-600 dark:text-blue-400">
          Usa tus credenciales de tenant para acceder
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="tu@empresa.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="mt-4 text-center space-y-2 text-sm">
        <Link
          to="/forgot-password"
          className="text-primary-600 hover:text-primary-700 block"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Regístrate gratis
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
