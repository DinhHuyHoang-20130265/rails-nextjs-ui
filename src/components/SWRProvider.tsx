'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global SWR configuration
        refreshInterval: 0, // Disable automatic refresh by default
        revalidateOnFocus: false, // Disable revalidation on window focus
        revalidateOnReconnect: true, // Revalidate when network reconnects
        dedupingInterval: 2000, // Dedupe requests within 2 seconds
        errorRetryCount: 3, // Retry failed requests 3 times
        errorRetryInterval: 5000, // Wait 5 seconds between retries
        // Prevent hydration issues by not fetching on mount during SSR
        revalidateOnMount: typeof window !== 'undefined',
        onError: (error) => {
          // Global error handler
          console.error('SWR Error:', error);
          
          // You can add global error handling here
          // e.g., show toast notifications, log to monitoring service
        },
        onSuccess: (data, key) => {
          // Global success handler
          console.log('SWR Success:', key, data);
        },
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Custom retry logic
          if (error.status === 404) return; // Don't retry 404s
          if (error.status === 401) return; // Don't retry auth errors
          if (retryCount >= 3) return; // Don't retry more than 3 times
          
          // Retry after 5 seconds
          setTimeout(() => revalidate({ retryCount }), 5000);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
