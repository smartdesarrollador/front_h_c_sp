import type { CurrentSubscription } from '../types'

interface Props {
  subscription: CurrentSubscription | null
  isLoading: boolean
  canUpgradePlan: boolean
  onChangePlan: () => void
  onCancelRequest: () => void
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  trialing: 'Prueba',
  past_due: 'Pago pendiente',
  canceled: 'Cancelado',
  incomplete: 'Incompleto',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  trialing: 'bg-blue-100 text-blue-800',
  past_due: 'bg-red-100 text-red-800',
  canceled: 'bg-gray-100 text-gray-800',
  incomplete: 'bg-yellow-100 text-yellow-800',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function CurrentPlanCard({
  subscription,
  isLoading,
  canUpgradePlan,
  onChangePlan,
  onCancelRequest,
}: Props) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-4" />
        <div className="h-4 bg-white/20 rounded w-1/2 mb-2" />
        <div className="h-4 bg-white/20 rounded w-1/4" />
      </div>
    )
  }

  if (!subscription) return null

  return (
    <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl p-6 text-white space-y-4">
      {subscription.cancel_at_period_end && (
        <div className="bg-yellow-400/20 border border-yellow-300 rounded-lg p-3 text-yellow-100 text-sm">
          Tu suscripción se cancelará el {formatDate(subscription.current_period_end)}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm">Plan actual</p>
          <h2 className="text-2xl font-bold">{subscription.plan_display}</h2>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[subscription.status] ?? 'bg-gray-100 text-gray-800'}`}
        >
          {STATUS_LABELS[subscription.status] ?? subscription.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-white/70">Próxima renovación</p>
          <p className="font-medium">{formatDate(subscription.current_period_end)}</p>
        </div>
        <div>
          <p className="text-white/70">Facturación mensual</p>
          <p className="font-medium">${subscription.mrr.toFixed(2)}/mes</p>
        </div>
      </div>

      {canUpgradePlan && (
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onChangePlan}
            className="w-full bg-white text-primary-600 font-semibold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors"
          >
            Cambiar plan
          </button>
          {subscription.plan !== 'free' && (
            <button
              onClick={onCancelRequest}
              className="text-sm text-white/70 hover:text-red-300 transition-colors text-center"
            >
              Cancelar suscripción
            </button>
          )}
        </div>
      )}
    </div>
  )
}
