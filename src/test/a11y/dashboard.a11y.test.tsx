import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardPage from '@/features/dashboard/DashboardPage'
import * as useDashboardSummaryModule from '@/features/dashboard/hooks/useDashboardSummary'
import * as useActiveServicesModule from '@/features/dashboard/hooks/useActiveServices'
import * as usePermissionsModule from '@/hooks/usePermissions'
import * as useFeatureGateModule from '@/hooks/useFeatureGate'
import { axeConfig } from '../setup'

vi.mock('@/features/dashboard/hooks/useDashboardSummary')
vi.mock('@/features/dashboard/hooks/useActiveServices')
vi.mock('@/hooks/usePermissions')
vi.mock('@/hooks/useFeatureGate')

vi.mock('@/features/dashboard/components/ServiceUpgradeCatalog', () => ({
  ServiceUpgradeCatalog: () => null,
}))

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

const defaultSummary: ReturnType<typeof useDashboardSummaryModule.useDashboardSummary> = {
  subscription: {
    plan: 'starter',
    plan_display: 'Starter',
    status: 'active',
    next_billing_date: null,
    mrr: 49,
    cancel_at_period_end: false,
  },
  support: { open_tickets: 2, in_attention: 0 },
  referrals: { active_referrals: 3, earned_credits: 50 },
  isLoading: false,
}

const defaultPermissions: ReturnType<typeof usePermissionsModule.usePermissions> = {
  canManageBilling: true,
  canUpgradePlan: false,
  hasPermission: vi.fn(() => true),
  hasRole: vi.fn(() => false),
  isAdmin: false,
  isOwner: false,
  getPrimaryRole: () => 'Member',
  getRoleColor: () => '#3b82f6',
}

const defaultFeatureGate: ReturnType<typeof useFeatureGateModule.useFeatureGate> = {
  getLimit: vi.fn(() => null),
  hasFeature: vi.fn(() => true),
  plan: 'starter',
  isLoading: false,
}

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DashboardPage a11y', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDashboardSummaryModule.useDashboardSummary).mockReturnValue(defaultSummary)
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [
        { id: '1', name: 'Workspace', slug: 'workspace', status: 'active', description: 'App', icon: 'workspace' },
      ],
      isLoading: false,
    })
    vi.mocked(usePermissionsModule.usePermissions).mockReturnValue(defaultPermissions)
    vi.mocked(useFeatureGateModule.useFeatureGate).mockReturnValue(defaultFeatureGate)
  })

  it('renders DashboardPage without a11y violations', async () => {
    const { container } = renderPage()
    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
