'use client';

import { LandingPage } from '@/components/layout/landing-page';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      // Clean loading state matching layout
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Image src="/icons/orbital-flow-logo.png" alt="Orbital Flow" width={48} height={48} className="rounded-lg shadow-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return <LandingPage />;
}