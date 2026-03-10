import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { NewTicketRequest } from '../types'

export function useCreateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NewTicketRequest) => apiClient.post('/support/tickets/', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hub-support-tickets'] }),
  })
}
