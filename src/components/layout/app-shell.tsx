'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { NotificationService } from '@/services/notificationService';

const FullPageLoader = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <Image src="/icons/orbital-flow-logo.png" alt="Orbital Flow" width={64} height={64} className="rounded-xl shadow" />
        <div className="h-2 w-40 overflow-hidden rounded bg-muted">
          <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] bg-gradient-to-r from-orange-500 to-red-600" />
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(50%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
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

  // Register push notifications after sign-in and save FCM token
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        try {
          const token = await NotificationService.requestPermission();
          if (token) {
            await NotificationService.saveFCMToken(user.uid, token);
          }
        } catch (err) {
          console.warn('Push notification setup failed:', err);
        }
      })();
    }
  }, [loading, user]);

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
            <div className="absolute inset-0" style={{
              opacity: 0.08,
              backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23n)\\' opacity=\\'0.5\\'/%3E%3C/svg%3E')"
            }} />
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
