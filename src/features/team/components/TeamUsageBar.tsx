import { Users } from 'lucide-react'
import { useCurrentSubscription } from '@/features/subscription/hooks/useCurrentSubscription'

export function TeamUsageBar() {
  const { subscription, isLoading } = useCurrentSubscription()

  const usage = subscription?.usage?.users
  const current = usage?.current ?? 0
  const limit = usage?.limit ?? null

  const pct = limit !== null ? Math.min((current / limit) * 100, 100) : 0
  const barColor =
    limit === null
      ? 'bg-blue-500'
      : pct >= 90
        ? 'bg-red-500'
        : pct >= 70
          ? 'bg-yellow-500'
          : 'bg-green-500'

  const limitReached = limit !== null && current >= limit
  const limitLabel = limit !== null ? String(limit) : 'Ilimitado'

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-2 bg-gray-200 rounded-full" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {current} / {limitLabel} usuarios del plan
          </span>
        </div>
        {limitReached && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            Límite alcanzado
          </span>
        )}
      </div>
      <div
        className="h-2 bg-gray-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: limit !== null ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  )
}
