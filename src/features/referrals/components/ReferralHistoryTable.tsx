import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReferralItem } from '../types'

interface Props {
  referrals: ReferralItem[]
  isLoading: boolean
}

function maskEmail(value: string): string {
  if (!value.includes('@')) return value
  const [local, domain] = value.split('@')
  const prefix = local.substring(0, 2)
  return `${prefix}***@${domain}`
}

export default function ReferralHistoryTable({ referrals, isLoading }: Props) {
  const { t, i18n } = useTranslation('hub')

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-gray-500 font-medium">{t('referrals.colEmail')}</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">{t('referrals.colPlan')}</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">{t('referrals.colStatus')}</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">{t('referrals.colCredit')}</th>
            <th className="text-left py-2 px-3 text-gray-500 font-medium">{t('referrals.colDate')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <>
              {[0, 1, 2].map((i) => (
                <tr key={i} className="animate-pulse border-b border-gray-100">
                  <td className="py-3 px-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                  <td className="py-3 px-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                </tr>
              ))}
            </>
          )}
          {!isLoading && referrals.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <Users className="w-8 h-8" />
                  <span>No hay referidos aún</span>
                </div>
              </td>
            </tr>
          )}
          {!isLoading && referrals.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-3 text-gray-700">{maskEmail(item.tenant_name)}</td>
              <td className="py-3 px-3 text-gray-500">—</td>
              <td className="py-3 px-3">
                {item.status === 'active' ? (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {t('referrals.active')}
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {t('referrals.pending')}
                  </span>
                )}
              </td>
              <td className="py-3 px-3 text-gray-700">
                ${item.credit_amount.toFixed(2)} {t('referrals.creditUnit')}
              </td>
              <td className="py-3 px-3 text-gray-500">
                {new Date(item.created_at).toLocaleDateString(i18n.language)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
