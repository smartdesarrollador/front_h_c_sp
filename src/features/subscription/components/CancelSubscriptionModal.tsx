import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason?: string) => void
  isPending: boolean
}

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: Props) {
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        className="bg-white rounded-xl max-w-md w-full p-6 space-y-4"
      >
        <h2 id="cancel-modal-title" className="text-xl font-bold text-gray-900">
          Cancelar suscripción
        </h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          Tu acceso continuará hasta el final del período actual
        </div>

        <div className="space-y-1">
          <label htmlFor="cancel-reason" className="text-sm font-medium text-gray-700">
            Cuéntanos por qué cancelas (opcional)
          </label>
          <textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tu comentario nos ayuda a mejorar..."
          />
          <p className="text-xs text-gray-400 text-right">{reason.length}/500</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              'Cancelar suscripción'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
