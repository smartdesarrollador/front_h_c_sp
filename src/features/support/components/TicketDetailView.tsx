import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTicketDetail } from '../hooks/useTicketDetail'
import { useAddComment } from '../hooks/useAddComment'
import TicketStatusBadge from './TicketStatusBadge'
import TicketPriorityBadge from './TicketPriorityBadge'
import { CATEGORY_LABELS } from './TicketList'

interface Props {
  ticketId: string | null
  onClose: () => void
}

export default function TicketDetailView({ ticketId, onClose }: Props) {
  const { t } = useTranslation('hub')
  const { ticket, isLoading } = useTicketDetail(ticketId)
  const addComment = useAddComment()
  const [reply, setReply] = useState('')

  if (!ticketId) return null

  const handleSendComment = () => {
    if (!reply.trim() || !ticketId) return
    addComment.mutate({ ticket_id: ticketId, message: reply }, {
      onSuccess: () => setReply(''),
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-30" onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen w-full max-w-xl bg-white shadow-xl z-40 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {isLoading ? (
            <div className="animate-pulse h-5 bg-gray-200 rounded w-48" />
          ) : (
            <div className="min-w-0">
              <p className="text-xs text-gray-400">#{ticket?.reference}</p>
              <h2 className="text-base font-semibold text-gray-900 truncate">{ticket?.subject}</h2>
            </div>
          )}
          <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : ticket ? (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 space-y-3">
              <div className="flex flex-wrap gap-2">
                <TicketStatusBadge status={ticket.status} />
                <TicketPriorityBadge priority={ticket.priority} />
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {t(CATEGORY_LABELS[ticket.category])}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {t('support.openedOn')}: {new Date(ticket.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-gray-700">{ticket.description}</p>
            </div>

            <div className="px-6 py-4 flex-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('support.comments')}</h3>
              {ticket.comments.length === 0 ? (
                <p className="text-sm text-gray-400">{t('support.noComments')}</p>
              ) : (
                <div className="space-y-3">
                  {ticket.comments.map(comment => (
                    <div key={comment.id} className={`flex gap-3 ${comment.role === 'client' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${comment.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {comment.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div className={`flex-1 ${comment.role === 'client' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-700">{comment.author_name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${comment.role === 'agent' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                            {comment.role === 'agent' ? 'Soporte' : 'Tu'}
                          </span>
                        </div>
                        <p className={`text-sm px-3 py-2 rounded-xl ${comment.role === 'agent' ? 'bg-blue-50 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder={t('support.addComment')}
                rows={2}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <button
                onClick={handleSendComment}
                disabled={!reply.trim() || addComment.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 self-end"
              >
                {t('support.sendComment')}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
