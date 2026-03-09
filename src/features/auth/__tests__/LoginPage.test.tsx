import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import LoginPage from '@/features/auth/LoginPage'
import * as useLoginModule from '@/features/auth/hooks/useLogin'

vi.mock('@/features/auth/hooks/useLogin')

vi.mock('@/features/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: false, user: null }),
}))

vi.mock('@/lib/axios', () => ({
  publicClient: { post: vi.fn() },
  apiClient: { post: vi.fn() },
}))

let mockMutate = vi.fn()

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockMutate = vi.fn()
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      data: undefined,
    } as unknown as ReturnType<typeof useLoginModule.useLogin>)
  })

  it('renderiza campos email y contraseña', () => {
    render(<LoginPage />, { wrapper })
    expect(screen.getByPlaceholderText('tu@empresa.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('llama mutate con credenciales en submit válido', async () => {
    render(<LoginPage />, { wrapper })
    fireEvent.change(screen.getByPlaceholderText('tu@empresa.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('muestra error cuando login falla', () => {
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: new Error('Unauthorized'),
      data: undefined,
    } as unknown as ReturnType<typeof useLoginModule.useLogin>)
    render(<LoginPage />, { wrapper })
    expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
  })

  it('muestra banner de éxito cuando location.state.resetSuccess=true', () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      data: undefined,
    } as unknown as ReturnType<typeof useLoginModule.useLogin>)
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter
          initialEntries={[{ pathname: '/login', state: { resetSuccess: true } }]}
        >
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(
      screen.getByText(/contraseña restablecida correctamente/i),
    ).toBeInTheDocument()
  })
})
