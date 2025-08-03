'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, PlusCircle } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="hidden md:block">
        <h1 className="font-headline text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
