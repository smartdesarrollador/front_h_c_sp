import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export interface SuspendTeamMemberInput {
  id: string
  active: boolean
}

export function useSuspendTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, active }: SuspendTeamMemberInput): Promise<void> => {
      await apiClient.post(`/admin/users/${id}/suspend/`, { active })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hub-team-members'] })
    },
  })
}
