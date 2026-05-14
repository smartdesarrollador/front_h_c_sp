import { Download, Monitor, Laptop, Terminal, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DesktopRelease, ReleasePlatform } from '../types'

interface PlatformDownloadCardProps {
  platform: ReleasePlatform
  release: DesktopRelease | undefined
  isLoading: boolean
  featured?: boolean
}

const PLATFORM_CONFIG: Record<
  ReleasePlatform,
  { icon: React.ElementType; label: string; accent: string; bgAccent: string }
> = {
  windows: {
    icon: Monitor,
    label: 'Windows',
    accent: 'border-blue-500',
    bgAccent: 'bg-blue-500',
  },
  macos: {
    icon: Laptop,
    label: 'macOS',
    accent: 'border-gray-500',
    bgAccent: 'bg-gray-500',
  },
  linux: {
    icon: Terminal,
    label: 'Linux',
    accent: 'border-orange-500',
    bgAccent: 'bg-orange-500',
  },
}

export function PlatformDownloadCard({
  platform,
  release,
  isLoading,
  featured = false,
}: PlatformDownloadCardProps) {
  const { t } = useTranslation('desktop')
  const config = PLATFORM_CONFIG[platform]
  const Icon = config.icon
  const available = !!release

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-6 flex flex-col transition-shadow hover:shadow-md ${
        featured && available
          ? `${config.accent}`
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            available ? config.bgAccent : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{config.label}</h3>
          {featured && available && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Recomendado
            </span>
          )}
        </div>
      </div>

      {/* Release info */}
      <div className="flex-1 mb-4">
        {available ? (
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                {t('version')} {release.version}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('size')}: {release.file_size_mb} MB
            </p>
            {release.release_notes && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">
                {release.release_notes}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <Clock className="w-4 h-4" />
            <p className="text-sm">{t('comingSoon')}</p>
          </div>
        )}
      </div>

      {/* Download button */}
      {available ? (
        <a
          href={release.file_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          {t('download')}
        </a>
      ) : (
        <button
          disabled
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
        >
          <Clock className="w-4 h-4" />
          {t('comingSoon')}
        </button>
      )}
    </div>
  )
}
