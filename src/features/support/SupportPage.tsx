import { useState } from 'react'
import type { ElementType } from 'react'
import { Plus, Ticket, CircleAlert, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMyTickets } from './hooks/useMyTickets'
import ServiceStatusBanner from './components/ServiceStatusBanner'
import TicketList from './components/TicketList'
import NewTicketModal from './components/NewTicketModal'
import TicketDetailView from './components/TicketDetailView'
import type { HubTicket } from './types'

interface KpiCardProps {
  label: string
  value: number
  icon: ElementType
  color?: 'default' | 'blue' | 'yellow'
}

function KpiCard({ label, value, icon: Icon, color = 'default' }: KpiCardProps) {
  const colorMap = {
    default: 'bg-gray-50 text-gray-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function SupportPage() {
  const { t } = useTranslation('hub')
  const { tickets, isLoading } = useMyTickets()
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  const total = tickets.length
  const openCount = tickets.filter(tk => tk.status === 'open').length
  const inProgressCount = tickets.filter(tk => tk.status === 'in_progress').length

  return (
    <div className="space-y-6">
      <ServiceStatusBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('support.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t('support.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('support.newTicket')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label={t('support.myTickets')} value={total} icon={Ticket} />
        <KpiCard label={t('support.open')} value={openCount} icon={CircleAlert} color="blue" />
        <KpiCard label={t('support.inProgress')} value={inProgressCount} icon={Clock} color="yellow" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <TicketList
          tickets={tickets}
          isLoading={isLoading}
          selectedId={selectedTicketId}
          onSelect={(ticket: HubTicket) => setSelectedTicketId(ticket.id)}
        />
      </div>

      <TicketDetailView
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
      />

      <NewTicketModal open={showNewModal} onClose={() => setShowNewModal(false)} />
    </div>
  )
}
