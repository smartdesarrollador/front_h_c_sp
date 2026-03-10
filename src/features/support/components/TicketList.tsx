import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { HubTicket, TicketCategory, TicketStatus } from '../types'
import TicketStatusBadge from './TicketStatusBadge'
import TicketPriorityBadge from './TicketPriorityBadge'

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  billing: 'support.categoryBilling',
  technical: 'support.categoryTechnical',
  account: 'support.categoryAccount',
  general: 'support.categoryGeneral',
}

interface Props {
  tickets: HubTicket[]
  isLoading: boolean
  selectedId: string | null
  onSelect: (ticket: HubTicket) => void
}

export default function TicketList({ tickets, isLoading, selectedId, onSelect }: Props) {
  const { t } = useTranslation('hub')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all')

  const filtered = tickets.filter(ticket => {
    const matchSearch = ticket.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchSearch && matchStatus
  })

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="p-4 border-b border-gray-100 flex gap-3">
        <input
          type="text"
          placeholder="Buscar tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as 'all' | TicketStatus)}
          aria-label={t('support.allStatuses')}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">{t('support.allStatuses')}</option>
          <option value="open">{t('support.statusOpen')}</option>
          <option value="in_progress">{t('support.statusInProgress')}</option>
          <option value="resolved">{t('support.statusResolved')}</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <MessageCircle className="w-10 h-10 mb-2" />
          <p className="text-sm">{t('support.noTickets')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {filtered.map(ticket => (
            <li
              key={ticket.id}
              onClick={() => onSelect(ticket)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === ticket.id ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">#{ticket.reference}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex gap-1">
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
