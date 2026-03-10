import { Layout, Globe, Monitor, Box, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { TenantService } from '@/types/hub'
import { SSOLaunchButton } from '@/features/services/components/SSOLaunchButton'

const SERVICE_ICONS: Record<string, LucideIcon> = {
  workspace: Layout,
  digital_services: Globe,
  desktop: Monitor,
  default: Box,
}

interface ServiceCardProps {
  service: TenantService
}

function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate()
  const Icon = SERVICE_ICONS[service.slug] ?? SERVICE_ICONS.default

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{service.name}</h3>
          {service.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {service.description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-auto">
        {service.status === 'active' && <SSOLaunchButton serviceSlug={service.slug} />}
        {service.status === 'suspended' && (
          <button
            disabled
            className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            Suspendido
          </button>
        )}
        {service.status === 'locked' && (
          <button
            onClick={() => navigate('/subscription')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Actualizar Plan
          </button>
        )}
        {service.status === 'coming_soon' && (
          <span className="inline-block px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-lg">
            Próximamente
          </span>
        )}
      </div>
    </div>
  )
}

interface ActiveServicesListProps {
  services: TenantService[]
  isLoading: boolean
}

export function ActiveServicesList({ services, isLoading }: ActiveServicesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Box className="h-10 w-10 mb-3" />
        <p className="text-sm">No tienes servicios activos aún.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
