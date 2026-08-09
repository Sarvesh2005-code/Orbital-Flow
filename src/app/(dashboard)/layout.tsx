'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { NotificationService } from '@/services/notificationService';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Push notifications setup
    useEffect(() => {
        if (!loading && user) {
            (async () => {
                try {
                    const token = await NotificationService.requestPermission();
                    if (token) {
                        await NotificationService.saveFCMToken(user.uid, token);
                    }
                } catch (err) {
                    // Permission denied or error
                }
            })();
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Image src="/icons/orbital-flow-logo.png" alt="Orbital Flow" width={64} height={64} className="rounded-xl shadow" />
                    <div className="h-2 w-40 overflow-hidden rounded bg-muted">
                        <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] bg-gradient-to-r from-orange-500 to-red-600" />
                    </div>
                    <style jsx>{`
               @keyframes loading {
                 0% { transform: translateX(-100%); }
                 50% { transform: translateX(50%); }
                 100% { transform: translateX(200%); }
               }
             `}</style>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-screen relative">
                    {/* Textured Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_49%,rgba(255,255,255,0.02)_51%,transparent_52%)] bg-[length:20px_20px] dark:bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.01)_49%,rgba(255,255,255,0.01)_51%,transparent_52%)]" />
                    </div>

                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
                        <div className="mx-auto max-w-7xl h-full">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
