export type TicketStatus = 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed'
export type TicketPriority = 'urgente' | 'alta' | 'media' | 'baja'
export type TicketCategory = 'billing' | 'technical' | 'account' | 'general'
export type CommentRole = 'agent' | 'client'

export interface TicketComment {
  id: string
  message: string
  role: CommentRole
  author_name: string
  created_at: string
}

export interface HubTicket {
  id: string
  reference: string
  subject: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  created_at: string
  updated_at: string
}

export interface HubTicketDetail extends HubTicket {
  comments: TicketComment[]
}

export interface NewTicketRequest {
  subject: string
  description: string
  category: TicketCategory
  priority: TicketPriority
}
