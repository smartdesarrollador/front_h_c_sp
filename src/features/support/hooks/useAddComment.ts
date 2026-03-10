import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useAddComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ticket_id, message }: { ticket_id: string; message: string }) =>
      apiClient.post(`/support/tickets/${ticket_id}/comments/`, { message }),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: ['hub-support-ticket', variables.ticket_id] }),
  })
}
