import { useTranslation } from 'react-i18next'
import { usePermissions } from '@/hooks/usePermissions'
import { useReferralDashboard } from './hooks/useReferralDashboard'
import ReferralStatsCards from './components/ReferralStatsCards'
import ReferralCodeBox from './components/ReferralCodeBox'
import ReferralLinkBox from './components/ReferralLinkBox'
import HowItWorksSteps from './components/HowItWorksSteps'
import ReferralHistoryTable from './components/ReferralHistoryTable'

export default function ReferralsPage() {
  const { t } = useTranslation('hub')
  const { hasPermission } = usePermissions()
  const { dashboard, isLoading } = useReferralDashboard()

  const canView = hasPermission('referrals.read')

  if (!canView) {
    return (
      <div className="p-8 text-center text-gray-500" data-testid="permission-denied">
        No tienes permiso para ver esta sección.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('referrals.title')}</h1>
        <p className="text-gray-500 mt-1">{t('referrals.subtitle')}</p>
      </div>

      <ReferralStatsCards stats={dashboard?.stats ?? null} isLoading={isLoading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{t('referrals.yourCode')}</h2>
          {dashboard ? (
            <ReferralCodeBox code={dashboard.code} />
          ) : (
            <div className="animate-pulse h-10 bg-gray-100 rounded" />
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{t('referrals.shareLink')}</h2>
          {dashboard ? (
            <ReferralLinkBox url={dashboard.referral_url} />
          ) : (
            <div className="animate-pulse h-10 bg-gray-100 rounded" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t('referrals.howItWorks')}</h2>
        <HowItWorksSteps />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t('referrals.history')}</h2>
        <ReferralHistoryTable
          referrals={dashboard?.referrals ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
