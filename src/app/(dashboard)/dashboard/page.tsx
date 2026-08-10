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
            <div className="flex items-center gap-3 px-4 pt-4 lg:hidden">
                <Image src="/icons/orbital-flow-logo.png" alt="Orbital Flow" width={28} height={28} className="rounded-md" />
                <span className="text-sm text-muted-foreground">Orbital Flow</span>
            </div>
            <div className="container mx-auto px-4 py-6 space-y-8" key={refreshKey}>
                {/* Welcome Header */}
                <WelcomeHeader />

                {/* Bento Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* Top Row: Focus takes up 2 cols, Chart takes 1 */}
                    <div className="md:col-span-2 xl:col-span-2 h-full">
                        <TodaysFocus onTaskUpdate={refreshData} />
                    </div>
                    <div className="md:col-span-2 xl:col-span-1 h-full">
                        <ProductivityChart />
                    </div>

                    {/* Middle Row: Habits and Deadlines */}
                    <div className="md:col-span-1 xl:col-span-2 h-full">
                        <HabitTracker />
                    </div>
                    <div className="md:col-span-1 xl:col-span-1 h-full">
                        <UpcomingDeadlines />
                    </div>

                    {/* Bottom Row: AI Assistant full width */}
                    <div className="md:col-span-2 xl:col-span-3">
                        <AiAssistant />
                    </div>
                </div>
            </div>
        </div>
    );
}
