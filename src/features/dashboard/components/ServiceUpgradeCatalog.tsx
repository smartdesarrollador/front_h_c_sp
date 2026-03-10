import { useQuery } from '@tanstack/react-query'
import { Globe, Layout, Monitor, Box, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiClient } from '@/lib/axios'
import type { TenantService } from '@/types/hub'

const SERVICE_ICONS: Record<string, LucideIcon> = {
  workspace: Layout,
  digital_services: Globe,
  desktop: Monitor,
  default: Box,
}

interface ServiceUpgradeCatalogProps {
  activeServiceIds: string[]
}

export function ServiceUpgradeCatalog({ activeServiceIds }: ServiceUpgradeCatalogProps) {
  const { data: catalog = [] } = useQuery({
    queryKey: ['hub-service-catalog'],
    queryFn: () => apiClient.get<TenantService[]>('/app/services/').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const upgradableServices = catalog.filter((s) => !activeServiceIds.includes(s.id))

  if (upgradableServices.length === 0) return null

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Más servicios disponibles
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Expande tu plataforma con servicios adicionales
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upgradableServices.map((service) => {
          const Icon = SERVICE_ICONS[service.slug] ?? SERVICE_ICONS.default
          return (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-5 flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>
              {service.required_plan && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">
                  Plan {service.required_plan} requerido
                </span>
              )}
              <Link
                to="/subscription"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 mt-auto"
              >
                Ver planes →
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
