import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useSetDefaultMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(`/admin/billing/payment-methods/${id}/`, { is_default: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hub-payment-methods'] }),
  })
}
