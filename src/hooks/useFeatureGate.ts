import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

interface FeaturesResponse {
  plan: string
  features: Record<string, boolean>
  limits: {
    users: number | null
    projects: number | null
    storage_gb: number | null
    api_calls_per_month: number | null
  }
}

export function useFeatureGate() {
  const { data } = useQuery({
    queryKey: ['plan-features'],
    queryFn: () => apiClient.get<FeaturesResponse>('/features/').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const hasFeature = (feature: string): boolean => Boolean(data?.features[feature])

  const getLimit = (key: keyof FeaturesResponse['limits']): number | null =>
    data?.limits[key] ?? null

  return {
    hasFeature,
    getLimit,
    plan: data?.plan,
    isLoading: !data,
  }
}
