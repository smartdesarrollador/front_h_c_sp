import { Share2, UserCheck, Gift, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function HowItWorksSteps() {
  const { t } = useTranslation('hub')

  const steps = [
    {
      icon: Share2,
      title: t('referrals.step1Title'),
      desc: t('referrals.step1Desc'),
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: UserCheck,
      title: t('referrals.step2Title'),
      desc: t('referrals.step2Desc'),
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Gift,
      title: t('referrals.step3Title'),
      desc: t('referrals.step3Desc'),
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      {steps.map(({ icon: Icon, title, desc, color, bg }, idx) => (
        <div key={title} className="flex md:flex-1 items-start md:items-center gap-4 w-full">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className={`${bg} ${color} p-4 rounded-xl`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <ArrowRight className="hidden md:block w-5 h-5 text-gray-300 flex-shrink-0 mt-4" />
          )}
        </div>
      ))}
    </div>
  )
}
