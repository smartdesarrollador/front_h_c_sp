import { CreditCard, Shield, Layers, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { HubNotification, NotificationCategory } from '../types'

export const ICON_MAP: Record<NotificationCategory, React.ElementType> = {
  billing: CreditCard,
  security: Shield,
  services: Layers,
  system: Settings,
}

export const CATEGORY_COLORS: Record<NotificationCategory, string> = {
  billing: 'text-green-600 bg-green-50',
  security: 'text-red-600 bg-red-50',
  services: 'text-blue-600 bg-blue-50',
  system: 'text-gray-600 bg-gray-50',
}

export function timeAgo(created_at: string, t: TFunction): string {
  const diff = Math.floor((Date.now() - new Date(created_at).getTime()) / 1000)
  if (diff < 60) return t('notifications.justNow')
  if (diff < 3600) return t('notifications.minAgo').replace('{n}', String(Math.floor(diff / 60)))
  if (diff < 86400) return t('notifications.hoursAgo').replace('{n}', String(Math.floor(diff / 3600)))
  return t('notifications.daysAgo').replace('{n}', String(Math.floor(diff / 86400)))
}

interface Props {
  notification: HubNotification
  onMarkRead: (id: string) => void
}

export default function NotificationItem({ notification, onMarkRead }: Props) {
  const { t } = useTranslation('hub')
  const Icon = ICON_MAP[notification.category]
  const colorClass = CATEGORY_COLORS[notification.category]

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.created_at, t)}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5" />
      )}
    </div>
  )
}
