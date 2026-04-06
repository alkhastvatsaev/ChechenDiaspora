import '@testing-library/jest-dom'
import '@testing-library/react'
import { vi } from 'vitest'

// Mock de la Firebase Realtime Database pour les tests unitaires
vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  onValue: vi.fn((_, callback) => {
    // Simuler des données par défaut
    callback({
      val: () => ({})
    })
    return () => {}
  }),
  push: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

// Mock de Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

// Mock de Leaflet (car il nécessite le DOM et des dimensions)
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));
