import { useQuery } from '@tanstack/react-query'
import { publicClient } from '@/lib/axios'
import { PLANS as FALLBACK_PLANS } from '../plans-data'
import type { PlanData } from '../types'

interface ApiPlan {
  id: string
  display_name: string
  description: string
  price_monthly: number | null
  price_annual: number | null
  popular: boolean
  highlights: Array<{ label: string; included: boolean }>
}

function normalizePlan(raw: ApiPlan): PlanData {
  return {
    id: raw.id as PlanData['id'],
    displayName: raw.display_name,
    priceMonthly: raw.price_monthly ?? 0,
    priceAnnual: raw.price_annual ?? 0,
    description: raw.description,
    popular: raw.popular,
    features: raw.highlights,
  }
}

export function usePlans() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-plans'],
    queryFn: () =>
      publicClient
        .get<{ plans: ApiPlan[] }>('/public/plans/')
        .then((r) => r.data.plans.map(normalizePlan)),
    staleTime: 10 * 60 * 1000,
  })
  return { plans: data ?? FALLBACK_PLANS, isLoading, isError }
}
