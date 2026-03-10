import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SupportPage from '../SupportPage'
import { useMyTickets } from '../hooks/useMyTickets'
import { useTicketDetail } from '../hooks/useTicketDetail'
import { useCreateTicket } from '../hooks/useCreateTicket'
import { useAddComment } from '../hooks/useAddComment'
import type { HubTicket, HubTicketDetail } from '../types'

vi.mock('../hooks/useMyTickets')
vi.mock('../hooks/useTicketDetail')
vi.mock('../hooks/useCreateTicket')
vi.mock('../hooks/useAddComment')
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'es', changeLanguage: vi.fn() },
  }),
}))

const mockCreateTicketMutate = vi.fn()
const mockAddCommentMutate = vi.fn()

const mockTickets: HubTicket[] = [
  {
    id: 't1',
    reference: 'TKT-001',
    subject: 'Problema con facturacion',
    description: 'No puedo descargar mi factura',
    category: 'billing',
    priority: 'alta',
    status: 'open',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 't2',
    reference: 'TKT-002',
    subject: 'Error tecnico',
    description: 'La aplicacion falla',
    category: 'technical',
    priority: 'urgente',
    status: 'in_progress',
    created_at: '2026-03-02T10:00:00Z',
    updated_at: '2026-03-02T10:00:00Z',
  },
]

const mockTicketDetail: HubTicketDetail = {
  ...mockTickets[0],
  comments: [
    {
      id: 'c1',
      message: 'Hola, estamos revisando',
      role: 'agent',
      author_name: 'Soporte',
      created_at: '2026-03-01T11:00:00Z',
    },
    {
      id: 'c2',
      message: 'Gracias por responder',
      role: 'client',
      author_name: 'Juan',
      created_at: '2026-03-01T12:00:00Z',
    },
  ],
}

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <SupportPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SupportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useMyTickets).mockReturnValue({
      tickets: mockTickets,
      isLoading: false,
    })

    vi.mocked(useTicketDetail).mockReturnValue({
      ticket: null,
      isLoading: false,
    })

    vi.mocked(useCreateTicket).mockReturnValue({
      mutate: mockCreateTicketMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateTicket>)

    vi.mocked(useAddComment).mockReturnValue({
      mutate: mockAddCommentMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useAddComment>)
  })

  it('muestra skeleton (animate-pulse) mientras isLoading=true', () => {
    vi.mocked(useMyTickets).mockReturnValue({
      tickets: [],
      isLoading: true,
    })
    const { container } = renderPage()
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza 3 tarjetas KPI con conteos correctos', () => {
    renderPage()
    // total=2, open=1, in_progress=1
    const headings = screen.getAllByText('2')
    expect(headings.length).toBeGreaterThanOrEqual(1)
    const openCount = screen.getAllByText('1')
    expect(openCount.length).toBeGreaterThanOrEqual(2) // open=1 and in_progress=1
    expect(screen.getByText('support.myTickets')).toBeInTheDocument()
    expect(screen.getByText('support.open')).toBeInTheDocument()
    expect(screen.getByText('support.inProgress')).toBeInTheDocument()
  })

  it('boton "Nuevo ticket" abre el modal', () => {
    renderPage()
    const btn = screen.getByText('support.newTicket')
    fireEvent.click(btn)
    expect(screen.getByText('support.modalTitle')).toBeInTheDocument()
  })

  it('modal valida campos vacios al hacer submit', async () => {
    renderPage()
    // Open modal
    fireEvent.click(screen.getByText('support.newTicket'))
    // Click submit without filling anything
    const submitBtn = screen.getByText('support.submit')
    fireEvent.click(submitBtn)
    await waitFor(() => {
      // Zod min(5) error for subject
      expect(screen.getByText('Minimo 5 caracteres')).toBeInTheDocument()
    })
  })

  it('hacer clic en un ticket abre el panel de detalle', () => {
    vi.mocked(useTicketDetail).mockReturnValue({
      ticket: mockTicketDetail,
      isLoading: false,
    })
    renderPage()
    // Click on the first ticket in the list
    const ticketItem = screen.getByText('Problema con facturacion')
    fireEvent.click(ticketItem)
    // Panel header shows the ticket subject
    const subjects = screen.getAllByText('Problema con facturacion')
    expect(subjects.length).toBeGreaterThanOrEqual(2)
  })

  it('panel de detalle muestra comentarios del ticket', () => {
    vi.mocked(useTicketDetail).mockReturnValue({
      ticket: mockTicketDetail,
      isLoading: false,
    })
    renderPage()
    // Click ticket to open detail
    fireEvent.click(screen.getByText('Problema con facturacion'))
    // Comments section header and comment messages
    expect(screen.getByText('support.comments')).toBeInTheDocument()
    expect(screen.getByText('Hola, estamos revisando')).toBeInTheDocument()
    expect(screen.getByText('Gracias por responder')).toBeInTheDocument()
  })

  it('typing in reply textarea and clicking send calls addComment.mutate', () => {
    vi.mocked(useTicketDetail).mockReturnValue({
      ticket: mockTicketDetail,
      isLoading: false,
    })
    renderPage()
    // Open detail panel
    fireEvent.click(screen.getByText('Problema con facturacion'))

    // Find reply textarea by placeholder key
    const textarea = screen.getByPlaceholderText('support.addComment')
    fireEvent.change(textarea, { target: { value: 'Mi nueva respuesta' } })

    const sendBtn = screen.getByText('support.sendComment')
    fireEvent.click(sendBtn)

    expect(mockAddCommentMutate).toHaveBeenCalledWith(
      { ticket_id: 't1', message: 'Mi nueva respuesta' },
      expect.any(Object),
    )
  })

  it('renderiza el banner de estado de servicios', () => {
    renderPage()
    expect(screen.getByText('support.serviceStatus:')).toBeInTheDocument()
    expect(screen.getByText('support.serviceStatusOk')).toBeInTheDocument()
  })

  it('muestra estado vacio cuando no hay tickets y no esta cargando', () => {
    vi.mocked(useMyTickets).mockReturnValue({
      tickets: [],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('support.noTickets')).toBeInTheDocument()
  })
})
