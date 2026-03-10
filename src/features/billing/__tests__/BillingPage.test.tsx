import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BillingPage from '../BillingPage'
import { usePaymentMethods } from '../hooks/usePaymentMethods'
import { useAddPaymentMethod } from '../hooks/useAddPaymentMethod'
import { useSetDefaultMethod } from '../hooks/useSetDefaultMethod'
import { useDeletePaymentMethod } from '../hooks/useDeletePaymentMethod'
import { useInvoices } from '../hooks/useInvoices'
import { usePermissions } from '@/hooks/usePermissions'
import type { PaymentMethod } from '../types'

vi.mock('../hooks/usePaymentMethods')
vi.mock('../hooks/useAddPaymentMethod')
vi.mock('../hooks/useSetDefaultMethod')
vi.mock('../hooks/useDeletePaymentMethod')
vi.mock('../hooks/useInvoices')
vi.mock('@/hooks/usePermissions')

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (k: string, fb?: string) => fb ?? k,
      i18n: { language: 'es' },
    }),
  }
})

const mockPermissions = {
  hasPermission: vi.fn(() => false),
  hasRole: vi.fn(() => false),
  isOwner: true,
  isAdmin: true,
  canManageBilling: true,
  canUpgradePlan: false,
  getPrimaryRole: () => 'Owner',
  getRoleColor: () => '#dc2626',
}

const mockDefaultMethod: PaymentMethod = {
  id: 'pm-1',
  type: 'card',
  brand: 'visa',
  last4: '4242',
  exp_month: 12,
  exp_year: 2028,
  is_default: true,
  card_type: 'credit',
  phone_number: null,
}

const mockNonDefaultMethod: PaymentMethod = {
  id: 'pm-2',
  type: 'card',
  brand: 'mastercard',
  last4: '1234',
  exp_month: 6,
  exp_year: 2026,
  is_default: false,
  card_type: 'credit',
  phone_number: null,
}

const noopMutation = {
  mutate: vi.fn(),
  isPending: false,
} as unknown as ReturnType<typeof useAddPaymentMethod>

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('BillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePermissions).mockReturnValue(mockPermissions)
    vi.mocked(usePaymentMethods).mockReturnValue({ methods: [], isLoading: false })
    vi.mocked(useInvoices).mockReturnValue({ invoices: [], isLoading: false })
    vi.mocked(useAddPaymentMethod).mockReturnValue(noopMutation as unknown as ReturnType<typeof useAddPaymentMethod>)
    vi.mocked(useSetDefaultMethod).mockReturnValue(noopMutation as unknown as ReturnType<typeof useSetDefaultMethod>)
    vi.mocked(useDeletePaymentMethod).mockReturnValue(noopMutation as unknown as ReturnType<typeof useDeletePaymentMethod>)
  })

  it('muestra skeleton de métodos de pago mientras isLoading=true', () => {
    vi.mocked(usePaymentMethods).mockReturnValue({ methods: [], isLoading: true })
    const { container } = renderPage()
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('muestra badge "Predeterminado" en el método default', () => {
    vi.mocked(usePaymentMethods).mockReturnValue({
      methods: [mockDefaultMethod],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('Predeterminado')).toBeInTheDocument()
  })

  it('botón Eliminar deshabilitado en método predeterminado', () => {
    vi.mocked(usePaymentMethods).mockReturnValue({
      methods: [mockDefaultMethod],
      isLoading: false,
    })
    renderPage()
    const deleteBtn = screen.getByRole('button', { name: /eliminar/i })
    expect(deleteBtn).toBeDisabled()
  })

  it('muestra banner de acceso limitado cuando canManageBilling=false', () => {
    vi.mocked(usePermissions).mockReturnValue({
      ...mockPermissions,
      canManageBilling: false,
    })
    renderPage()
    expect(
      screen.getByText('Solo el Owner puede gestionar la facturación.'),
    ).toBeInTheDocument()
  })

  it('modal AddPaymentMethodModal: tabs Tarjeta / Billetera Digital / Pago Local visibles al abrir', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /agregar método/i }))
    expect(screen.getByRole('tab', { name: /tarjeta/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /billetera digital/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /pago local/i })).toBeInTheDocument()
  })

  it('tabla de facturas muestra skeleton mientras isLoading=true', () => {
    vi.mocked(useInvoices).mockReturnValue({ invoices: [], isLoading: true })
    const { container } = renderPage()
    const skeletonRows = container.querySelectorAll('tr.animate-pulse')
    expect(skeletonRows.length).toBeGreaterThan(0)
  })

  it('estado vacío visible cuando no hay métodos de pago', () => {
    vi.mocked(usePaymentMethods).mockReturnValue({ methods: [], isLoading: false })
    renderPage()
    expect(
      screen.getByText('No tienes métodos de pago guardados.'),
    ).toBeInTheDocument()
  })

  it('muestra botón no-default para método que no es predeterminado', () => {
    vi.mocked(usePaymentMethods).mockReturnValue({
      methods: [mockNonDefaultMethod],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('Establecer como predeterminado')).toBeInTheDocument()
  })

  it('botón Eliminar habilitado en método no predeterminado', () => {
    vi.mocked(usePaymentMethods).mockReturnValue({
      methods: [mockNonDefaultMethod],
      isLoading: false,
    })
    renderPage()
    const deleteBtn = screen.getByRole('button', { name: /eliminar/i })
    expect(deleteBtn).not.toBeDisabled()
  })

  it('estado vacío de facturas visible cuando no hay facturas', () => {
    vi.mocked(useInvoices).mockReturnValue({ invoices: [], isLoading: false })
    renderPage()
    expect(screen.getByText('No tienes facturas aún')).toBeInTheDocument()
  })
})
