// src/app/notifications/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const placeholderNotifications = [
    { id: 1, type: 'task', message: 'Your task "Design the new landing page" is due tomorrow.', time: '2 hours ago' },
    { id: 2, type: 'goal', message: 'You\'ve made progress on your "Learn Spanish" goal!', time: '1 day ago' },
    { id: 3, type: 'habit', message: 'You completed your "Morning workout" habit. Keep it up!', time: '2 days ago' },
    { id: 4, type: 'system', message: 'Welcome to Orbital Flow!', time: '3 days ago' },
];

export default function NotificationsPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-6 w-6" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            You have {placeholderNotifications.filter(n=>!n.hasOwnProperty('read')).length} unread notifications.
                        </CardDescription>
                    </div>
                    <Button variant="ghost">
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {placeholderNotifications.map(notification => (
                            <div key={notification.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                                <Avatar className="mt-1">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Bell className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-medium">{notification.message}</p>
                                    <p className="text-sm text-muted-foreground">{notification.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center pt-8">
                         <p className="text-sm text-muted-foreground">This is a placeholder page for notifications and alarms.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
