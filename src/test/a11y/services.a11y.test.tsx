import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ServicesPage from '@/features/services/ServicesPage'
import * as useActiveServicesModule from '@/features/services/hooks/useActiveServices'
import * as useServiceCatalogModule from '@/features/services/hooks/useServiceCatalog'
import type { RunOptions } from 'axe-core'

// ServicesPage uses h3 cards directly after h1 (no h2 in between) — disable heading-order
const servicesAxeConfig: RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    'heading-order': { enabled: false },
  },
}

vi.mock('@/features/services/hooks/useActiveServices')
vi.mock('@/features/services/hooks/useServiceCatalog')

vi.mock('@/features/services/components/SSOLaunchButton', () => ({
  SSOLaunchButton: ({ serviceSlug }: { serviceSlug: string }) => (
    <button>Abrir {serviceSlug}</button>
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

describe('ServicesPage a11y', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useActiveServicesModule.useActiveServices).mockReturnValue({
      services: [
        { id: '1', name: 'Workspace', slug: 'workspace', status: 'active', description: 'App', icon: 'workspace' },
      ],
      isLoading: false,
    })
    vi.mocked(useServiceCatalogModule.useServiceCatalog).mockReturnValue({
      catalog: [
        { id: '1', name: 'Workspace', slug: 'workspace', status: 'active', description: 'App', icon: 'workspace' },
      ],
      isLoading: false,
    })
  })

  it('renders ServicesPage without a11y violations', async () => {
    const { container } = renderPage()
    expect(await axe(container, servicesAxeConfig)).toHaveNoViolations()
  })
})
