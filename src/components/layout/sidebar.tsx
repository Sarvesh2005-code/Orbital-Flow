'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { UserAvatar } from '@/components/user-avatar';
import {
  BotMessageSquare,
  Calendar,
  CheckSquare2,
  Goal,
  LayoutDashboard,
  NotebookText,
  Repeat,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '../ui/button';

const OrbityLogo = () => (
    <div className="flex items-center gap-2.5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <path d="M12 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
            <path d="M16.82 15.18C15.09 14.07 13.08 13.5 11 13.5c-2.08 0-4.09.57-5.82 1.68C4.42 15.7 4 16.33 4 17v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-.67-.42-1.3-1.18-1.82z" fill="hsl(var(--accent))" fillOpacity="0.8"/>
        </svg>
        <h1 className="text-lg font-headline font-semibold text-sidebar-foreground">Orbital Flow</h1>
    </div>
);


export function AppSidebar() {
  // A mock hook to simulate path checking
  const useIsActive = (path: string) => path === '/';

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <OrbityLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={useIsActive('/')} tooltip="Dashboard">
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={useIsActive('/tasks')} tooltip="Tasks">
              <CheckSquare2 />
              Tasks
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={useIsActive('/calendar')} tooltip="Calendar">
              <Calendar />
              Calendar
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={useIsActive('/habits')} tooltip="Habits">
              <Repeat />
              Habits
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={useIsActive('/notes')} tooltip="Notes">
              <NotebookText />
              Notes
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={useIsActive('/goals')} tooltip="Goals">
              <Goal />
              Goals
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={useIsActive('/ai-assistant')} tooltip="AI Assistant">
              <BotMessageSquare />
              AI Assistant
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="flex-col !items-stretch gap-2">
         <div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
             <Button variant="ghost" size="icon" className="flex-1 justify-center"><Sun className="size-4" /></Button>
             <Button variant="ghost" size="icon" className="flex-1 justify-center"><Moon className="size-4" /></Button>
             <Button variant="ghost" size="icon" className="flex-1 justify-center"><Settings className="size-4" /></Button>
         </div>
         <div className="flex items-center gap-2">
            <UserAvatar />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm text-sidebar-foreground">Jane Doe</span>
                <span className="text-xs text-sidebar-foreground/70">Pro Member</span>
            </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
