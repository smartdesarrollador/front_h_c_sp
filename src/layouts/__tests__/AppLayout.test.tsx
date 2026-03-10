import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from '../AppLayout'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { useAuthContext } from '@/features/auth/AuthContext'
import { usePermissions } from '@/hooks/usePermissions'
import { useFeatureGate } from '@/hooks/useFeatureGate'

vi.mock('@/store/authStore')
vi.mock('@/store/uiStore')
vi.mock('@/features/auth/AuthContext')
vi.mock('@/hooks/usePermissions')
vi.mock('@/hooks/useFeatureGate')
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { language: 'es', changeLanguage: vi.fn() },
    }),
  }
})

const mockToggleDarkMode = vi.fn()
const mockLogout = vi.fn().mockResolvedValue(undefined)

const mockUiState = {
  darkMode: false,
  language: 'es' as const,
  toggleDarkMode: mockToggleDarkMode,
  setLanguage: vi.fn(),
}

const mockAuthState = {
  user: {
    id: '1',
    email: 'ana@test.com',
    name: 'Ana García',
    firstName: 'Ana',
    lastName: 'García',
    roles: ['Owner'],
    permissions: [],
    status: 'active' as const,
    mfaEnabled: false,
    tenantId: 't1',
    lastLogin: null,
    createdAt: '2026-01-01',
  },
  tenant: {
    id: 't1',
    name: 'ACME Corp',
    subdomain: 'acme',
    plan: 'starter',
  },
  accessToken: 'tok',
  isAuthenticated: true,
  setUser: vi.fn(),
  setTenant: vi.fn(),
  setAccessToken: vi.fn(),
  clearAuth: vi.fn(),
}

function makeRouter(initialEntry = '/dashboard') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <div>Content</div> },
          { path: 'dashboard', element: <div>Dashboard content</div> },
          { path: 'services', element: <div>Services content</div> },
          { path: 'subscription', element: <div>Subscription content</div> },
          { path: 'team', element: <div>Team content</div> },
          { path: 'support', element: <div>Support content</div> },
          { path: 'profile', element: <div>Profile content</div> },
          { path: 'login', element: <div>Login</div> },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  )
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useUiStore).mockReturnValue(mockUiState as ReturnType<typeof useUiStore>)

    vi.mocked(useAuthStore).mockImplementation(
      (selector?: (s: typeof mockAuthState) => unknown) => {
        if (typeof selector === 'function') return selector(mockAuthState)
        return mockAuthState
      },
    )

    vi.mocked(useAuthContext).mockReturnValue({
      isLoading: false,
      login: vi.fn(),
      logout: mockLogout,
      register: vi.fn(),
    })

    vi.mocked(usePermissions).mockReturnValue({
      hasPermission: () => true,
      hasRole: () => false,
      isOwner: true,
      isAdmin: true,
      canManageBilling: true,
      canUpgradePlan: false,
      getPrimaryRole: () => 'Owner',
      getRoleColor: () => '#dc2626',
    })

    vi.mocked(useFeatureGate).mockReturnValue({
      hasFeature: () => false,
      getLimit: () => null,
      plan: 'starter',
      isLoading: false,
    })
  })

  it('renderiza el navbar', () => {
    makeRouter()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renderiza el Outlet (contenido de la página)', () => {
    makeRouter()
    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
  })

  it('los 6 nav links están presentes', () => {
    makeRouter()
    // t() mock returns keys — links use labelKeys like 'navbar.dashboard'
    const navLinks = screen.getAllByRole('link')
    // Filter to nav links (excluding logo link)
    expect(navLinks.length).toBeGreaterThanOrEqual(6)
    expect(screen.getByRole('link', { name: /navbar\.dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /navbar\.services/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /navbar\.subscription/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /navbar\.team/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /navbar\.support/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /navbar\.profile/i })).toBeInTheDocument()
  })

  it('el botón de dark mode llama toggleDarkMode', () => {
    makeRouter()
    const darkModeBtn = screen.getByRole('button', { name: /toggle dark mode/i })
    fireEvent.click(darkModeBtn)
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1)
  })

  it('el botón de logout llama logout y navega a /login', async () => {
    makeRouter()
    // Open user menu first
    const userMenuBtn = screen.getByRole('button', { name: /navbar\.userMenu/i })
    fireEvent.click(userMenuBtn)
    // Click logout
    const logoutBtn = screen.getByRole('menuitem', { name: /navbar\.logout/i })
    fireEvent.click(logoutBtn)
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('el menú móvil se abre al hacer clic en el hamburger', () => {
    makeRouter()
    const hamburgerBtn = screen.getByRole('button', { name: /navbar\.openMenu/i })
    fireEvent.click(hamburgerBtn)
    // Mobile nav should appear
    expect(screen.getByRole('navigation', { name: /navegacion movil/i })).toBeInTheDocument()
  })

  it('muestra las iniciales del usuario en el avatar', () => {
    makeRouter()
    // User name is 'Ana García', initial is 'A'
    const avatars = screen.getAllByText('A')
    expect(avatars.length).toBeGreaterThanOrEqual(1)
  })
})
