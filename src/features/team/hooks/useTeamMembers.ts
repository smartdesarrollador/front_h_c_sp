import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { TeamMember } from '../types'
import { getMemberStatus } from '../types'

export function useTeamMembers() {
  const { data, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['hub-team-members'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users/')
      // Support both array and { users: [...] } response shapes
      const raw = res.data
      return Array.isArray(raw) ? raw : (raw.users ?? [])
    },
    staleTime: 60_000,
  })

  const members = data ?? []
  const activeMembers = members.filter((m) => getMemberStatus(m) !== 'pending')
  const pendingMembers = members.filter((m) => getMemberStatus(m) === 'pending')

  return { members, activeMembers, pendingMembers, isLoading }
}
