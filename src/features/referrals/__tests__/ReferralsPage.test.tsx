import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReferralsPage from '../ReferralsPage'
import { useReferralDashboard } from '../hooks/useReferralDashboard'
import { usePermissions } from '@/hooks/usePermissions'
import type { ReferralDashboard } from '../types'

vi.mock('../hooks/useReferralDashboard')
vi.mock('@/hooks/usePermissions')

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (k: string) => k,
      i18n: { language: 'es' },
    }),
  }
})

const mockDashboard: ReferralDashboard = {
  code: 'ACME2025',
  referral_url: 'https://app.example.com/register?ref=ACME2025',
  stats: {
    referred: 5,
    credits_earned: 145,
    available_credits: 87,
  },
  referrals: [
    {
      id: 'r-1',
      tenant_name: 'carlos@empresa.com',
      status: 'active',
      credit_amount: 29,
      activated_at: '2025-01-15T00:00:00Z',
      created_at: '2025-01-10T00:00:00Z',
    },
    {
      id: 'r-2',
      tenant_name: 'maria@otro.com',
      status: 'pending',
      credit_amount: 29,
      activated_at: null,
      created_at: '2025-02-01T00:00:00Z',
    },
  ],
}

const mockPermissionsWithAccess = {
  hasPermission: vi.fn((p: string) => p === 'referrals.read'),
  hasRole: vi.fn(() => false),
  isOwner: false,
  isAdmin: false,
  canManageBilling: false,
  canUpgradePlan: false,
  getPrimaryRole: () => 'Member',
  getRoleColor: () => '#3b82f6',
}

const mockPermissionsNoAccess = {
  hasPermission: vi.fn(() => false),
  hasRole: vi.fn(() => false),
  isOwner: false,
  isAdmin: false,
  canManageBilling: false,
  canUpgradePlan: false,
  getPrimaryRole: () => 'Guest',
  getRoleColor: () => '#6b7280',
}

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ReferralsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ReferralsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePermissions).mockReturnValue(mockPermissionsWithAccess)
    vi.mocked(useReferralDashboard).mockReturnValue({ dashboard: mockDashboard, isLoading: false })
  })

  it('muestra 3 tarjetas de stats con datos del dashboard', () => {
    renderPage()
    expect(screen.getByText('referrals.referred')).toBeInTheDocument()
    expect(screen.getByText('referrals.earned')).toBeInTheDocument()
    expect(screen.getByText('referrals.balance')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('$145')).toBeInTheDocument()
    expect(screen.getByText('$87')).toBeInTheDocument()
  })

  it('boton copiar codigo muestra feedback tras clic', () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
    })

    renderPage()

    const copyBtn = screen.getByRole('button', { name: /referrals\.copyCode/i })
    fireEvent.click(copyBtn)

    expect(writeText).toHaveBeenCalledWith('ACME2025')
    expect(screen.getByRole('button', { name: /referrals\.copied/i })).toBeInTheDocument()
  })

  it('historial muestra badge verde para referido activo y amarillo para pendiente', () => {
    const { container } = renderPage()

    const activeBadges = container.querySelectorAll('.bg-green-100.text-green-800')
    expect(activeBadges.length).toBeGreaterThan(0)

    const pendingBadges = container.querySelectorAll('.bg-yellow-100.text-yellow-800')
    expect(pendingBadges.length).toBeGreaterThan(0)
  })

  it('muestra skeleton (animate-pulse) mientras isLoading=true', () => {
    vi.mocked(useReferralDashboard).mockReturnValue({ dashboard: null, isLoading: true })
    const { container } = renderPage()

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renderiza mensaje sin permiso cuando el usuario no tiene referrals.read', () => {
    vi.mocked(usePermissions).mockReturnValue(mockPermissionsNoAccess)
    renderPage()

    expect(screen.getByTestId('permission-denied')).toBeInTheDocument()
    expect(screen.queryByText('referrals.title')).not.toBeInTheDocument()
  })

  it('muestra el codigo de referido del dashboard', () => {
    renderPage()
    expect(screen.getByText('ACME2025')).toBeInTheDocument()
  })

  it('muestra email enmascarado en la tabla de historial', () => {
    renderPage()
    expect(screen.getByText('ca***@empresa.com')).toBeInTheDocument()
    expect(screen.getByText('ma***@otro.com')).toBeInTheDocument()
  })
})
