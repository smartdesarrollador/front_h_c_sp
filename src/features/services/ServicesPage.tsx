import { useTranslation } from 'react-i18next'
import { Box } from 'lucide-react'
import { useActiveServices } from './hooks/useActiveServices'
import { useServiceCatalog } from './hooks/useServiceCatalog'
import { ServiceCard } from './components/ServiceCard'

export default function ServicesPage() {
  const { t } = useTranslation('hub')
  const { services: activeServices, isLoading: activeLoading } = useActiveServices()
  const { catalog, isLoading: catalogLoading } = useServiceCatalog()

  const activeServiceIds = new Set(activeServices.map((s) => s.id))
  const upgradeServices = catalog.filter((s) => !activeServiceIds.has(s.id))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('serviceCatalog.activeTitle', 'Tus servicios activos')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Accede y gestiona tus servicios contratados
        </p>
      </div>

      <section aria-label="Servicios activos">
        {activeLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : activeServices.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Box className="h-10 w-10 mb-3" />
            <p className="text-sm">No tienes servicios activos aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeServices.map((s) => (
              <ServiceCard key={s.id} service={s} variant="active" />
            ))}
          </div>
        )}
      </section>

      {!catalogLoading && upgradeServices.length > 0 && (
        <section aria-label="Servicios disponibles para upgrade">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('serviceCatalog.unavailableTitle', 'Más servicios disponibles')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {t('serviceCatalog.unavailableSub', 'Actualiza tu plan para desbloquear estos servicios')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upgradeServices.map((s) => (
              <ServiceCard key={s.id} service={s} variant="upgrade" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
