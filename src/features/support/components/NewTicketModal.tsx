import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCreateTicket } from '../hooks/useCreateTicket'
import type { NewTicketRequest } from '../types'

const schema = z.object({
  subject: z.string().min(5, 'Minimo 5 caracteres'),
  category: z.enum(['billing', 'technical', 'account', 'general']),
  priority: z.enum(['urgente', 'alta', 'media', 'baja']),
  description: z.string().min(20, 'Minimo 20 caracteres'),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export default function NewTicketModal({ open, onClose }: Props) {
  const { t } = useTranslation('hub')
  const [step, setStep] = useState<1 | 2>(1)
  const createTicket = useCreateTicket()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!open) {
      setStep(1)
      reset()
    }
  }, [open, reset])

  const onSubmit = (data: FormData) => {
    createTicket.mutate(data as NewTicketRequest, {
      onSuccess: () => {
        setStep(2)
        setTimeout(() => {
          onClose()
          reset()
          setStep(1)
        }, 1500)
      },
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('support.modalTitle')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('support.titleField')}</label>
                <input
                  {...register('subject')}
                  placeholder={t('support.titlePlaceholder')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('support.categoryField')}</label>
                <select
                  {...register('category')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- {t('support.categoryField')} --</option>
                  <option value="billing">{t('support.categoryBilling')}</option>
                  <option value="technical">{t('support.categoryTechnical')}</option>
                  <option value="account">{t('support.categoryAccount')}</option>
                  <option value="general">{t('support.categoryGeneral')}</option>
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('support.priorityField')}</label>
                <select
                  {...register('priority')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- {t('support.priorityField')} --</option>
                  <option value="baja">{t('support.priorityBaja')}</option>
                  <option value="media">{t('support.priorityMedia')}</option>
                  <option value="alta">{t('support.priorityAlta')}</option>
                  <option value="urgente">{t('support.priorityUrgente')}</option>
                </select>
                {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('support.descField')}</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder={t('support.descPlaceholder')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  {t('support.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createTicket.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {createTicket.isPending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {createTicket.isPending ? t('support.submitting') : t('support.submit')}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900">{t('support.successTitle')}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('support.successSub')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
