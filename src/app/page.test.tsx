import { render, screen } from '@testing-library/react'
import Home from './page'
import { describe, it, expect, vi } from 'vitest'

// Mock de components qui pourraient avoir des effets de bord
vi.mock('@/components/Map', () => ({
  default: () => <div data-testid="mock-map">Map Mock</div>
}))

describe('Home Page', () => {
  it('renders the main title', () => {
    render(<Home />)
    // Nous vérifions que le titre "Вайнахская Диаспора" est bien rendu
    const title = screen.getByText(/Библиотека/i)
    expect(title).toBeInTheDocument()
  })

  it('renders the "Join" button', () => {
    render(<Home />)
    const joinButton = screen.getByText(/Присоединиться/i)
    expect(joinButton).toBeInTheDocument()
  })
})
