"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, communityMember } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && !communityMember && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [user, communityMember, loading, router, pathname]);

  if (loading) {
    return <div className="min-h-screen bg-kherch-dark flex items-center justify-center animate-pulse" />;
  }

  // Allow rendering if user is authenticated OR community verified OR if we are on the login page
  if (user || communityMember || pathname === '/login') {
    return <>{children}</>;
  }

  return <div className="min-h-screen bg-kherch-dark flex items-center justify-center" />;
}
