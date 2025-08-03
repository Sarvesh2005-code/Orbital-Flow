'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, PlusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AddTaskDialog } from '../add-task-dialog';
import { useState } from 'react';

function getPageTitle(pathname: string) {
  const segment = pathname.split('/').pop() || 'dashboard';
  if (segment === '') return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

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
        <AddTaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
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
