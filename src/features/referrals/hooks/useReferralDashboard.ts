import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ReferralDashboard } from '../types'

export function useReferralDashboard() {
  const { data, isLoading } = useQuery<ReferralDashboard>({
    queryKey: ['hub-referrals'],
    queryFn: async () => {
      const res = await apiClient.get('/app/referrals/')
      return res.data
    },
    staleTime: 5 * 60_000,
  })
  return { dashboard: data ?? null, isLoading }
}
