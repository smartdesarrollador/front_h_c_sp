import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import GoogleCallbackPage from '@/features/auth/GoogleCallbackPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/store/authStore', () => {
  const setUser = vi.fn()
  const setTenant = vi.fn()
  const setAccessToken = vi.fn()
  return {
    useAuthStore: vi.fn(() => ({ setUser, setTenant, setAccessToken })),
  }
})

const USER_OBJ = { id: 'u1', email: 'test@example.com', name: 'Test' }
const TENANT_OBJ = { id: 't1', name: 'Acme', slug: 'acme', subdomain: 'acme', plan: 'free' }
const b64 = (obj: object) => btoa(JSON.stringify(obj))

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

function renderWithSearch(search: string) {
  return render(
    <MemoryRouter initialEntries={[`/auth/google/callback${search}`]}>
      <Routes>
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      </Routes>
    </MemoryRouter>,
    { wrapper },
  )
}

describe('GoogleCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('params válidos → guarda en localStorage y navega a /dashboard', () => {
    const search =
      `?access_token=acc123` +
      `&refresh_token=ref456` +
      `&user=${b64(USER_OBJ)}` +
      `&tenant=${b64(TENANT_OBJ)}`

    renderWithSearch(search)

    expect(localStorage.getItem('hub-refreshToken')).toBe('ref456')
    expect(localStorage.getItem('hub-authUser')).toBe(JSON.stringify(USER_OBJ))
    expect(localStorage.getItem('hub-authTenant')).toBe(JSON.stringify(TENANT_OBJ))
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  it('?error= → navega a /login con state.error', () => {
    renderWithSearch('?error=access_denied')
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { error: 'access_denied' },
      replace: true,
    })
  })

  it('sin access_token → navega a /login con error genérico', () => {
    renderWithSearch('?refresh_token=r&user=x&tenant=y')
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { error: 'auth_failed' },
      replace: true,
    })
  })

  it('muestra spinner mientras procesa', () => {
    const search =
      `?access_token=acc` +
      `&refresh_token=ref` +
      `&user=${b64(USER_OBJ)}` +
      `&tenant=${b64(TENANT_OBJ)}`
    const { container } = renderWithSearch(search)
    // The spinner container has role="status"
    const statusEl = container.querySelector('[role="status"]')
    expect(statusEl).toBeInTheDocument()
    expect(statusEl?.getAttribute('aria-label')).toContain('Google')
  })
})
