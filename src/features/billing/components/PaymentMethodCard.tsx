import { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import type { PaymentMethod } from '../types'
import { useSetDefaultMethod } from '../hooks/useSetDefaultMethod'
import { useDeletePaymentMethod } from '../hooks/useDeletePaymentMethod'

const PAYMENT_BRANDS: Record<string, { color: string; label: string }> = {
  visa:        { color: '#1A1F71', label: 'Visa' },
  mastercard:  { color: '#EB001B', label: 'Mastercard' },
  paypal:      { color: '#003087', label: 'PayPal' },
  mercadopago: { color: '#009EE3', label: 'MercadoPago' },
  yape:        { color: '#7B2D8B', label: 'Yape' },
  plin:        { color: '#2AC400', label: 'Plin' },
  nequi:       { color: '#A0008E', label: 'Nequi' },
  daviplata:   { color: '#FFA500', label: 'Daviplata' },
}

interface Props {
  method: PaymentMethod
  canManage: boolean
}

export function PaymentMethodCard({ method, canManage }: Props) {
  const [confirming, setConfirming] = useState(false)
  const { mutate: setDefault, isPending: settingDefault } = useSetDefaultMethod()
  const { mutate: deleteMethod, isPending: deleting } = useDeletePaymentMethod()

  const brandKey = method.brand.toLowerCase()
  const brand = PAYMENT_BRANDS[brandKey] ?? { color: '#6b7280', label: method.brand }

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    deleteMethod(method.id)
    setConfirming(false)
  }

  return (
    <div
      className={`relative rounded-xl border-2 overflow-hidden transition-colors ${
        method.is_default
          ? 'border-primary-300 bg-primary-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Brand color bar */}
      <div className="h-2 w-full" style={{ backgroundColor: brand.color }} />

      <div className="p-4">
        {/* Badge */}
        {method.is_default && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 mb-2">
            <Star className="h-3 w-3" />
            Predeterminado
          </span>
        )}

        {/* Brand & info */}
        <p className="text-sm font-semibold text-gray-900">{brand.label}</p>
        {method.last4 && (
          <p className="text-sm text-gray-500 mt-0.5">•••• {method.last4}</p>
        )}
        {method.exp_month && method.exp_year && (
          <p className="text-xs text-gray-400 mt-0.5">
            Vence {String(method.exp_month).padStart(2, '0')}/{method.exp_year}
          </p>
        )}
        {method.phone_number && (
          <p className="text-xs text-gray-400 mt-0.5">{method.phone_number}</p>
        )}

        {/* Actions */}
        {canManage && (
          <div className="flex gap-2 mt-3">
            {!method.is_default && (
              <button
                onClick={() => setDefault(method.id)}
                disabled={settingDefault}
                className="flex-1 text-xs py-1.5 px-2 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Establecer como predeterminado
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={method.is_default || deleting}
              title={method.is_default ? 'No puedes eliminar el método predeterminado' : undefined}
              className={`flex items-center gap-1 text-xs py-1.5 px-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                confirming
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'border border-red-200 text-red-600 hover:bg-red-50'
              }`}
            >
              <Trash2 className="h-3 w-3" />
              {confirming ? '¿Confirmar?' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
