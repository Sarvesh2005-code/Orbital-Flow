// src/components/ui/lazy-component.tsx
'use client';

import { useState, useRef, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from './skeleton';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  className?: string;
  skeletonHeight?: string;
  skeletonRows?: number;
}

export function LazyComponent({
  children,
  fallback,
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '50px',
  className,
  skeletonHeight = 'h-32',
  skeletonRows = 1,
}: LazyComponentProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  const defaultFallback = (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: skeletonRows }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={`bg-muted rounded-md ${skeletonHeight} w-full`} 
               style={{ animationDelay: `${i * 0.1}s` }} />
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {inView ? children : fallback || defaultFallback}
    </div>
  );
}

// Performance optimized component wrapper
interface PerformantComponentProps {
  children: ReactNode;
  loading?: boolean;
  error?: Error | null;
  retry?: () => void;
  className?: string;
}

export function PerformantComponent({
  children,
  loading,
  error,
  retry,
  className,
}: PerformantComponentProps) {
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <div className="mb-4 text-destructive">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold">Something went wrong</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          {error.message || 'An error occurred while loading this component.'}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
