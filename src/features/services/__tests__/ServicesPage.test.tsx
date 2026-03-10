import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ServicesPage from '../ServicesPage'
import * as useActiveServicesModule from '../hooks/useActiveServices'
import * as useServiceCatalogModule from '../hooks/useServiceCatalog'

vi.mock('../hooks/useActiveServices')
vi.mock('../hooks/useServiceCatalog')

vi.mock('../components/SSOLaunchButton', () => ({
  SSOLaunchButton: ({ serviceSlug }: { serviceSlug: string }) => (
    <button data-testid={`sso-${serviceSlug}`}>Abrir</button>
  ),
}))

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (_: string, fallback?: string) => fallback ?? _,
      i18n: { language: 'es' },
    }),
  }
})

const makeService = (overrides: Partial<{
  id: string
  name: string
  slug: string
  status: 'active' | 'suspended' | 'locked' | 'coming_soon'
  description: string
  icon: string
}> = {}) => ({
  id: '1',
  name: 'Workspace',
  slug: 'workspace',
  status: 'active' as const,
  description: 'Gestión de proyectos',
  icon: 'workspace',
  ...overrides,
})

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ServicesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [],
      isLoading: false,
    })
    vi.mocked(useServiceCatalogModule.useServiceCatalog).mockReturnValue({
      catalog: [],
      isLoading: false,
    })
  })

  it('muestra skeleton mientras carga servicios activos', () => {
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [],
      isLoading: true,
    })
    const { container } = renderPage()
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(3)
  })

  it('muestra estado vacío si no hay servicios', () => {
    renderPage()
    expect(screen.getByText(/no tienes servicios activos/i)).toBeInTheDocument()
  })

  it('renderiza ServiceCard para cada servicio activo', () => {
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [
        makeService({ id: '1', name: 'Workspace', slug: 'workspace' }),
        makeService({ id: '2', name: 'Digital Services', slug: 'digital_services' }),
      ],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getByText('Digital Services')).toBeInTheDocument()
  })

  it('botón Abrir presente para servicio active via SSOLaunchButton', () => {
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [makeService({ id: '1', slug: 'workspace', status: 'active' })],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByTestId('sso-workspace')).toBeInTheDocument()
  })

  it('sección upgrade visible cuando hay servicios no adquiridos', () => {
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [makeService({ id: '1', slug: 'workspace' })],
      isLoading: false,
    })
    vi.mocked(useServiceCatalogModule.useServiceCatalog).mockReturnValue({
      catalog: [
        makeService({ id: '1', slug: 'workspace' }),
        makeService({ id: '2', name: 'Desktop', slug: 'desktop', status: 'locked' }),
      ],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByText('Más servicios disponibles')).toBeInTheDocument()
  })

  it('no renderiza sección upgrade si catálogo vacío', () => {
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [makeService({ id: '1', slug: 'workspace' })],
      isLoading: false,
    })
    vi.mocked(useServiceCatalogModule.useServiceCatalog).mockReturnValue({
      catalog: [makeService({ id: '1', slug: 'workspace' })],
      isLoading: false,
    })
    renderPage()
    expect(screen.queryByText('Más servicios disponibles')).not.toBeInTheDocument()
  })
})
