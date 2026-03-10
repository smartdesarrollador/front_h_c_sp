import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { BillingCycle, PlanType } from '../types'

interface UpgradeInput {
  plan: PlanType
  billing_cycle: BillingCycle
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpgradeInput) =>
      apiClient.post('/admin/subscriptions/upgrade/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hub-subscription'] })
    },
  })
}
