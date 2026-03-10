import { Package, CreditCard, LifeBuoy, Users, ChevronRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardSummary } from '../types'

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  linkTo: string
  linkLabel: string
  color: string
  isLoading: boolean
}

const COLOR_CLASSES: Record<string, { bg: string; icon: string; link: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600',
    link: 'text-blue-600 hover:text-blue-700',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600',
    link: 'text-green-600 hover:text-green-700',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'text-yellow-600',
    link: 'text-yellow-600 hover:text-yellow-700',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600',
    link: 'text-purple-600 hover:text-purple-700',
  },
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  linkTo,
  linkLabel,
  color,
  isLoading,
}: SummaryCardProps) {
  const colors = COLOR_CLASSES[color] ?? COLOR_CLASSES.blue

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`h-4 w-4 ${colors.icon}`} />
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <Link
        to={linkTo}
        className={`flex items-center gap-1 text-sm font-medium ${colors.link} mt-auto`}
      >
        {linkLabel}
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

interface SummaryCardsProps {
  summary: DashboardSummary
  canManageBilling: boolean
}

export function SummaryCards({ summary, canManageBilling }: SummaryCardsProps) {
  const { t } = useTranslation('dashboard')
  const { subscription, support, referrals, isLoading } = summary

  const planValue = subscription?.plan_display ?? '-'
  const planSub = subscription?.next_billing_date
    ? `Renovación: ${new Date(subscription.next_billing_date).toLocaleDateString('es-ES')}`
    : undefined

  const billingValue = subscription ? `$${subscription.mrr}/mes` : '-'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        icon={Package}
        label={t('planLabel')}
        value={planValue}
        sub={planSub}
        linkTo="/subscription"
        linkLabel={t('billingAction')}
        color="blue"
        isLoading={isLoading}
      />
      {canManageBilling && (
        <SummaryCard
          icon={CreditCard}
          label={t('billingLabel')}
          value={billingValue}
          linkTo="/billing"
          linkLabel={t('invoicesAction')}
          color="green"
          isLoading={isLoading}
        />
      )}
      <SummaryCard
        icon={LifeBuoy}
        label={t('supportLabel')}
        value={String(support.open_tickets)}
        sub={support.open_tickets === 1 ? t('supportOpen') : t('supportOpenPlural')}
        linkTo="/support"
        linkLabel={t('supportAction')}
        color="yellow"
        isLoading={isLoading}
      />
      {canManageBilling && referrals && (
        <SummaryCard
          icon={Users}
          label="Referidos"
          value={String(referrals.active_referrals)}
          sub={`$${referrals.earned_credits} en créditos`}
          linkTo="/referrals"
          linkLabel="Ver programa"
          color="purple"
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
