// src/components/layout/header.tsx
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, PlusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AddTaskDialog } from '../add-task-dialog';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

function getPageTitle(pathname: string) {
  if (pathname === '/') return 'Dashboard';
  const segment = pathname.split('/').pop() || 'dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  // This function will be called when a task is added,
  // to refresh the data on the current page if needed.
  const handleTaskAdded = useCallback(() => {
    // A simple way to re-trigger data fetching on the page
    router.refresh(); 
  }, [router]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="hidden md:block">
        <h1 className="font-headline text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <AddTaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} onTaskAdded={handleTaskAdded}>
            <Button onClick={() => setIsTaskDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
            </Button>
        </AddTaskDialog>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
