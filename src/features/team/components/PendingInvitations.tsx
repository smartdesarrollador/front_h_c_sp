import { Clock, Mail } from 'lucide-react'
import type { TeamMember } from '../types'
import { getPrimaryRole } from '../types'
import { RoleBadge } from './RoleBadge'
import { useRemoveTeamMember } from '../hooks/useRemoveTeamMember'

interface PendingInvitationsProps {
  members: TeamMember[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function PendingInvitations({ members }: PendingInvitationsProps) {
  const remove = useRemoveTeamMember()

  if (members.length === 0) return null

  return (
    <section aria-labelledby="pending-invitations-heading">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-yellow-500" />
        <h2
          id="pending-invitations-heading"
          className="text-lg font-semibold text-gray-900"
        >
          Invitaciones pendientes
        </h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {members.map((m) => {
          const role = getPrimaryRole(m)
          return (
            <div key={m.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 truncate">{m.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      Invitado el {formatDate(m.created_at)}
                    </span>
                    <RoleBadge role={role} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => remove.mutate(m.id)}
                disabled={remove.isPending}
                className="text-xs text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 whitespace-nowrap ml-4"
              >
                Cancelar invitacion
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
