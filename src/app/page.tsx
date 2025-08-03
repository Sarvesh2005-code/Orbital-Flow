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

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
      <div className="space-y-6" key={refreshKey}>
        <WelcomeHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <TodaysFocus onTaskUpdate={refreshData} />
            <HabitTracker />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <ProductivityChart />
            <UpcomingDeadlines />
          </div>
        </div>
        <div className="grid grid-cols-1">
          <AiAssistant />
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