import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProfilePage from '../ProfilePage'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { useChangePassword } from '../hooks/useChangePassword'
import { useMFASetup } from '../hooks/useMFASetup'
import { useMFADisable } from '../hooks/useMFADisable'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'

vi.mock('../hooks/useUpdateProfile')
vi.mock('../hooks/useChangePassword')
vi.mock('../hooks/useMFASetup')
vi.mock('../hooks/useMFADisable')
vi.mock('@/store/authStore')
vi.mock('@/store/uiStore')
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>
  return {
    ...actual,
    useTranslation: () => ({
      t: (k: string) => k,
      i18n: { language: 'es', changeLanguage: vi.fn() },
    }),
  }
})

const mockUser = {
  id: 'u1',
  name: 'Juan García',
  email: 'juan@acme.com',
  firstName: 'Juan',
  lastName: 'García',
  mfaEnabled: false,
  roles: [],
  permissions: [],
  status: 'active' as const,
  tenantId: 't1',
  lastLogin: null,
  createdAt: '2026-01-01T00:00:00Z',
}

const mockSetUser = vi.fn()
const mockSetLanguage = vi.fn()
const mockToggleDarkMode = vi.fn()

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAuthStore).mockImplementation((selector?: unknown) => {
      const state = {
        user: mockUser,
        setUser: mockSetUser,
        tenant: null,
        accessToken: null,
        isAuthenticated: true,
        setTenant: vi.fn(),
        setAccessToken: vi.fn(),
        clearAuth: vi.fn(),
      }
      return typeof selector === 'function' ? selector(state) : state
    })

    vi.mocked(useUiStore).mockImplementation((selector?: unknown) => {
      const state = {
        darkMode: false,
        language: 'es' as const,
        toggleDarkMode: mockToggleDarkMode,
        setLanguage: mockSetLanguage,
      }
      return typeof selector === 'function' ? selector(state) : state
    })

    vi.mocked(useUpdateProfile).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
    } as unknown as ReturnType<typeof useUpdateProfile>)

    vi.mocked(useChangePassword).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useChangePassword>)

    vi.mocked(useMFASetup).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      data: undefined,
    } as unknown as ReturnType<typeof useMFASetup>)

    vi.mocked(useMFADisable).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useMFADisable>)
  })

  it('renderiza los 3 tabs de navegación', () => {
    renderPage()
    expect(screen.getByText('tabAccount')).toBeInTheDocument()
    expect(screen.getByText('tabSecurity')).toBeInTheDocument()
    expect(screen.getByText('tabPreferences')).toBeInTheDocument()
  })

  it('muestra el nombre y email del usuario en el header', () => {
    renderPage()
    const names = screen.getAllByText('Juan García')
    expect(names.length).toBeGreaterThanOrEqual(1)
    const emails = screen.getAllByText('juan@acme.com')
    expect(emails.length).toBeGreaterThanOrEqual(1)
  })

  it('tab Seguridad navega al hacer clic', () => {
    renderPage()
    fireEvent.click(screen.getByText('tabSecurity'))
    expect(screen.getByTestId('change-password-form')).toBeInTheDocument()
  })

  it('formulario contraseña valida campos vacíos', async () => {
    renderPage()
    fireEvent.click(screen.getByText('tabSecurity'))
    const form = screen.getByTestId('change-password-form')
    const submitBtn = form.querySelector('button[type="submit"]')!
    fireEvent.click(submitBtn)
    await waitFor(() => {
      expect(screen.getByText('La contraseña actual es requerida')).toBeInTheDocument()
    })
  })

  it('sección MFA muestra botón Activar cuando mfaEnabled=false', () => {
    renderPage()
    fireEvent.click(screen.getByText('tabSecurity'))
    expect(screen.getByText('activateMfa')).toBeInTheDocument()
    expect(screen.getByText('mfaDisabled')).toBeInTheDocument()
  })

  it('tab Preferencias — selector idioma llama uiStore.setLanguage al cambiar', () => {
    renderPage()
    fireEvent.click(screen.getByText('tabPreferences'))
    const select = screen.getByLabelText('langField') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'en' } })
    expect(mockSetLanguage).toHaveBeenCalledWith('en')
  })

  it('MFA muestra QR cuando useMFASetup.isSuccess=true y data tiene qr_uri', () => {
    vi.mocked(useMFASetup).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: true,
      data: { qr_uri: 'https://chart.example.com/qr', secret: 'ABCDE12345' },
    } as unknown as ReturnType<typeof useMFASetup>)

    renderPage()
    fireEvent.click(screen.getByText('tabSecurity'))
    const img = screen.getByAltText('MFA QR Code') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.src).toBe('https://chart.example.com/qr')
    expect(screen.getByText('ABCDE12345')).toBeInTheDocument()
  })
})
