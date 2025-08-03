'use client';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { TodaysFocus } from '@/components/dashboard/todays-focus';
import { HabitTracker } from '@/components/dashboard/habit-tracker';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import { ProductivityChart } from '@/components/dashboard/productivity-chart';
import { AiAssistant } from '@/components/dashboard/ai-assistant';
import ProtectedRoute from '@/components/layout/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <WelcomeHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <TodaysFocus />
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
    </ProtectedRoute>
  );
}
