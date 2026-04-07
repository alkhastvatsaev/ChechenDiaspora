import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'
import React from 'react'

// Mock de Framer Motion (peut poser problème en unit test SSR)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}))

// Mock de Next/Dynamic pour forcer le chargement immédiat ou mocké de Map
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="mock-map">Map loading mock...</div>
}))

test('Home page renders without SSR crash', () => {
  // Simuler le rendu initial
  render(<Home />)
  
  // Vérifier la présence d'éléments clés du design Apple/Vainakh
  const logoText = screen.getByText(/Кхерч \/ Diaspora/i)
  expect(logoText).toBeDefined()
  
  // Vérifier que le menu Amanat (Voyages) est visible
  const travelText = screen.getByText(/Аманат \/ Voyages/i)
  expect(travelText).toBeDefined()
  
  // Vérifier qu'un bouton d'action critique est présent
  const liveIndicator = screen.getByText(/LIVE/i)
  expect(liveIndicator).toBeDefined()
})
