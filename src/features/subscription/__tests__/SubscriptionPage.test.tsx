import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SubscriptionPage from '../SubscriptionPage'
import * as useCurrentSubscriptionModule from '../hooks/useCurrentSubscription'
import * as useUpgradeSubscriptionModule from '../hooks/useUpgradeSubscription'
import * as useCancelSubscriptionModule from '../hooks/useCancelSubscription'
import * as usePermissionsModule from '@/hooks/usePermissions'
import type { CurrentSubscription } from '../types'

vi.mock('../hooks/useCurrentSubscription')
vi.mock('../hooks/useUpgradeSubscription')
vi.mock('../hooks/useCancelSubscription')
vi.mock('@/hooks/usePermissions')

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (_: string, fallback?: string) => fallback ?? _,
      i18n: { language: 'es' },
    }),
  }
})

const makeSubscription = (overrides: Partial<CurrentSubscription> = {}): CurrentSubscription => ({
  id: 'sub-1',
  plan: 'starter' as const,
  plan_display: 'Starter',
  status: 'active' as const,
  billing_cycle: 'monthly' as const,
  cancel_at_period_end: false,
  trial_end: null,
  current_period_end: '2026-04-09T00:00:00Z',
  mrr: 29,
  usage: {
    users: { current: 2, limit: 5 },
    storage: { current_gb: 1.5, limit_gb: 10 },
    services: { current: 1, limit: 3 },
  },
  ...overrides,
})

const defaultPermissions: ReturnType<typeof usePermissionsModule.usePermissions> = {
  canManageBilling: true,
  canUpgradePlan: true,
  hasPermission: vi.fn(() => false),
  hasRole: vi.fn(() => false),
  isAdmin: false,
  isOwner: false,
  getPrimaryRole: () => 'Owner',
  getRoleColor: () => '#dc2626',
}

const mockUpgradeMutate = vi.fn()
const mockCancelMutate = vi.fn()

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SubscriptionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCurrentSubscriptionModule.useCurrentSubscription).mockReturnValue({
      subscription: makeSubscription(),
      isLoading: false,
    })

    vi.mocked(useUpgradeSubscriptionModule.useUpgradeSubscription).mockReturnValue({
      mutate: mockUpgradeMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpgradeSubscriptionModule.useUpgradeSubscription>)

    vi.mocked(useCancelSubscriptionModule.useCancelSubscription).mockReturnValue({
      mutate: mockCancelMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useCancelSubscriptionModule.useCancelSubscription>)

    vi.mocked(usePermissionsModule.usePermissions).mockReturnValue(defaultPermissions)
  })

  it('muestra skeleton mientras carga la suscripción', () => {
    vi.mocked(useCurrentSubscriptionModule.useCurrentSubscription).mockReturnValue({
      subscription: null,
      isLoading: true,
    })
    const { container } = renderPage()
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('muestra el nombre del plan actual', () => {
    renderPage()
    expect(screen.getAllByText('Starter').length).toBeGreaterThan(0)
  })

  it('muestra banner de acceso limitado cuando canManageBilling es false', () => {
    vi.mocked(usePermissionsModule.usePermissions).mockReturnValue({
      ...defaultPermissions,
      canManageBilling: false,
    })
    renderPage()
    expect(
      screen.getByText(/solo el owner puede gestionar la suscripción/i),
    ).toBeInTheDocument()
  })

  it('oculta la grilla de planes cuando canManageBilling es false', () => {
    vi.mocked(usePermissionsModule.usePermissions).mockReturnValue({
      ...defaultPermissions,
      canManageBilling: false,
    })
    renderPage()
    expect(screen.queryByText('Planes disponibles')).not.toBeInTheDocument()
  })

  it('muestra la grilla de planes cuando canManageBilling es true', () => {
    renderPage()
    expect(screen.getByText('Planes disponibles')).toBeInTheDocument()
  })

  it('abre el modal de upgrade al hacer clic en Actualizar plan', () => {
    renderPage()
    // Professional plan upgrade button
    const upgradeButtons = screen.getAllByText('Actualizar plan')
    fireEvent.click(upgradeButtons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/actualizar a/i)).toBeInTheDocument()
  })

  it('cierra el modal de upgrade al hacer clic en Cancelar', () => {
    renderPage()
    const upgradeButtons = screen.getAllByText('Actualizar plan')
    fireEvent.click(upgradeButtons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('abre el modal de cancelación al hacer clic en Cancelar suscripción', () => {
    renderPage()
    fireEvent.click(screen.getByText('Cancelar suscripción'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/cancelar suscripción/i, { selector: 'h2' })).toBeInTheDocument()
  })

  it('muestra toggle de ciclo de facturación', () => {
    renderPage()
    expect(screen.getByText('Mensual')).toBeInTheDocument()
    // 'Anual' text appears inside the button (button also has a discount span)
    expect(screen.getByRole('button', { name: /anual/i })).toBeInTheDocument()
  })

  it('cambia el ciclo de facturación al hacer clic en Anual', () => {
    renderPage()
    const anualButton = screen.getByRole('button', { name: /anual/i })
    expect(anualButton).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(anualButton)
    expect(screen.getByRole('button', { name: /anual/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('muestra banner de cancelación cuando cancel_at_period_end es true', () => {
    vi.mocked(useCurrentSubscriptionModule.useCurrentSubscription).mockReturnValue({
      subscription: makeSubscription({ cancel_at_period_end: true }),
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText(/tu suscripción se cancelará el/i)).toBeInTheDocument()
  })

  it('muestra las barras de uso de recursos', () => {
    renderPage()
    expect(screen.getByText('Uso actual')).toBeInTheDocument()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Almacenamiento')).toBeInTheDocument()
    expect(screen.getByText('Servicios activos')).toBeInTheDocument()
  })

  it('muestra progressbars de uso con role="progressbar"', () => {
    renderPage()
    const bars = screen.getAllByRole('progressbar')
    expect(bars.length).toBe(3)
  })

  it('confirma upgrade y llama a la mutación', () => {
    renderPage()
    const upgradeButtons = screen.getAllByText('Actualizar plan')
    fireEvent.click(upgradeButtons[0])
    fireEvent.click(screen.getByText('Confirmar upgrade'))
    expect(mockUpgradeMutate).toHaveBeenCalled()
  })
})
