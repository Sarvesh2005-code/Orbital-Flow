'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { QueryProvider } from '@/providers/QueryProvider';
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
