import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Clock, Copy, KeyRound, Mail, RefreshCw, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMyLicense, useRequestLicense, useResendLicense } from '../hooks/useLicense'

const PAID_PLANS = ['starter', 'professional', 'enterprise']

export function LicenseKeySection() {
  const { t } = useTranslation('desktop')
  const navigate = useNavigate()
  const tenant = useAuthStore((s) => s.tenant)
  const plan = tenant?.plan ?? 'free'

  const { license, isLoading, notFound } = useMyLicense()
  const { mutate: request, isPending: isRequesting, data: requestResult } = useRequestLicense()
  const { mutate: resend, isPending: isResending, data: resendResult } = useResendLicense()

  const [copied, setCopied] = useState(false)

  const isPaidPlan = PAID_PLANS.includes(plan)

  const handleCopy = () => {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const statusIcon = () => {
    if (!license) return null
    if (license.status === 'active') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (license.status === 'revoked') return <XCircle className="h-4 w-4 text-red-500" />
    return <Clock className="h-4 w-4 text-yellow-500" />
  }

  const statusLabel = () => {
    if (!license) return ''
    if (license.status === 'active') return t('licenseActive')
    if (license.status === 'revoked') return t('licenseRevoked')
    return t('licensePending')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('licenseTitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('licenseSubtitle')}</p>
        </div>
      </div>

      {/* Plan free → upgrade CTA */}
      {!isPaidPlan && (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {t('licenseUpgradeRequired')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t('licenseUpgradeDesc')}
            </p>
          </div>
          <button
            onClick={() => navigate('/subscription')}
            className="flex-shrink-0 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('licenseUpgradeCta')}
          </button>
        </div>
      )}

      {/* Loading */}
      {isPaidPlan && isLoading && (
        <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
      )}

      {/* No license yet → request button */}
      {isPaidPlan && !isLoading && notFound && (
        <div className="text-center py-4">
          {requestResult ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              {t('licenseSentTo', { email: requestResult.sent_to })}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('licenseNoKeyYet')}
              </p>
              <button
                onClick={() => request()}
                disabled={isRequesting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
              >
                <Mail className="h-4 w-4" />
                {isRequesting ? t('licenseSending') : t('licenseSendKey')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Has license */}
      {isPaidPlan && !isLoading && license && (
        <div className="space-y-4">
          {/* Key display */}
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white tracking-widest flex-1">
              {license.license_key}
            </span>
            <button
              onClick={handleCopy}
              title={t('licenseCopy')}
              aria-label={t('licenseCopy')}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {copied && (
            <p className="text-xs text-green-600 dark:text-green-400 -mt-2">
              {t('licenseCopied')}
            </p>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {statusIcon()}
            <span className="text-gray-700 dark:text-gray-300">{statusLabel()}</span>
            {license.activated_at && (
              <span className="text-gray-400 dark:text-gray-500 text-xs">
                · {new Date(license.activated_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Actions */}
          {license.is_active && (
            <div className="flex items-center gap-3 pt-1">
              {resendResult ? (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  {t('licenseSentTo', { email: resendResult.sent_to })}
                </span>
              ) : (
                <button
                  onClick={() => resend()}
                  disabled={isResending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-60 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isResending ? t('licenseSending') : t('licenseResend')}
                </button>
              )}
            </div>
          )}

          {license.status === 'revoked' && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {t('licenseRevokedDesc')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
