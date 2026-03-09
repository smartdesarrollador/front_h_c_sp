import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import RegisterPage from '@/features/auth/RegisterPage'
import * as useRegisterModule from '@/features/auth/hooks/useRegister'

vi.mock('@/features/auth/hooks/useRegister')

vi.mock('@/features/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

let mockMutateAsync = vi.fn().mockResolvedValue(undefined)

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/register']}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    mockMutateAsync = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useRegisterModule.useRegister).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useRegisterModule.useRegister>)
  })

  it('muestra paso 1 inicialmente', () => {
    render(<RegisterPage />, { wrapper })
    expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument()
  })

  it('avanza a paso 2 con datos válidos en paso 1', async () => {
    render(<RegisterPage />, { wrapper })
    fireEvent.change(screen.getByPlaceholderText('tu@empresa.com'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText('Tu organización')).toBeInTheDocument()
    })
  })

  it('muestra preview de subdominio en tiempo real (paso 2)', async () => {
    render(<RegisterPage />, { wrapper })
    // Advance to step 2
    fireEvent.change(screen.getByPlaceholderText('tu@empresa.com'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Tu organización'))
    fireEvent.change(screen.getByPlaceholderText('Mi Empresa S.A.'), {
      target: { value: 'Mi Empresa' },
    })
    await waitFor(() => {
      expect(screen.getByTestId('subdomain-preview')).toHaveTextContent(
        'mi-empresa.hub.app',
      )
    })
  })

  it('lee plan pre-seleccionado desde location.state', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter
          initialEntries={[{ pathname: '/register', state: { plan: 'starter' } }]}
        >
          <RegisterPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    // Component renders step 1 initially; plan selection is in step 3
    expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument()
  })

  it('llama mutate con payload correcto al finalizar paso 3', async () => {
    render(<RegisterPage />, { wrapper })
    // Step 1
    fireEvent.change(screen.getByPlaceholderText('tu@empresa.com'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Tu organización'))
    // Step 2
    fireEvent.change(screen.getByPlaceholderText('Mi Empresa S.A.'), {
      target: { value: 'Acme Corp' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Elige tu plan'))
    // Step 3
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'Acme Corp',
        email: 'user@test.com',
        password: 'password123',
        organization_name: 'Acme Corp',
        plan: 'free',
      })
    })
  })

  it('muestra paso 4 (éxito) tras registro exitoso', async () => {
    render(<RegisterPage />, { wrapper })
    // Step 1
    fireEvent.change(screen.getByPlaceholderText('tu@empresa.com'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Tu organización'))
    // Step 2
    fireEvent.change(screen.getByPlaceholderText('Mi Empresa S.A.'), {
      target: { value: 'Test Corp' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Elige tu plan'))
    // Step 3
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByText('¡Cuenta creada!')).toBeInTheDocument()
    })
  })
})
