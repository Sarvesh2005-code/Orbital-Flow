// src/components/layout/sidebar.tsx
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
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  BotMessageSquare,
  Calendar,
  CheckSquare2,
  Goal,
  LayoutDashboard,
  Mail,
  NotebookText,
  Repeat,
  School,
  Settings,
  Sun,
  Moon,
  Target,
  Sparkles,
  Activity,
  Palette
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useRealtimeNotifications } from '@/hooks/use-realtime-data';
import { motion } from 'framer-motion';
import { useRoutePrefetch, useOptimizedNavigation } from '@/hooks/use-route-prefetch';

const OrbitalLogo = ({ isCollapsed }: { isCollapsed?: boolean }) => (
  <motion.div 
    className="flex items-center gap-3 p-2"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="relative">
      <Image
        src="/icons/orbital-flow-logo.png"
        alt="Orbital Flow"
        width={32}
        height={32}
        className="rounded-md drop-shadow-lg"
        priority
      />
      <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
    </div>
    {!isCollapsed && (
      <div className="flex flex-col">
        <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Orbital Flow
        </h1>
        <p className="text-xs text-muted-foreground -mt-1">Productivity Hub</p>
      </div>
    )}
  </motion.div>
);


export function AppSidebar() {
  const pathname = usePathname();
  const useIsActive = (path: string) => pathname === path;
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { unreadCount } = useRealtimeNotifications();
  const { navigateTo } = useOptimizedNavigation();
  
  // Prefetch routes for faster navigation
  useRoutePrefetch();

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      badge: null,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Tasks',
      url: '/tasks',
      icon: CheckSquare2,
      badge: null,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Notes',
      url: '/notes',
      icon: NotebookText,
      badge: null,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Calendar',
      url: '/calendar',
      icon: Calendar,
      badge: null,
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Habits',
      url: '/habits',
      icon: Repeat,
      badge: null,
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Goals',
      url: '/goals',
      icon: Goal,
      badge: null,
      gradient: 'from-yellow-500 to-yellow-600'
    }
  ];

  const secondaryItems = [
    {
      title: 'Email',
      url: '/email',
      icon: Mail,
      badge: null,
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Classroom',
      url: '/classroom',
      icon: School,
      badge: null,
      gradient: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon"
      className="border-r border-border/40 backdrop-blur-xl bg-gradient-to-b from-background/95 via-background/90 to-background/95"
    >
      {/* Textured Background Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_52%)] bg-[length:8px_8px]" />
      </div>
      
      <SidebarHeader className="relative">
        <OrbitalLogo />
      </SidebarHeader>
      
      <SidebarContent className="relative">
        {/* Main Navigation */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 px-2 py-1 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              Workspace
            </span>
          </div>
          <SidebarMenu>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = useIsActive(item.url);
              
              return (
                <motion.div
                  key={item.url}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <SidebarMenuItem>
                    <div 
                      className="w-full cursor-pointer" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(item.url);
                      }}
                    >
                      <SidebarMenuButton 
                        isActive={isActive} 
                        tooltip={item.title}
                        className={`relative group transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg' 
                            : 'hover:bg-accent/50'
                        }`}
                      >
                        <div className={`p-1 rounded-md ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-gradient-to-r ' + item.gradient + ' p-1'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-white'
                          }`} />
                        </div>
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                </motion.div>
              );
            })}
          </SidebarMenu>
        </div>
        
        <SidebarSeparator className="my-4" />
        
        {/* Secondary Navigation */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 px-2 py-1 mb-3">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              Tools
            </span>
          </div>
          <SidebarMenu>
            {secondaryItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = useIsActive(item.url);
              
              return (
                <motion.div
                  key={item.url}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: (menuItems.length + index) * 0.05 }}
                >
                  <SidebarMenuItem>
                    <div 
                      className="w-full cursor-pointer" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(item.url);
                      }}
                    >
                      <SidebarMenuButton 
                        isActive={isActive} 
                        tooltip={item.title}
                        className={`relative group transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg' 
                            : 'hover:bg-accent/50'
                        }`}
                      >
                        <div className={`p-1 rounded-md ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-gradient-to-r ' + item.gradient + ' p-1'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-white'
                          }`} />
                        </div>
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant="destructive" 
                            className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                </motion.div>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarSeparator className="my-4" />
      
      <SidebarFooter className="relative space-y-3 p-4">
        {/* Theme Switcher */}
        <motion.div 
          className="group-data-[collapsible=icon]:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Theme
            </span>
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <Button 
              variant={!isDarkMode ? 'default' : 'ghost'} 
              size="sm" 
              className="flex-1 h-8 transition-all duration-200" 
              onClick={() => toggleDarkMode(false)}
            >
              <Sun className="h-4 w-4 mr-1" />
              <span className="text-xs">Light</span>
            </Button>
            <Button 
              variant={isDarkMode ? 'default' : 'ghost'} 
              size="sm" 
              className="flex-1 h-8 transition-all duration-200" 
              onClick={() => toggleDarkMode(true)}
            >
              <Moon className="h-4 w-4 mr-1" />
              <span className="text-xs">Dark</span>
            </Button>
          </div>
        </motion.div>
        
        {/* Settings Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="outline" 
            className={`w-full justify-start gap-3 h-10 transition-all duration-200 cursor-pointer ${
              useIsActive('/settings') 
                ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg border-transparent' 
                : 'hover:bg-accent/50 border-border/50'
            }`}
            onClick={() => navigateTo('/settings')}
          >
            <div className="p-1 rounded-md bg-gradient-to-r from-slate-500 to-slate-600">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium group-data-[collapsible=icon]:hidden">Settings</span>
          </Button>
        </motion.div>
        
        {/* User Profile */}
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-background to-muted/30 border border-border/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <UserAvatar />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0 flex-1">
            <span className="font-semibold text-sm text-foreground truncate">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
