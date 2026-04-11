import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'
import React from 'react'

// Mock de Framer Motion (peut poser problème en unit test SSR)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<any>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.PropsWithChildren<any>) => <h1 {...props}>{children}</h1>,
    button: ({ children, ...props }: React.PropsWithChildren<any>) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: React.PropsWithChildren<any>) => <section {...props}>{children}</section>
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>
}))

// Mock de Next/Dynamic pour forcer le chargement immédiat ou mocké de Map
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="mock-map">Map loading mock...</div>
}))

test('Home page renders without SSR crash', () => {
  // Simuler le rendu initial
  render(<Home />)
  
  // Vérifier la présence d'éléments clés du design Apple/Vainakh (toujours visibles)
  const hubButton = screen.getByText(/ХАБ/i)
  expect(hubButton).toBeDefined()
  
  // Verify the new main admin request button
  expect(screen.getByText(/Создать запрос администратору/i)).toBeInTheDocument()
})
