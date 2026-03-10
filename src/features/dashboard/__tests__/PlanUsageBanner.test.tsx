import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlanUsageBanner } from '../components/PlanUsageBanner'

function renderBanner(currentUsers: number, limitUsers: number | null) {
  return render(
    <MemoryRouter>
      <PlanUsageBanner currentUsers={currentUsers} limitUsers={limitUsers} />
    </MemoryRouter>,
  )
}

describe('PlanUsageBanner', () => {
  it('renders nothing when limitUsers is null', () => {
    const { container } = renderBanner(5, null)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when usage is below 80%', () => {
    const { container } = renderBanner(7, 10)
    expect(container.firstChild).toBeNull()
  })

  it('renders banner when usage is exactly 80%', () => {
    renderBanner(8, 10)
    expect(screen.getByText(/límite de usuarios próximo/i)).toBeInTheDocument()
    expect(screen.getByText('Actualizar Plan')).toBeInTheDocument()
  })

  it('renders banner when usage is above 80%', () => {
    renderBanner(9, 10)
    expect(screen.getByText(/90%/)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Actualizar Plan' })
    expect(link).toHaveAttribute('href', '/subscription')
  })

  it('shows correct percentage in text', () => {
    renderBanner(9, 10)
    expect(screen.getByText(/9\/10/)).toBeInTheDocument()
    expect(screen.getByText(/90%/)).toBeInTheDocument()
  })
})
