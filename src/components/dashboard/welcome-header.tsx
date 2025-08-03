'use client';
import { useAuth } from '@/hooks/use-auth';

export function WelcomeHeader() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.displayName?.split(' ')[0] || user?.email || 'friend'}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's your productivity snapshot for today.
        </p>
      </div>
    </div>
  );
}
