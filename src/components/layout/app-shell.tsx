'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

const FullPageLoader = () => (
    <div className="flex items-center justify-center h-screen">
      <Skeleton className="h-20 w-20 rounded-full" />
    </div>
);

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLandingPage = pathname === '/';

  useEffect(() => {
    if (!loading && !user && !isAuthPage && !isLandingPage) {
      router.push('/login');
    }
  }, [user, loading, router, pathname, isAuthPage, isLandingPage]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (isAuthPage || (!user && isLandingPage)) {
    return <>{children}</>;
  }

  if (!user) {
    return <FullPageLoader />; // Or redirect immediately
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
