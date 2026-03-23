import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BillingCycle, PlanType } from './types'
import { useCurrentSubscription } from './hooks/useCurrentSubscription'
import { useUpgradeSubscription } from './hooks/useUpgradeSubscription'
import { useCancelSubscription } from './hooks/useCancelSubscription'
import { usePlans } from './hooks/usePlans'
import CurrentPlanCard from './components/CurrentPlanCard'
import UsageMeters from './components/UsageMeters'
import PlanComparisonGrid from './components/PlanComparisonGrid'
import UpgradePlanModal from './components/UpgradePlanModal'
import CancelSubscriptionModal from './components/CancelSubscriptionModal'
import { usePermissions } from '@/hooks/usePermissions'

export default function SubscriptionPage() {
  const { t } = useTranslation('hub')
  const { subscription, isLoading } = useCurrentSubscription()
  const { canManageBilling, canUpgradePlan } = usePermissions()
  const { mutate: upgradePlan, isPending: upgrading } = useUpgradeSubscription()
  const { mutate: cancelPlan, isPending: canceling } = useCancelSubscription()
  const { plans } = usePlans()

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [upgradeTarget, setUpgradeTarget] = useState<PlanType | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const targetPlanData = upgradeTarget ? plans.find((p) => p.id === upgradeTarget) ?? null : null

  const handleUpgradeConfirm = () => {
    if (!upgradeTarget) return
    upgradePlan(
      { plan: upgradeTarget, billing_cycle: billingCycle },
      { onSuccess: () => setUpgradeTarget(null) },
    )
  }

  const handleCancelConfirm = (reason?: string) => {
    cancelPlan(
      { reason },
      { onSuccess: () => setShowCancelModal(false) },
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('subscription.title', 'Suscripción')}
        </h1>
        <p className="text-gray-500 mt-1">
          {t('subscription.subtitle', 'Gestiona tu plan y uso de la plataforma')}
        </p>
      </div>

      {!canManageBilling && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          Solo el Owner puede gestionar la suscripción.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentPlanCard
          subscription={subscription}
          isLoading={isLoading}
          canUpgradePlan={canUpgradePlan}
          onChangePlan={() => {
            const el = document.getElementById('plan-comparison')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
          onCancelRequest={() => setShowCancelModal(true)}
        />
        <UsageMeters usage={subscription?.usage ?? null} isLoading={isLoading} />
      </div>

      {canManageBilling && (
        <div id="plan-comparison">
          <PlanComparisonGrid
            plans={plans}
            currentPlan={subscription?.plan ?? 'free'}
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
            onUpgrade={setUpgradeTarget}
            canUpgrade={canUpgradePlan}
          />
        </div>
      )}

      <UpgradePlanModal
        targetPlan={targetPlanData}
        billingCycle={billingCycle}
        isOpen={upgradeTarget !== null}
        onClose={() => setUpgradeTarget(null)}
        onConfirm={handleUpgradeConfirm}
        isPending={upgrading}
      />
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        isPending={canceling}
      />
    </div>
  )
}
