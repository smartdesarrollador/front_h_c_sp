import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { HubTicketDetail } from '../types'

export function useTicketDetail(id: string | null) {
  const { data, isLoading } = useQuery<HubTicketDetail>({
    queryKey: ['hub-support-ticket', id],
    queryFn: async () => {
      const res = await apiClient.get(`/support/tickets/${id}/`)
      return res.data
    },
    enabled: !!id,
    staleTime: 30_000,
  })
  return { ticket: data ?? null, isLoading }
}
