export type TeamMemberStatus = 'active' | 'suspended' | 'pending'
export type TeamRole = 'owner' | 'admin' | 'member'

export interface TeamMember {
  id: string
  email: string
  name: string
  roles: string[]           // e.g. ['Owner'], ['OrgAdmin'], ['Member']
  is_active: boolean
  email_verified: boolean   // false = pending invitation
  created_at: string
}

export interface InviteTeamMemberRequest {
  email: string
  role: 'admin' | 'member'
}

export function getMemberStatus(m: TeamMember): TeamMemberStatus {
  if (!m.email_verified) return 'pending'
  return m.is_active ? 'active' : 'suspended'
}

export function getPrimaryRole(m: TeamMember): TeamRole {
  if (m.roles.includes('Owner')) return 'owner'
  if (m.roles.includes('OrgAdmin')) return 'admin'
  return 'member'
}
