import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  code: string
}

export default function ReferralCodeBox({ code }: Props) {
  const { t } = useTranslation('hub')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex items-center gap-3 border rounded-lg p-3 transition-colors ${copied ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <span className="font-mono text-lg font-bold text-gray-900 flex-1 tracking-widest">{code}</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        aria-label={copied ? t('referrals.copied') : t('referrals.copyCode')}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? `${t('referrals.copied')} ✓` : t('referrals.copyCode')}
      </button>
    </div>
  )
}
