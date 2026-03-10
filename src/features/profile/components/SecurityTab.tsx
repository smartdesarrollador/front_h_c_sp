import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Eye, EyeOff, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useChangePassword } from '../hooks/useChangePassword'
import { useMFASetup } from '../hooks/useMFASetup'
import { useMFADisable } from '../hooks/useMFADisable'

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'La contraseña actual es requerida'),
    new_password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

function SecurityTab() {
  const { t } = useTranslation('profile')
  const user = useAuthStore((s) => s.user)
  const changePassword = useChangePassword()
  const mfaSetup = useMFASetup()
  const mfaDisable = useMFADisable()
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmitPassword = (data: PasswordFormData) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        reset()
        setPasswordSuccess(true)
        setTimeout(() => setPasswordSuccess(false), 3000)
      },
    })
  }

  const handleEnableMFA = () => {
    mfaSetup.mutate(undefined, {})
  }

  const inputType = showPasswords ? 'text' : 'password'

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-base font-medium text-gray-900">{t('changePwd')}</h3>

        <form
          data-testid="change-password-form"
          onSubmit={handleSubmit(onSubmitPassword)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
              {t('currentPwd')}
            </label>
            <input
              id="current_password"
              type={inputType}
              placeholder={t('pwdPlaceholder')}
              {...register('current_password')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors.current_password && (
              <p className="mt-1 text-xs text-red-600">{errors.current_password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
              {t('newPwd')}
            </label>
            <input
              id="new_password"
              type={inputType}
              placeholder={t('newPwdPlaceholder')}
              {...register('new_password')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors.new_password && (
              <p className="mt-1 text-xs text-red-600">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
              {t('confirmPwd')}
            </label>
            <input
              id="confirm_password"
              type={inputType}
              placeholder={t('pwdPlaceholder')}
              {...register('confirm_password')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-xs text-red-600">{errors.confirm_password.message}</p>
            )}
          </div>

          {/* Show/hide passwords toggle */}
          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPasswords ? (
              <><EyeOff className="h-4 w-4" />{t('hidePwd')}</>
            ) : (
              <><Eye className="h-4 w-4" />{t('showPwd')}</>
            )}
          </button>

          {changePassword.isError && (
            <p className="text-sm text-red-600">Error al cambiar la contraseña. Verifica tu contraseña actual.</p>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Contraseña actualizada correctamente.
            </div>
          )}

          <button
            type="submit"
            disabled={changePassword.isPending}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {changePassword.isPending ? t('saving') : t('changePwd')}
          </button>
        </form>
      </div>

      {/* MFA Section */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-500" />
          <h3 className="text-base font-medium text-gray-900">{t('mfaSection')}</h3>
        </div>
        <p className="text-sm text-gray-500">{t('mfaSub')}</p>

        {user?.mfaEnabled ? (
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <CheckCircle className="h-3 w-3" />
              {t('mfaEnabled')}
            </span>
            <p className="text-sm text-gray-500">{t('mfaEnabledSub')}</p>
            <button
              onClick={() => mfaDisable.mutate()}
              disabled={mfaDisable.isPending}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {mfaDisable.isPending ? t('saving') : t('deactivateMfa')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {t('mfaDisabled')}
            </span>
            <p className="text-sm text-gray-500">{t('mfaDisabledSub')}</p>
            <button
              onClick={handleEnableMFA}
              disabled={mfaSetup.isPending}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {mfaSetup.isPending ? t('saving') : t('activateMfa')}
            </button>

            {mfaSetup.isSuccess && mfaSetup.data && (
              <div className="space-y-3 mt-4">
                <p className="text-sm text-gray-600">
                  Escanea el código QR con tu aplicación de autenticación.
                </p>
                <img
                  src={mfaSetup.data.qr_uri}
                  alt="MFA QR Code"
                  className="h-40 w-40 rounded border border-gray-200"
                />
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Clave secreta:</p>
                  <p className="select-all font-mono text-sm text-gray-800">{mfaSetup.data.secret}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SecurityTab
