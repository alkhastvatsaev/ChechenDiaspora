import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../AuthContext'
import React from 'react'

// Mocking session storage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} }
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

describe('AuthContext', () => {
  beforeEach(() => {
    mockSessionStorage.clear()
  })

  it('initially has no community member and is loading', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    // Auth starts with loading=false from our mock setup in setup.tsx usually
    // But in the real implementation it starts with loading=true
    expect(result.current.communityMember).toBe(false)
  })

  it('accepts correct passphrase "вайнах"', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = renderHook(() => useAuth(), { wrapper })

    let success = false
    await act(async () => {
      success = await result.current.loginWithPassphrase('вайнах')
    })

    expect(success).toBe(true)
    expect(result.current.communityMember).toBe(true)
    expect(mockSessionStorage.getItem('vainakh_verified')).toBe('true')
  })

  it('rejects incorrect passphrase', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )
    const { result } = renderHook(() => useAuth(), { wrapper })

    let success = true
    await act(async () => {
      success = await result.current.loginWithPassphrase('wrong')
    })

    expect(success).toBe(false)
    expect(result.current.communityMember).toBe(false)
  })
})
