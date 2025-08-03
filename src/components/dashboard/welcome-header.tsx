import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function WelcomeHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Welcome back, Jane!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's your productivity snapshot for today.
        </p>
      </div>
    </div>
  );
}
