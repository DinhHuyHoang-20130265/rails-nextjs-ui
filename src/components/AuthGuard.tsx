'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthToken } from '@/api';

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

  const isAuthRoute = useMemo(() => {
    if (!pathname) return false;
    return pathname === '/' ? false : pathname.startsWith(PUBLIC_AUTH_PREFIX);
  }, [pathname]);

  useEffect(() => {
    // Run on client only
    const tokenExists = hasAuthToken();

    // If on an auth route and already logged in, send to home
    if (isAuthRoute && tokenExists) {
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
  }, [isAuthRoute, router]);

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


