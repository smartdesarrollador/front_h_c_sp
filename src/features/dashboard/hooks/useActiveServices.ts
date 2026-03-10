import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { TenantService } from '@/types/hub'

export function useActiveServices() {
  const { data, isLoading } = useQuery({
    queryKey: ['hub-active-services'],
    queryFn: () => apiClient.get<TenantService[]>('/app/services/active/').then((r) => r.data),
    staleTime: 60_000,
  })
  return { services: data ?? [], isLoading }
}
