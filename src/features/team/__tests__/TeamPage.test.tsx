import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TeamPage from '../TeamPage'
import { useTeamMembers } from '../hooks/useTeamMembers'
import { useInviteTeamMember } from '../hooks/useInviteTeamMember'
import { useSuspendTeamMember } from '../hooks/useSuspendTeamMember'
import { useRemoveTeamMember } from '../hooks/useRemoveTeamMember'
import { usePermissions } from '@/hooks/usePermissions'
import { useCurrentSubscription } from '@/features/subscription/hooks/useCurrentSubscription'
import type { TeamMember } from '../types'

vi.mock('../hooks/useTeamMembers')
vi.mock('../hooks/useInviteTeamMember')
vi.mock('../hooks/useSuspendTeamMember')
vi.mock('../hooks/useRemoveTeamMember')
vi.mock('@/hooks/usePermissions')
vi.mock('@/features/subscription/hooks/useCurrentSubscription')

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

const mockOwner: TeamMember = {
  id: 'u-owner',
  email: 'owner@empresa.com',
  name: 'Owner User',
  roles: ['Owner'],
  is_active: true,
  email_verified: true,
  created_at: '2024-01-01T00:00:00Z',
}

const mockAdmin: TeamMember = {
  id: 'u-admin',
  email: 'admin@empresa.com',
  name: 'Admin User',
  roles: ['OrgAdmin'],
  is_active: true,
  email_verified: true,
  created_at: '2024-02-01T00:00:00Z',
}

const mockActiveMember: TeamMember = {
  id: 'u-member',
  email: 'member@empresa.com',
  name: 'Regular Member',
  roles: ['Member'],
  is_active: true,
  email_verified: true,
  created_at: '2024-03-01T00:00:00Z',
}

const mockPendingMember: TeamMember = {
  id: 'u-pending',
  email: 'pending@empresa.com',
  name: 'Pending User',
  roles: ['Member'],
  is_active: false,
  email_verified: false,
  created_at: '2024-04-01T00:00:00Z',
}

const noopMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: undefined,
  reset: vi.fn(),
  status: 'idle' as const,
  variables: undefined,
  context: undefined,
  failureCount: 0,
  failureReason: null,
  isPaused: false,
  submittedAt: 0,
}

const mockPermissionsOwner = {
  hasPermission: vi.fn(() => false),
  hasRole: vi.fn((r: string) => r === 'Owner'),
  isOwner: true,
  isAdmin: true,
  canManageBilling: true,
  canUpgradePlan: false,
  getPrimaryRole: () => 'Owner',
  getRoleColor: () => '#dc2626',
}


function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('TeamPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePermissions).mockReturnValue(mockPermissionsOwner)
    vi.mocked(useCurrentSubscription).mockReturnValue({
      subscription: {
        id: 'sub-1',
        plan: 'starter',
        plan_display: 'Starter',
        status: 'active',
        billing_cycle: 'monthly',
        cancel_at_period_end: false,
        trial_end: null,
        current_period_end: '2025-12-31T00:00:00Z',
        mrr: 29,
        usage: {
          users: { current: 2, limit: 5 },
          storage: { current_gb: 1, limit_gb: 10 },
          services: { current: 1, limit: 3 },
        },
      },
      isLoading: false,
    })
    vi.mocked(useTeamMembers).mockReturnValue({
      members: [mockOwner, mockActiveMember],
      activeMembers: [mockOwner, mockActiveMember],
      pendingMembers: [],
      isLoading: false,
    })
    vi.mocked(useInviteTeamMember).mockReturnValue(
      noopMutation as unknown as ReturnType<typeof useInviteTeamMember>,
    )
    vi.mocked(useSuspendTeamMember).mockReturnValue(
      noopMutation as unknown as ReturnType<typeof useSuspendTeamMember>,
    )
    vi.mocked(useRemoveTeamMember).mockReturnValue(
      noopMutation as unknown as ReturnType<typeof useRemoveTeamMember>,
    )
  })

  it('muestra skeleton (tr.animate-pulse) mientras isLoading=true', () => {
    vi.mocked(useTeamMembers).mockReturnValue({
      members: [],
      activeMembers: [],
      pendingMembers: [],
      isLoading: true,
    })
    const { container } = renderPage()
    const skeletonRows = container.querySelectorAll('tr.animate-pulse')
    expect(skeletonRows.length).toBeGreaterThan(0)
  })

  it('Owner no tiene botones de accion (Suspender/Eliminar)', () => {
    vi.mocked(useTeamMembers).mockReturnValue({
      members: [mockOwner],
      activeMembers: [mockOwner],
      pendingMembers: [],
      isLoading: false,
    })
    renderPage()
    expect(screen.queryByRole('button', { name: /suspender/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /eliminar/i })).not.toBeInTheDocument()
  })

  it('miembro activo muestra botones Suspender y Eliminar', () => {
    vi.mocked(useTeamMembers).mockReturnValue({
      members: [mockActiveMember],
      activeMembers: [mockActiveMember],
      pendingMembers: [],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByRole('button', { name: /suspender/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument()
  })

  it('boton Invitar deshabilitado cuando el plan tiene limite alcanzado', () => {
    vi.mocked(useCurrentSubscription).mockReturnValue({
      subscription: {
        id: 'sub-1',
        plan: 'starter',
        plan_display: 'Starter',
        status: 'active',
        billing_cycle: 'monthly',
        cancel_at_period_end: false,
        trial_end: null,
        current_period_end: '2025-12-31T00:00:00Z',
        mrr: 29,
        usage: {
          users: { current: 5, limit: 5 },
          storage: { current_gb: 1, limit_gb: 10 },
          services: { current: 1, limit: 3 },
        },
      },
      isLoading: false,
    })
    renderPage()
    const inviteBtn = screen.getByRole('button', { name: /team\.invite/i })
    expect(inviteBtn).toBeDisabled()
  })

  it('modal de invitacion muestra campos email y rol al abrirse', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /team\.invite/i }))
    expect(screen.getByLabelText(/email del nuevo miembro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/rol/i)).toBeInTheDocument()
  })

  it('seccion invitaciones pendientes visible cuando hay invitaciones sin confirmar', () => {
    vi.mocked(useTeamMembers).mockReturnValue({
      members: [mockOwner, mockPendingMember],
      activeMembers: [mockOwner],
      pendingMembers: [mockPendingMember],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('Invitaciones pendientes')).toBeInTheDocument()
    expect(screen.getByText('pending@empresa.com')).toBeInTheDocument()
  })

  it('estado vacio visible cuando no hay miembros activos', () => {
    vi.mocked(useTeamMembers).mockReturnValue({
      members: [],
      activeMembers: [],
      pendingMembers: [],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('No hay miembros aún')).toBeInTheDocument()
  })

  it('miembro admin con is_active=false muestra boton Reactivar', () => {
    const suspendedAdmin: TeamMember = {
      ...mockAdmin,
      id: 'u-admin-s',
      is_active: false,
    }
    vi.mocked(useTeamMembers).mockReturnValue({
      members: [suspendedAdmin],
      activeMembers: [suspendedAdmin],
      pendingMembers: [],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByRole('button', { name: /reactivar/i })).toBeInTheDocument()
  })
})
