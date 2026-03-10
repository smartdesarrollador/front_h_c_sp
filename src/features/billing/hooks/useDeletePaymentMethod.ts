import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/billing/payment-methods/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hub-payment-methods'] }),
  })
}
