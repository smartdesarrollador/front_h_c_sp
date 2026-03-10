import { Users, DollarSign, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReferralStats } from '../types'

interface Props {
  stats: ReferralStats | null
  isLoading: boolean
}

export default function ReferralStatsCards({ stats, isLoading }: Props) {
  const { t } = useTranslation('hub')

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-200 p-6 h-24" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: t('referrals.referred'),
      value: stats?.referred ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t('referrals.earned'),
      value: `$${stats?.credits_earned ?? 0}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: t('referrals.balance'),
      value: `$${stats?.available_credits ?? 0}`,
      icon: Wallet,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
          <div className={`${bg} ${color} p-3 rounded-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
