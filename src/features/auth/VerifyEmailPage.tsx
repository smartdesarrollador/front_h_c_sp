import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react'
import AuthLayout from '@/features/auth/components/AuthLayout'
import { useVerifyEmail } from '@/features/auth/hooks/useVerifyEmail'
import { useResendVerification } from '@/features/auth/hooks/useResendVerification'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const prefilledEmail = searchParams.get('email') ?? ''
  const startWithResend = searchParams.get('resend') === 'true' && !token

  const { mutate: verifyEmail, isPending, isSuccess, isError } = useVerifyEmail()
  const {
    mutate: resendVerification,
    isPending: isResending,
    isSuccess: resentOk,
  } = useResendVerification()

  const [resendEmail, setResendEmail] = useState(prefilledEmail)

  useEffect(() => {
    if (token) verifyEmail(token)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (startWithResend) {
    return (
      <AuthLayout>
        <ResendForm
          email={resendEmail}
          onEmailChange={setResendEmail}
          onSubmit={() => resendVerification(resendEmail)}
          isResending={isResending}
          resentOk={resentOk}
        />
      </AuthLayout>
    )
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Enlace inválido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No se encontró un token de verificación en la URL.
          </p>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (isPending) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4 py-4">
          <Loader2 className="h-10 w-10 text-primary-600 mx-auto animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Verificando tu email...</p>
        </div>
      </AuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email verificado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Tu cuenta está activa. Ya puedes iniciar sesión.
            </p>
          </div>
          <Link
            to="/login"
            className="block w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (isError) {
    return (
      <AuthLayout>
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              El enlace expiró o es inválido
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Los enlaces de verificación expiran en 24 horas. Solicita uno nuevo.
            </p>
          </div>
          <ResendForm
            email={resendEmail}
            onEmailChange={setResendEmail}
            onSubmit={() => resendVerification(resendEmail)}
            isResending={isResending}
            resentOk={resentOk}
          />
          <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return null
}

interface ResendFormProps {
  email: string
  onEmailChange: (v: string) => void
  onSubmit: () => void
  isResending: boolean
  resentOk: boolean
}

function ResendForm({ email, onEmailChange, onSubmit, isResending, resentOk }: ResendFormProps) {
  if (resentOk) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Email enviado</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Si tu email está registrado y sin verificar, recibirás un nuevo enlace.
        </p>
        <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Reenviar email de verificación
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="tu@empresa.com"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={isResending || !email}
        className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm"
      >
        {isResending ? 'Enviando...' : 'Reenviar enlace'}
      </button>
    </div>
  )
}
