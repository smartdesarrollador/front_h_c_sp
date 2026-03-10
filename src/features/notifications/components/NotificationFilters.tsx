import { useTranslation } from 'react-i18next'
import type { NotificationFilter } from '../types'

export const FILTER_LABELS: Record<NotificationFilter, string> = {
  all: 'notifications.all',
  billing: 'notifications.billing',
  security: 'notifications.security',
  services: 'notifications.services',
  system: 'notifications.system',
}

const FILTERS: NotificationFilter[] = ['all', 'billing', 'security', 'services', 'system']

interface Props {
  activeFilter: NotificationFilter
  onChange: (f: NotificationFilter) => void
  unreadCount: number
}

export default function NotificationFilters({ activeFilter, onChange, unreadCount: _unreadCount }: Props) {
  const { t } = useTranslation('hub')
  return (
    <div role="tablist" className="flex items-center gap-2 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          role="tab"
          aria-selected={activeFilter === filter}
          onClick={() => onChange(filter)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t(FILTER_LABELS[filter])}
        </button>
      ))}
    </div>
  )
}
