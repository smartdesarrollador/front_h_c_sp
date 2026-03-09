import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import AuthLayout from '@/features/auth/components/AuthLayout'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { mutate, isPending } = useForgotPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    mutate(data.email, { onSuccess: () => setSent(true) })
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✉️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Email enviado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Si ese email está registrado, recibirás un enlace para restablecer tu
            contraseña.
          </p>
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Ingresa tu email y te enviaremos un enlace para restablecerla.
      </p>
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
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </form>
      <Link
        to="/login"
        className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 justify-center"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio de sesión
      </Link>
    </AuthLayout>
  )
}
