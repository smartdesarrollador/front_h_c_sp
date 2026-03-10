import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { HubTicket } from '../types'

export function useMyTickets() {
  const { data, isLoading } = useQuery<HubTicket[]>({
    queryKey: ['hub-support-tickets'],
    queryFn: async () => {
      const res = await apiClient.get('/support/tickets/')
      return Array.isArray(res.data) ? res.data : (res.data.results ?? [])
    },
    staleTime: 30_000,
  })
  return { tickets: data ?? [], isLoading }
}
