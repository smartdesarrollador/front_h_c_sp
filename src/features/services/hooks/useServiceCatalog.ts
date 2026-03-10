import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { TenantService } from '@/types/hub'

export function useServiceCatalog() {
  const { data, isLoading } = useQuery({
    queryKey: ['hub-service-catalog'],
    queryFn: () => apiClient.get<TenantService[]>('/app/services/').then((r) => r.data),
    staleTime: 5 * 60_000,
  })
  return { catalog: data ?? [], isLoading }
}
