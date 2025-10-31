'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthToken } from '@/api';
import { useCurrentUser } from '@/hooks/useApi';
import { useAuthStore } from '@/stores/authStore';

interface AuthGuardProps {
  children: ReactNode;
}

const PUBLIC_AUTH_PREFIX = '/auth';

function hasAuthToken() {
  return !!getAuthToken();
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const { user } = useCurrentUser();
  const setCurrentUser = useAuthStore(s => s.setCurrentUser);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const isAuthRoute = useMemo(() => {
    if (!pathname) return false;
    return pathname === '/' ? false : pathname.startsWith(PUBLIC_AUTH_PREFIX);
  }, [pathname]);

  useEffect(() => {
    // Run on client only
    const tokenExists = hasAuthToken();

    // If on an auth route and already logged in, send to home
    if (isAuthRoute && (tokenExists || isAuthenticated)) {
      router.replace('/');
      setChecked(true);
      return;
    }

    // If on a protected route without token, redirect to sign-in
    if (!isAuthRoute && !tokenExists) {
      router.replace('/auth/sign-in');
      setChecked(true);
      return;
    }

    setChecked(true);
  }, [isAuthRoute, router, isAuthenticated]);

  // Sync SWR user with auth store for global availability
  useEffect(() => {
    setCurrentUser(user || null);
  }, [user, setCurrentUser]);

  // While deciding/redirecting, render a minimal placeholder to avoid flicker
  if (!checked) {
    return (
      <div className="container-fluid w-50 text-center h-100 justify-content-center align-items-center d-flex">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


