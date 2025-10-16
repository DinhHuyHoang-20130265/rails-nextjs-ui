'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { routerService } from '@/helpers/router';

interface RouterProviderProps {
  children: React.ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const router = useRouter();

  useEffect(() => {
    // Initialize the router service with the Next.js router
    routerService.setRouter(router);
  }, [router]);

  return <>{children}</>;
}
