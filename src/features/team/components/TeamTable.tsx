import { useState } from 'react'
import { Users } from 'lucide-react'
import type { TeamMember, TeamMemberStatus } from '../types'
import { getMemberStatus, getPrimaryRole } from '../types'
import { RoleBadge } from './RoleBadge'
import { useSuspendTeamMember } from '../hooks/useSuspendTeamMember'
import { useRemoveTeamMember } from '../hooks/useRemoveTeamMember'

interface TeamTableProps {
  members: TeamMember[]
  isLoading: boolean
  canSuspend: boolean
  canDelete: boolean
}

const STATUS_CONFIG: Record<TeamMemberStatus, { label: string; className: string }> = {
  active: { label: 'Activo', className: 'bg-green-100 text-green-800' },
  suspended: { label: 'Suspendido', className: 'bg-red-100 text-red-800' },
  pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
}

const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
]

function MemberAvatar({ name }: { name: string }) {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'
  const colorClass = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div
      className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface RowActionsProps {
  member: TeamMember
  canSuspend: boolean
  canDelete: boolean
}

function RowActions({ member, canSuspend, canDelete }: RowActionsProps) {
  const [confirming, setConfirming] = useState(false)
  const suspend = useSuspendTeamMember()
  const remove = useRemoveTeamMember()

  const role = getPrimaryRole(member)
  if (role === 'owner') return null

  const isActive = member.is_active

  return (
    <div className="flex items-center gap-1 justify-end">
      {canSuspend && (
        <button
          onClick={() => suspend.mutate({ id: member.id, active: !isActive })}
          disabled={suspend.isPending}
          className="text-xs px-2 py-1 rounded text-gray-500 hover:text-yellow-700 hover:bg-yellow-50 transition-colors disabled:opacity-50"
        >
          {isActive ? 'Suspender' : 'Reactivar'}
        </button>
      )}
      {canDelete && (
        confirming ? (
          <span className="flex items-center gap-1">
            <button
              onClick={() => remove.mutate(member.id)}
              disabled={remove.isPending}
              className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              Confirmar
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs px-2 py-1 rounded text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs px-2 py-1 rounded text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            Eliminar
          </button>
        )
      )}
    </div>
  )
}

export function TeamTable({ members, isLoading, canSuspend, canDelete }: TeamTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Miembro
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-32" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded w-20" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded w-16" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </td>
                <td className="py-3 px-4" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Users size={40} className="mb-3 opacity-40" />
        <p className="text-sm">No hay miembros aún</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Miembro
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {members.map((m) => {
            const status = getMemberStatus(m)
            const role = getPrimaryRole(m)
            const statusConfig = STATUS_CONFIG[status]
            return (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={m.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                      <p className="text-xs text-gray-500 truncate">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <RoleBadge role={role} />
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(m.created_at)}
                </td>
                <td className="py-3 px-4">
                  <RowActions member={m} canSuspend={canSuspend} canDelete={canDelete} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
