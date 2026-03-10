import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { DashboardSummary, SubscriptionSummary, ReferralSummary } from '../types'

interface TicketsResponse {
  count: number
  results: Array<{ status: string }>
}

export function useDashboardSummary(): DashboardSummary {
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['hub-subscription'],
    queryFn: () =>
      apiClient.get<SubscriptionSummary>('/admin/subscriptions/current/').then((r) => r.data),
    staleTime: 60_000,
  })

  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['hub-open-tickets'],
    queryFn: () =>
      apiClient
        .get<TicketsResponse>('/support/tickets/?status=open&per_page=1')
        .then((r) => r.data),
    staleTime: 60_000,
  })

  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['hub-referrals'],
    queryFn: () =>
      apiClient.get<ReferralSummary>('/app/referrals/summary/').then((r) => r.data),
    staleTime: 60_000,
  })

  return {
    subscription: subscription ?? null,
    support: { open_tickets: tickets?.count ?? 0, in_attention: 0 },
    referrals: referrals ?? null,
    isLoading: subLoading || ticketsLoading || referralsLoading,
  }
}
