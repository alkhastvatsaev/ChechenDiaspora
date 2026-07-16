import { render, screen, fireEvent } from '@testing-library/react'
import Home from './page'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/components/Map', () => ({
  default: () => <div data-testid="mock-map">Map Mock</div>
}))

describe('Home Page', () => {
  it('opens the community hub from the map controls', () => {
    render(<Home />)
    fireEvent.click(screen.getByRole('button', { name: /return to map/i }))
    fireEvent.click(screen.getByRole('button', { name: /open community hub/i }))

    expect(screen.getByRole('heading', { name: /Вайнехан Бёлхи/i })).toBeInTheDocument()
  })

  it('renders the help input in the navigation bar', () => {
    render(<Home />)

    expect(screen.getByPlaceholderText(/Чем мы можем помочь/i)).toBeInTheDocument()
  })
})
