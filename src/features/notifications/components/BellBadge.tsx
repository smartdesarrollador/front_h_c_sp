import { Bell } from 'lucide-react'
import { useHubNotifications } from '../hooks/useHubNotifications'

export default function BellBadge() {
  const { unreadCount } = useHubNotifications()
  return (
    <div className="relative">
      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
          {unreadCount >= 10 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  )
}
