import { useState } from 'react'
import { Link, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  url: string
}

export default function ReferralLinkBox({ url }: Props) {
  const { t } = useTranslation('hub')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex items-center gap-3 border rounded-lg p-3 transition-colors ${copied ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <input
        type="text"
        readOnly
        value={url}
        className="flex-1 text-sm text-gray-600 bg-transparent outline-none truncate"
        aria-label="Referral link"
      />
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap"
        aria-label={copied ? '¡Copiado! ✓' : t('referrals.shareLink')}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        {copied ? '¡Copiado! ✓' : t('referrals.shareLink')}
      </button>
    </div>
  )
}
