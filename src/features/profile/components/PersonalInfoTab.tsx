import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useUpdateProfile } from '../hooks/useUpdateProfile'

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
})

type FormData = z.infer<typeof schema>

function PersonalInfoTab() {
  const { t } = useTranslation('profile')
  const user = useAuthStore((s) => s.user)
  const updateProfile = useUpdateProfile()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '' },
  })

  useEffect(() => {
    reset({ name: user?.name ?? '' })
  }, [user?.name, reset])

  const onSubmit = (data: FormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      },
    })
  }

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('nameField')}
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email (readonly) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t('emailField')}
          </label>
          <input
            id="email"
            type="email"
            value={user?.email ?? ''}
            readOnly
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">{t('emailHint')}</p>
        </div>

        {updateProfile.isError && (
          <p className="text-sm text-red-600">Error al guardar los cambios.</p>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            {t('saved')}
          </div>
        )}

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {updateProfile.isPending ? t('saving') : t('save')}
        </button>
      </form>
    </div>
  )
}

export default PersonalInfoTab
