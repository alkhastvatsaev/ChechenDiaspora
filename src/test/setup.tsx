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
  getAuth: vi.fn(() => ({})),
  signInAnonymously: vi.fn(() => Promise.resolve({ user: { uid: 'anonymous' } })),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Immediate callback for loading state transition
    callback(null)
    return () => {}
  }),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(() => Promise.resolve()),
}));

// Mock de Firestore
vi.mock('firebase/firestore', () => ({
  initializeFirestore: vi.fn(),
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn((_, callback) => {
    callback({
      forEach: () => {},
      empty: true,
      docs: []
    })
    return () => {}
  }),
  getDocs: vi.fn(() => Promise.resolve({ docs: [], empty: true })),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
}));

// Mock de Storage
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn(() => Promise.resolve({})),
  getDownloadURL: vi.fn(() => Promise.resolve('https://example.com/audio.webm')),
}));

// Mock Framer Motion (pour éviter les problèmes de timing/animation)
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
  };
});

// Mock de Leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  Circle: () => null,
  Polygon: () => null,
  Polyline: () => null,
  GeoJSON: () => null,
  useMap: () => ({ setView: vi.fn(), getZoom: vi.fn(() => 3), on: vi.fn(), off: vi.fn() }),
}));
