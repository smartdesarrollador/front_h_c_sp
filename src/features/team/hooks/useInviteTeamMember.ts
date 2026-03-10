import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { InviteTeamMemberRequest, TeamMember } from '../types'

export function useInviteTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: InviteTeamMemberRequest): Promise<TeamMember> => {
      const res = await apiClient.post<TeamMember>('/admin/users/invite/', payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hub-team-members'] })
    },
  })
}
