import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationsPage from '../NotificationsPage'
import { useHubNotifications } from '../hooks/useHubNotifications'
import { useMarkAsRead } from '../hooks/useMarkAsRead'
import { useMarkAllAsRead } from '../hooks/useMarkAllAsRead'
import type { HubNotification } from '../types'

vi.mock('../hooks/useHubNotifications')
vi.mock('../hooks/useMarkAsRead')
vi.mock('../hooks/useMarkAllAsRead')
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'es' } }),
  }
})

const mockMarkAsReadMutate = vi.fn()
const mockMarkAllAsReadMutate = vi.fn()

const mockNotifications: HubNotification[] = [
  {
    id: 'n1',
    category: 'billing',
    title: 'Factura generada',
    message: 'Tu factura de marzo ha sido generada.',
    read: false,
    created_at: new Date(Date.now() - 300_000).toISOString(), // 5 min ago
  },
  {
    id: 'n2',
    category: 'security',
    title: 'Inicio de sesión detectado',
    message: 'Se detectó un nuevo inicio de sesión.',
    read: true,
    created_at: new Date(Date.now() - 7_200_000).toISOString(), // 2h ago
  },
  {
    id: 'n3',
    category: 'system',
    title: 'Mantenimiento programado',
    message: 'Habrá mantenimiento este domingo.',
    read: false,
    created_at: new Date(Date.now() - 86_400_000 * 2).toISOString(), // 2 days ago
  },
]

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useMarkAsRead).mockReturnValue({
      mutate: mockMarkAsReadMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useMarkAsRead>)

    vi.mocked(useMarkAllAsRead).mockReturnValue({
      mutate: mockMarkAllAsReadMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useMarkAllAsRead>)

    vi.mocked(useHubNotifications).mockReturnValue({
      notifications: mockNotifications,
      unreadCount: 2,
      isLoading: false,
    })
  })

  it('muestra skeleton (animate-pulse) mientras isLoading=true', () => {
    vi.mocked(useHubNotifications).mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: true,
    })
    const { container } = renderPage()
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThanOrEqual(3)
  })

  it('notificacion no leída muestra dot azul (bg-primary-600)', () => {
    const { container } = renderPage()
    // n1 and n3 are unread — expect blue dots
    const dots = container.querySelectorAll('.bg-primary-600.rounded-full')
    expect(dots.length).toBeGreaterThanOrEqual(2)
  })

  it('clic en notificacion llama markAsRead.mutate con el id correcto', () => {
    renderPage()
    // n1 is unread, click on its title
    const item = screen.getByText('Factura generada')
    fireEvent.click(item)
    expect(mockMarkAsReadMutate).toHaveBeenCalledWith('n1')
  })

  it('no llama markAsRead al hacer clic en notificacion ya leída', () => {
    renderPage()
    const item = screen.getByText('Inicio de sesión detectado')
    fireEvent.click(item)
    expect(mockMarkAsReadMutate).not.toHaveBeenCalled()
  })

  it('boton "Marcar todo" deshabilitado cuando unreadCount=0', () => {
    vi.mocked(useHubNotifications).mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
    })
    renderPage()
    const btn = screen.getByText('notifications.markAllRead')
    expect(btn).toBeDisabled()
  })

  it('boton "Marcar todo" habilitado cuando unreadCount>0', () => {
    renderPage()
    const btn = screen.getByText('notifications.markAllRead')
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(mockMarkAllAsReadMutate).toHaveBeenCalledTimes(1)
  })

  it('cambiar filtro a "billing" oculta notificaciones de otras categorías', () => {
    renderPage()
    // Click billing filter pill
    const billingPill = screen.getByRole('tab', { name: 'notifications.billing' })
    fireEvent.click(billingPill)
    // n1 (billing) should be visible
    expect(screen.getByText('Factura generada')).toBeInTheDocument()
    // n2 (security) and n3 (system) should not be visible
    expect(screen.queryByText('Inicio de sesión detectado')).not.toBeInTheDocument()
    expect(screen.queryByText('Mantenimiento programado')).not.toBeInTheDocument()
  })

  it('estado vacío visible cuando el filtro no tiene resultados', () => {
    renderPage()
    // Click services filter — no services notifications
    const servicesPill = screen.getByRole('tab', { name: 'notifications.services' })
    fireEvent.click(servicesPill)
    expect(screen.getByText('notifications.noNotifications')).toBeInTheDocument()
  })
})
