import type { SubscriptionUsage } from '../types'

interface Props {
  usage: SubscriptionUsage | null
  isLoading: boolean
}

function getBarColor(current: number, limit: number | null): string {
  if (limit === null) return 'bg-blue-500'
  const ratio = current / limit
  if (ratio >= 0.9) return 'bg-red-500'
  if (ratio >= 0.7) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getBarWidth(current: number, limit: number | null): string {
  if (limit === null) return '100%'
  const ratio = Math.min(current / limit, 1)
  return `${ratio * 100}%`
}

export default function UsageMeters({ usage, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const meters = [
    {
      label: 'Usuarios',
      current: usage?.users.current ?? 0,
      limit: usage?.users.limit ?? null,
      format: (v: number) => `${v}`,
    },
    {
      label: 'Almacenamiento',
      current: usage?.storage.current_gb ?? 0,
      limit: usage?.storage.limit_gb ?? null,
      format: (v: number) => `${v.toFixed(1)} GB`,
    },
    {
      label: 'Servicios activos',
      current: usage?.services.current ?? 0,
      limit: usage?.services.limit ?? null,
      format: (v: number) => `${v}`,
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Uso actual</h2>
      {meters.map((meter) => (
        <div key={meter.label} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{meter.label}</span>
            <span className="font-medium text-gray-900">
              {meter.format(meter.current)}
              {meter.limit !== null ? ` / ${meter.format(meter.limit)}` : ' / Ilimitado'}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              role="progressbar"
              aria-valuenow={meter.current}
              aria-valuemin={0}
              aria-valuemax={meter.limit ?? meter.current}
              className={`h-full rounded-full transition-all ${getBarColor(meter.current, meter.limit)}`}
              style={{ width: getBarWidth(meter.current, meter.limit) }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
