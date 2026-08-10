// src/app/notifications/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { NotificationService } from '@/services/notificationService';
import { useRealtimeNotifications } from '@/hooks/use-realtime-data';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
    const { notifications, loading } = useRealtimeNotifications();
    const { user } = useAuth();
    const { toast } = useToast();
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPermissionStatus(Notification.permission);
        }
        
        const unsub = NotificationService.onMessage((payload) => {
            console.log('Foreground notification:', payload);
        });
        return () => {
            if (typeof unsub === 'function') unsub();
        };
    }, []);

    const requestPermission = async () => {
        try {
            const token = await NotificationService.requestPermission();
            if (token && user) {
                await NotificationService.saveFCMToken(user.uid, token);
                setPermissionStatus('granted');
                toast({
                    title: 'Notifications Enabled',
                    description: 'You will now receive push notifications.',
                });
            } else if (Notification.permission === 'denied') {
                setPermissionStatus('denied');
                toast({
                    title: 'Permission Denied',
                    description: 'You have blocked notifications. Please enable them in your browser settings.',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {permissionStatus === 'default' && (
                <Alert className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Enable Push Notifications</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 text-blue-700/80 dark:text-blue-400/80">
                        Never miss a deadline or habit reminder again. Enable push notifications for Orbital Flow.
                        <Button size="sm" onClick={requestPermission} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                            Enable Notifications
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-6 w-6" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            You have {notifications.filter(n=>!n.isRead).length} unread notifications.
                        </CardDescription>
                    </div>
                    {notifications.length > 0 && (
                        <Button variant="ghost">
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground animate-pulse">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>You're all caught up!</p>
                            <p className="text-sm">No new notifications.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map(notification => (
                                <div key={notification.id} className={`flex items-start gap-4 p-3 rounded-lg ${notification.isRead ? 'opacity-70' : 'bg-muted/50'}`}>
                                    <Avatar className="mt-1">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            <Bell className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <p className="font-medium">{notification.message}</p>
                                        {notification.createdAt && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(notification.createdAt.seconds * 1000).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    {!notification.isRead && (
                                        <Button variant="ghost" size="sm" onClick={() => notification.id && NotificationService.markAsRead(notification.id)}>
                                            Mark Read
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
