import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useAddPaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post('/admin/billing/payment-methods/', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hub-payment-methods'] }),
  })
}
