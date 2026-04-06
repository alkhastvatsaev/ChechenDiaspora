"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithPassphrase: (passphrase: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithPassphrase: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithPassphrase = async (passphrase: string) => {
    const normalizedInput = passphrase.trim().toLowerCase();
    const correctPassphrase = "вайнах";

    if (normalizedInput === correctPassphrase) {
      try {
        // Attempt to sign in anonymously for database access
        await signInAnonymously(auth);
        return true;
      } catch (error) {
        console.error("Auth error:", error);
        // Fallback: even if Firebase is slow/failing during build/init, 
        // if the password is correct, we let the brother/sister in.
        return true; 
      }
    }
    return false;
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithPassphrase, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
