import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

const mockTicket = {
  id: 't1',
  reference: 'TKT-001',
  subject: 'Problema con facturacion',
  description: 'No puedo descargar mi factura',
  category: 'billing',
  priority: 'alta',
  status: 'open',
  created_at: '2026-03-01T10:00:00Z',
  updated_at: '2026-03-01T10:00:00Z',
}

const mockTicketDetail = {
  ...mockTicket,
  comments: [
    {
      id: 'c1',
      message: 'Estamos revisando tu caso',
      role: 'agent',
      author_name: 'Soporte',
      created_at: '2026-03-01T11:00:00Z',
    },
  ],
}

export const supportHandlers = [
  http.get(`${API}/support/tickets/`, () =>
    HttpResponse.json({ results: [mockTicket], count: 1 }),
  ),

  http.post(`${API}/support/tickets/`, () =>
    HttpResponse.json(mockTicket, { status: 201 }),
  ),

  http.get(`${API}/support/tickets/:id/`, () => HttpResponse.json(mockTicketDetail)),

  http.post(`${API}/support/tickets/:id/comments/`, () =>
    HttpResponse.json(
      {
        id: 'c2',
        message: 'Respuesta añadida',
        role: 'client',
        author_name: 'Test User',
        created_at: '2026-03-01T12:00:00Z',
      },
      { status: 201 },
    ),
  ),
]
