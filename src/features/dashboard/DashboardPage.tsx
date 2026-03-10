import { useTranslation } from 'react-i18next'
import { usePermissions } from '@/hooks/usePermissions'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { useDashboardSummary } from './hooks/useDashboardSummary'
import { useActiveServices } from './hooks/useActiveServices'
import { SummaryCards } from './components/SummaryCards'
import { ActiveServicesList } from './components/ActiveServicesList'
import { ServiceUpgradeCatalog } from './components/ServiceUpgradeCatalog'
import { PlanUsageBanner } from './components/PlanUsageBanner'

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const { canManageBilling } = usePermissions()
  const { getLimit } = useFeatureGate()
  const summary = useDashboardSummary()
  const { services, isLoading: servicesLoading } = useActiveServices()

  const limitUsers = getLimit('users')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('welcome')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('accountSummary')}</p>
      </div>

      <PlanUsageBanner currentUsers={0} limitUsers={limitUsers} />

      <SummaryCards summary={summary} canManageBilling={canManageBilling} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('myServices')}</h2>
        <ActiveServicesList services={services} isLoading={servicesLoading} />
      </section>

      <ServiceUpgradeCatalog activeServiceIds={services.map((s) => s.id)} />
    </div>
  )
}
