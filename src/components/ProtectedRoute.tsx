"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div className="min-h-screen bg-kherch-dark flex items-center justify-center animate-pulse" />;
  }

  // Allow rendering if user is authenticated OR if we are on the login page
  if (user || pathname === '/login') {
    return <>{children}</>;
  }

  return <div className="min-h-screen bg-kherch-dark flex items-center justify-center" />;
}
