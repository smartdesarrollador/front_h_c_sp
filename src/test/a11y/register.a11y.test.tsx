import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RegisterPage from '@/features/auth/RegisterPage'
import { axeConfig } from '../setup'

vi.mock('@/features/auth/hooks/useRegister', () => ({
  useRegister: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (k: string) => k,
      i18n: { language: 'es' },
    }),
  }
})

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RegisterPage a11y', () => {
  it('renders RegisterPage step 1 without a11y violations', async () => {
    const { container } = renderPage()
    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
