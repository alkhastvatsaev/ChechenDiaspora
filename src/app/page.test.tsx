import { render, screen, fireEvent } from '@testing-library/react'
import Home from './page'
import { describe, it, expect, vi } from 'vitest'

// Mock de components qui pourraient avoir des effets de bord
vi.mock('@/components/Map', () => ({
  default: () => <div data-testid="mock-map">Map Mock</div>
}))

describe('Home Page', () => {
  it('renders the main title after clicking Hub', () => {
    render(<Home />)
    fireEvent.click(screen.getByText(/ХАБ/i))
    // Nous vérifions que le titre "Кхерч / Хаб" est bien rendu
    const title = screen.getByText(/Кхерч \/ Хаб/i)
    expect(title).toBeInTheDocument()
  })

  it('renders the "Join" button after clicking Hub', () => {
    render(<Home />)
    fireEvent.click(screen.getByText(/ХАБ/i))
    const joinButton = screen.getByText(/Вступить в Сеть/i)
    expect(joinButton).toBeInTheDocument()
  })
})
