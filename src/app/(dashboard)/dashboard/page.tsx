'use client';

import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { TodaysFocus } from '@/components/dashboard/todays-focus';
import { HabitTracker } from '@/components/dashboard/habit-tracker';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { useCallback, useState } from 'react';

const ProductivityChart = dynamic(() => import('@/components/dashboard/productivity-chart').then(mod => mod.ProductivityChart), {
    loading: () => <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />,
    ssr: false
});

const AiAssistant = dynamic(() => import('@/components/dashboard/ai-assistant').then(mod => mod.AiAssistant), {
    loading: () => <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-xl" />,
    ssr: false
});

export default function DashboardPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshData = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <div className="min-h-screen bg-transparent relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-background pointer-events-none" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-background pointer-events-none" />
            <div className="flex items-center gap-3 px-4 pt-4 lg:hidden">
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
