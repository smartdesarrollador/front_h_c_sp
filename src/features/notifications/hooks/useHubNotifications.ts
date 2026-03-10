import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { HubNotification } from '../types'

export function useHubNotifications() {
  const { data, isLoading } = useQuery<HubNotification[]>({
    queryKey: ['hub-notifications'],
    queryFn: async () => {
      const res = await apiClient.get('/app/notifications/')
      return Array.isArray(res.data) ? res.data : (res.data.results ?? [])
    },
    staleTime: 0,
    refetchInterval: 60_000,
  })
  const notifications = data ?? []
  const unreadCount = notifications.filter((n) => !n.read).length
  return { notifications, unreadCount, isLoading }
}
