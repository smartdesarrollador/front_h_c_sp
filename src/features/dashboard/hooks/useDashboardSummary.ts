import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { DashboardSummary, SubscriptionSummary, ReferralSummary } from '../types'

interface TicketsResponse {
  count: number
  results: Array<{ status: string }>
}

interface SubscriptionResponse {
  subscription: SubscriptionSummary
}

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 29,
  professional: 79,
  enterprise: 199,
}

export function useDashboardSummary(): DashboardSummary {
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['hub-subscription'],
    queryFn: () =>
      apiClient.get<SubscriptionResponse>('/admin/subscriptions/current').then((r) => ({
        ...r.data.subscription,
        plan_display: r.data.subscription.plan_display ?? r.data.subscription.plan,
        mrr: PLAN_PRICES[r.data.subscription.plan] ?? 0,
      })),
    staleTime: 60_000,
  })

  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['hub-open-tickets'],
    queryFn: async () => {
      try {
        const r = await apiClient.get<TicketsResponse>('/support/tickets/?status=open&per_page=1')
        return r.data
      } catch {
        return { count: 0, results: [] }
      }
    },
    staleTime: 60_000,
  })

  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['hub-referrals'],
    queryFn: async () => {
      try {
        const r = await apiClient.get<ReferralSummary>('/app/referrals/summary/')
        return r.data
      } catch {
        return null
      }
    },
    staleTime: 60_000,
  })

  return {
    subscription: subscription ?? null,
    support: { open_tickets: tickets?.count ?? 0, in_attention: 0 },
    referrals: referrals ?? null,
    isLoading: subLoading || ticketsLoading || referralsLoading,
  }
}
