import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { CurrentSubscription } from '../types'

export function useCurrentSubscription() {
  const { data, isLoading } = useQuery<CurrentSubscription>({
    queryKey: ['hub-subscription'],
    queryFn: async () => {
      const res = await apiClient.get<CurrentSubscription>('/admin/subscriptions/current/')
      return res.data
    },
    staleTime: 60_000,
  })

  return { subscription: data ?? null, isLoading }
}
