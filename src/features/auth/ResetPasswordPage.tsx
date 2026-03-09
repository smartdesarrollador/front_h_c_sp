import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AuthLayout from '@/features/auth/components/AuthLayout'
import { useResetPassword } from '@/features/auth/hooks/useResetPassword'

const schema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { mutate, isPending } = useResetPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Enlace de restablecimiento inválido o expirado.
          </p>
          <Link
            to="/forgot-password"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </AuthLayout>
    )
  }

  function onSubmit(data: FormData) {
    mutate({ token: token!, password: data.password })
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Nueva contraseña
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Elige una contraseña segura de al menos 8 caracteres.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nueva contraseña
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmar contraseña
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Repite tu contraseña"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </AuthLayout>
  )
}
