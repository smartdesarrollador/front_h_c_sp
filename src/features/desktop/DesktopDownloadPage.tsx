import { useTranslation } from 'react-i18next'
import { MonitorDown } from 'lucide-react'
import { useLatestReleases } from './hooks/useLatestReleases'
import { PlatformDownloadCard } from './components/PlatformDownloadCard'
import { LicenseKeySection } from './components/LicenseKeySection'
import type { ReleasePlatform, DesktopRelease } from './types'

const PLATFORMS: ReleasePlatform[] = ['windows', 'macos', 'linux']

const STEPS = ['step1', 'step2', 'step3'] as const

const REQUIREMENTS: Record<ReleasePlatform, string> = {
  windows: 'reqWindows',
  macos: 'reqMacos',
  linux: 'reqLinux',
}

export default function DesktopDownloadPage() {
  const { t } = useTranslation('desktop')
  const { releases, isLoading } = useLatestReleases()

  const releaseByPlatform = releases.reduce<Record<string, DesktopRelease>>((acc, r) => {
    acc[r.platform] = r
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <MonitorDown className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('subtitle')}</p>
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => (
          <PlatformDownloadCard
            key={platform}
            platform={platform}
            release={releaseByPlatform[platform]}
            isLoading={isLoading}
            featured={platform === 'windows'}
          />
        ))}
      </div>

      {/* How to install */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('howToInstall')}
        </h2>
        <ol className="space-y-3">
          {STEPS.map((key, idx) => (
            <li key={key} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 pt-0.5">{t(key)}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* System requirements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('requirements')}
        </h2>
        <ul className="space-y-2">
          {PLATFORMS.map((platform) => (
            <li key={platform} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
              {t(REQUIREMENTS[platform])}
            </li>
          ))}
        </ul>
      </div>

      {/* License Key section */}
      <LicenseKeySection />
    </div>
  )
}
