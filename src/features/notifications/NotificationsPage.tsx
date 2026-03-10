import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHubNotifications } from './hooks/useHubNotifications'
import { useMarkAsRead } from './hooks/useMarkAsRead'
import { useMarkAllAsRead } from './hooks/useMarkAllAsRead'
import NotificationFilters from './components/NotificationFilters'
import NotificationItem from './components/NotificationItem'
import EmptyNotifications from './components/EmptyNotifications'
import type { NotificationFilter } from './types'

export default function NotificationsPage() {
  const { t } = useTranslation('hub')
  const { notifications, unreadCount, isLoading } = useHubNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all')

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? notifications
        : notifications.filter((n) => n.category === activeFilter),
    [notifications, activeFilter],
  )

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header + Marcar todo */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h1>
        <button
          onClick={() => markAllAsRead.mutate()}
          disabled={unreadCount === 0 || markAllAsRead.isPending}
          className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {markAllAsRead.isPending && (
            <span className="animate-spin w-3 h-3 border border-primary-600 border-t-transparent rounded-full" />
          )}
          {t('notifications.markAllRead')}
        </button>
      </div>

      {/* Filtros */}
      <NotificationFilters
        activeFilter={activeFilter}
        onChange={setActiveFilter}
        unreadCount={unreadCount}
      />

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {isLoading && (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse p-4 h-16 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </>
        )}
        {!isLoading && filtered.length === 0 && <EmptyNotifications filter={activeFilter} />}
        {!isLoading &&
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={(id) => markAsRead.mutate(id)}
            />
          ))}
      </div>
    </div>
  )
}
