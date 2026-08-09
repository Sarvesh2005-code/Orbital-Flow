'use client';

import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  // Initialize dark mode side effects on the client
  useDarkMode();
  
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
