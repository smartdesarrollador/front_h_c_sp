import { Loader2 } from 'lucide-react'
import type { BillingCycle, PlanData } from '../types'

interface Props {
  targetPlan: PlanData | null
  billingCycle: BillingCycle
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export default function UpgradePlanModal({
  targetPlan,
  billingCycle,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: Props) {
  if (!isOpen || !targetPlan) return null

  const plan = targetPlan
  const price =
    billingCycle === 'annual' ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
        className="bg-white rounded-xl max-w-md w-full p-6 space-y-4"
      >
        <h2 id="upgrade-modal-title" className="text-xl font-bold text-gray-900">
          Actualizar a {plan.displayName}
        </h2>
        <p className="text-gray-600 text-sm">
          Se realizará un cargo de <strong>${price}/mes</strong>
          {billingCycle === 'annual' ? ' (facturado anualmente)' : ''} a tu método de pago
          registrado.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar upgrade'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
