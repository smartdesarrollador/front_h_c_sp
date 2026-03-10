import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.post('/app/notifications/read-all/'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hub-notifications'] }),
  })
}
