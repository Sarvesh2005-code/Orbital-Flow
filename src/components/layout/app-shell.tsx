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
        <div className="flex flex-col min-h-screen relative">
          {/* Textured Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_49%,rgba(255,255,255,0.02)_51%,transparent_52%)] bg-[length:20px_20px] dark:bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.01)_49%,rgba(255,255,255,0.01)_51%,transparent_52%)]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 pointer-events-none" />
          
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
