import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/app/notifications/${id}/read/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hub-notifications'] }),
  })
}
