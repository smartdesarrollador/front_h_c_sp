import { Layout, Globe, Monitor, Box, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SSOLaunchButton } from './SSOLaunchButton'
import { ServiceStatusBadge } from './ServiceStatusBadge'
import type { TenantService } from '@/types/hub'

const SERVICE_ICONS: Record<string, LucideIcon> = {
  workspace: Layout,
  digital_services: Globe,
  desktop: Monitor,
}

interface ServiceCardProps {
  service: TenantService
  variant?: 'active' | 'upgrade'
}

export function ServiceCard({ service, variant = 'active' }: ServiceCardProps) {
  const navigate = useNavigate()
  const Icon = SERVICE_ICONS[service.slug] ?? Box

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border p-5 flex flex-col gap-4
        ${variant === 'upgrade'
          ? 'border-dashed border-gray-300 dark:border-gray-600'
          : 'border-gray-200 dark:border-gray-700'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-lg ${variant === 'upgrade'
              ? 'bg-gray-100 dark:bg-gray-700'
              : 'bg-primary-50 dark:bg-primary-900/20'}`}
          >
            <Icon
              className={`h-5 w-5 ${variant === 'upgrade' ? 'text-gray-400' : 'text-primary-600'}`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
            {service.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                {service.description}
              </p>
            )}
          </div>
        </div>
        <ServiceStatusBadge status={service.status} />
      </div>

      {service.last_accessed && service.status === 'active' && (
        <p className="text-xs text-gray-400">Último acceso: {service.last_accessed}</p>
      )}

      <div className="mt-auto">
        {service.status === 'active' && <SSOLaunchButton serviceSlug={service.slug} />}
        {service.status === 'suspended' && (
          <button
            disabled
            className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed w-full"
          >
            Suspendido
          </button>
        )}
        {(service.status === 'locked' || variant === 'upgrade') && (
          <div className="flex flex-col gap-2">
            {service.required_plan && (
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">
                Plan {service.required_plan} requerido
              </span>
            )}
            <button
              onClick={() => navigate('/subscription')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Ver planes
            </button>
          </div>
        )}
        {service.status === 'coming_soon' && (
          <span className="inline-block px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-sm rounded-lg">
            Próximamente
          </span>
        )}
      </div>
    </div>
  )
}
