"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  communityMember: boolean;
  loginWithPassphrase: (passphrase: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  communityMember: false,
  loginWithPassphrase: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [communityMember, setCommunityMember] = useState(() => {
    // TEMPORARY: Auto-verify everyone and skip passphrase login
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('vainakh_verified');
      if (stored === 'true') return true;
      
      // Auto-verify even if not in session storage (preserving temporary skip logic)
      sessionStorage.setItem('vainakh_verified', 'true');
      return true;
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        try {
          await signInAnonymously(auth);
          // onAuthStateChanged will fire again with the new user
        } catch (error) {
          console.error("Auto-login error:", error);
          setLoading(false); // prevent infinite loading if auth fails
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithPassphrase = async (passphrase: string) => {
    const normalizedInput = passphrase.trim().toLowerCase();
    const validPassphrases = ["вайнах", "vainakh", "nokhchi", "chechen", "алхаст"];

    if (validPassphrases.includes(normalizedInput)) {
      // Mark as verified for the session
      setCommunityMember(true);
      sessionStorage.setItem('vainakh_verified', 'true');
      
      try {
        // Attempt to sign in anonymously for database access
        await signInAnonymously(auth);
        return true;
      } catch (error) {
        console.error("Auth error:", error);
        // Fallback: even if Firebase fails, we are verified
        return true; 
      }
    }
    return false;
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, communityMember, loginWithPassphrase, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
