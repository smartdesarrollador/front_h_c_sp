import type { ServiceStatus } from '@/types/hub'

const STATUS_CONFIG: Record<ServiceStatus, { label: string; className: string }> = {
  active:      { label: 'Activo',       className: 'bg-green-100 text-green-700' },
  suspended:   { label: 'Suspendido',   className: 'bg-gray-100 text-gray-500' },
  locked:      { label: 'Bloqueado',    className: 'bg-yellow-100 text-yellow-700' },
  coming_soon: { label: 'Próximamente', className: 'bg-blue-100 text-blue-600' },
}

export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  )
}
