import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { PaymentMethod } from '../types'

export function usePaymentMethods() {
  const { data, isLoading } = useQuery({
    queryKey: ['hub-payment-methods'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/billing/payment-methods/')
      return res.data.payment_methods as PaymentMethod[]
    },
    staleTime: 300_000,
  })
  return { methods: data ?? [], isLoading }
}
