import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ServiceStatusBanner() {
  const { t } = useTranslation('hub')
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">{t('support.serviceStatus')}:</span>
      <span>{t('support.serviceStatusOk')}</span>
    </div>
  )
}
