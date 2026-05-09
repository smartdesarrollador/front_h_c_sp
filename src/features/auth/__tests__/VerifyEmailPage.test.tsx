import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import VerifyEmailPage from '@/features/auth/VerifyEmailPage'
import * as useVerifyEmailModule from '@/features/auth/hooks/useVerifyEmail'
import * as useResendModule from '@/features/auth/hooks/useResendVerification'

vi.mock('@/features/auth/hooks/useVerifyEmail')
vi.mock('@/features/auth/hooks/useResendVerification')

function wrapper(route: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    return (
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

const mockVerify = vi.fn()
const mockResend = vi.fn()

beforeEach(() => {
  vi.mocked(useVerifyEmailModule.useVerifyEmail).mockReturnValue({
    mutate: mockVerify,
    isPending: false,
    isSuccess: false,
    isError: false,
  } as unknown as ReturnType<typeof useVerifyEmailModule.useVerifyEmail>)

  vi.mocked(useResendModule.useResendVerification).mockReturnValue({
    mutate: mockResend,
    isPending: false,
    isSuccess: false,
  } as unknown as ReturnType<typeof useResendModule.useResendVerification>)
})

describe('VerifyEmailPage', () => {
  it('muestra spinner mientras verifica', () => {
    vi.mocked(useVerifyEmailModule.useVerifyEmail).mockReturnValue({
      mutate: mockVerify,
      isPending: true,
      isSuccess: false,
      isError: false,
    } as unknown as ReturnType<typeof useVerifyEmailModule.useVerifyEmail>)

    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email?token=abc123') })
    expect(screen.getByText(/verificando tu email/i)).toBeInTheDocument()
  })

  it('llama a verifyEmail con el token de la URL al montar', () => {
    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email?token=mi-token-123') })
    expect(mockVerify).toHaveBeenCalledWith('mi-token-123')
  })

  it('muestra éxito cuando la verificación es exitosa', () => {
    vi.mocked(useVerifyEmailModule.useVerifyEmail).mockReturnValue({
      mutate: mockVerify,
      isPending: false,
      isSuccess: true,
      isError: false,
    } as unknown as ReturnType<typeof useVerifyEmailModule.useVerifyEmail>)

    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email?token=abc') })
    expect(screen.getByText(/email verificado/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ir al inicio de sesión/i })).toBeInTheDocument()
  })

  it('muestra error y formulario de reenvío cuando el token es inválido', () => {
    vi.mocked(useVerifyEmailModule.useVerifyEmail).mockReturnValue({
      mutate: mockVerify,
      isPending: false,
      isSuccess: false,
      isError: true,
    } as unknown as ReturnType<typeof useVerifyEmailModule.useVerifyEmail>)

    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email?token=expired') })
    expect(screen.getByText(/enlace expiró o es inválido/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@empresa.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reenviar enlace/i })).toBeInTheDocument()
  })

  it('muestra error de URL sin token', () => {
    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email') })
    expect(screen.getByText(/enlace inválido/i)).toBeInTheDocument()
  })

  it('muestra formulario de reenvío directo cuando resend=true sin token', () => {
    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email?resend=true&email=user@test.com') })
    const input = screen.getByPlaceholderText('tu@empresa.com') as HTMLInputElement
    expect(input.value).toBe('user@test.com')
  })

  it('llama a resendVerification con el email ingresado', async () => {
    vi.mocked(useVerifyEmailModule.useVerifyEmail).mockReturnValue({
      mutate: mockVerify,
      isPending: false,
      isSuccess: false,
      isError: true,
    } as unknown as ReturnType<typeof useVerifyEmailModule.useVerifyEmail>)

    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email?token=expired') })
    fireEvent.change(screen.getByPlaceholderText('tu@empresa.com'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /reenviar enlace/i }))
    await waitFor(() => {
      expect(mockResend).toHaveBeenCalledWith('user@test.com')
    })
  })

  it('muestra confirmación tras reenvío exitoso', () => {
    vi.mocked(useVerifyEmailModule.useVerifyEmail).mockReturnValue({
      mutate: mockVerify,
      isPending: false,
      isSuccess: false,
      isError: true,
    } as unknown as ReturnType<typeof useVerifyEmailModule.useVerifyEmail>)
    vi.mocked(useResendModule.useResendVerification).mockReturnValue({
      mutate: mockResend,
      isPending: false,
      isSuccess: true,
    } as unknown as ReturnType<typeof useResendModule.useResendVerification>)

    render(<VerifyEmailPage />, { wrapper: wrapper('/verify-email?token=expired') })
    expect(screen.getByText(/email enviado/i)).toBeInTheDocument()
  })
})
