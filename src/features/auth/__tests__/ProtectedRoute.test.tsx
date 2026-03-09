import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import * as useAuthModule from '@/features/auth/hooks/useAuth'
import * as authStoreModule from '@/store/authStore'

vi.mock('@/features/auth/hooks/useAuth')
vi.mock('@/store/authStore')

function setup(isLoading: boolean, isAuthenticated: boolean) {
  vi.mocked(useAuthModule.useAuth).mockReturnValue({
    isLoading,
    isAuthenticated,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  } as unknown as ReturnType<typeof useAuthModule.useAuth>)

  const mockState = { isAuthenticated }
  vi.mocked(authStoreModule.useAuthStore).mockImplementation(
    ((selector: unknown) =>
      typeof selector === 'function'
        ? (selector as (s: typeof mockState) => unknown)(mockState)
        : mockState) as unknown as typeof authStoreModule.useAuthStore,
  )
}

describe('ProtectedRoute', () => {
  it('muestra spinner mientras isLoading=true', () => {
    setup(true, false)
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('redirige a /login cuando no autenticado', () => {
    setup(false, false)
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renderiza Outlet cuando autenticado', () => {
    setup(false, true)
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })
})
