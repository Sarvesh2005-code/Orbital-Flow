'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useRoutePrefetch = () => {
  const router = useRouter();

  useEffect(() => {
    // Prefetch critical routes for faster navigation
    const criticalRoutes = [
      '/',
      '/tasks',
      '/habits',
      '/goals',
      '/notes',
      '/calendar',
      '/settings',
      '/notifications'
    ];

    // Prefetch routes after initial load
    const prefetchTimeout = setTimeout(() => {
      criticalRoutes.forEach(route => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(prefetchTimeout);
  }, [router]);

  return { router };
};

// Hook for optimized navigation with loading states
export const useOptimizedNavigation = () => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    // Add subtle loading indication
    document.body.style.cursor = 'wait';
    
    // Navigate immediately
    router.push(route);
    
    // Reset cursor after a short delay
    setTimeout(() => {
      document.body.style.cursor = 'default';
    }, 300);
  };

  return { navigateTo };
};
