"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, communityMember } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading) {
      // TEMPORARY: Bypass login check and redirect `/login` to `/`
      // const isAuth = user || communityMember;
      // if (!isAuth && pathname !== '/login') {
      //   router.replace('/login');
      // }
      
      if (pathname === '/login') {
        router.replace('/');
      }
    }
  }, [loading, router, pathname, isMounted]);

  // Immediately render if we are on the login page to avoid recursion/loops
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!isMounted || loading) {
    return <div className="min-h-screen bg-kherch-dark flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-hearth-amber/20 border-t-hearth-amber rounded-full animate-spin"></div>
    </div>;
  }

  if (user || communityMember) {
    return <>{children}</>;
  }

  return <div className="min-h-screen bg-kherch-dark" />;
}
