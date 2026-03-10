import { Crown, Shield, User } from 'lucide-react'
import type { TeamRole } from '../types'

interface RoleBadgeProps {
  role: TeamRole
}

const ROLE_CONFIG = {
  owner: {
    label: 'Propietario',
    className: 'bg-purple-100 text-purple-800',
    Icon: Crown,
  },
  admin: {
    label: 'Administrador',
    className: 'bg-blue-100 text-blue-800',
    Icon: Shield,
  },
  member: {
    label: 'Miembro',
    className: 'bg-gray-100 text-gray-700',
    Icon: User,
  },
} as const

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.member
  const { Icon, label, className } = config

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <Icon size={12} />
      {label}
    </span>
  )
}
