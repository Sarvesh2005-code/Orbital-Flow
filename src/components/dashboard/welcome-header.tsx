'use client';
import { useAuth } from '@/hooks/use-auth';
import { Calendar, Clock, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

export function WelcomeHeader() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 animate-in fade-in-50 duration-500">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {getGreeting()}, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'friend'}!
          </h1>
          <div className="hidden sm:flex items-center gap-1 text-orange-500">
            <Target className="h-5 w-5" />
          </div>
        </div>
        <p className="text-sm md:text-base text-muted-foreground">
          Here's your productivity snapshot for today.
        </p>
      </div>
      
      {/* Time and Date Display */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatTime()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">{formatDate()}</span>
          <span className="sm:hidden">{currentTime.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
