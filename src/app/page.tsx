// src/app/page.tsx
'use client';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { TodaysFocus } from '@/components/dashboard/todays-focus';
import { HabitTracker } from '@/components/dashboard/habit-tracker';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import { ProductivityChart } from '@/components/dashboard/productivity-chart';
import { AiAssistant } from '@/components/dashboard/ai-assistant';
import { useAuth } from '@/hooks/use-auth';
import { useCallback, useState } from 'react';
import { LandingPage } from '@/components/layout/landing-page';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-4 pt-4">
        <Image src="/icons/orbital-flow-logo.png" alt="Orbital Flow" width={28} height={28} className="rounded-md" />
        <span className="text-sm text-muted-foreground">Orbital Flow</span>
      </div>
      <div className="container mx-auto px-4 py-6 space-y-8" key={refreshKey}>
        {/* Welcome Header */}
        <WelcomeHeader />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left Column - Tasks and Habits */}
          <div className="xl:col-span-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TodaysFocus onTaskUpdate={refreshData} />
              <HabitTracker />
            </div>
            
            {/* AI Assistant - Full width on larger screens */}
            <div className="lg:block hidden">
              <AiAssistant />
            </div>
          </div>
          
          {/* Right Sidebar - Analytics and Deadlines */}
          <div className="xl:col-span-4 space-y-6">
            <ProductivityChart />
            <UpcomingDeadlines />
          </div>
        </div>
        
        {/* AI Assistant - Mobile/Tablet View */}
        <div className="lg:hidden">
          <AiAssistant />
        </div>
      </div>
    </div>
  );
}


export default function Page() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <LandingPage />;
    }

    return <Dashboard />;
}