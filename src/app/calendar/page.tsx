// src/app/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Task, getTasks } from '@/services/taskService';
import { Deadline, getDeadlines } from '@/services/deadlineService';
import { addDays, format, isSameDay, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarClock, CheckCircle2 } from 'lucide-react';

type CalendarEvent = (Task | Deadline) & { type: 'task' | 'deadline' };

export default function CalendarPage() {
    const { user } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (user) {
            const fetchEvents = async () => {
                setLoading(true);
                const tasks = await getTasks(user.uid);
                const deadlines = await getDeadlines(user.uid);

                const taskEvents: CalendarEvent[] = tasks.map(t => ({ ...t, type: 'task' }));
                const deadlineEvents: CalendarEvent[] = deadlines.map(d => ({ ...d, type: 'deadline' }));

                setEvents([...taskEvents, ...deadlineEvents]);
                setLoading(false);
            };
            fetchEvents();
        }
    }, [user]);

    const getEventDate = (event: CalendarEvent): Date | null => {
        if (event.type === 'task') {
            // Firestore timestamps need to be converted to Date objects
            return event.createdAt?.toDate ? event.createdAt.toDate() : null;
        }
        // Deadline dates are stored as ISO strings
        return parseISO(event.date);
    };

    const eventDays = events.map(getEventDate).filter((d): d is Date => d !== null);

    const selectedDayEvents = date ? events.filter(event => {
        const eventDate = getEventDate(event);
        return eventDate && isSameDay(eventDate, date);
    }).sort((a,b) => {
        const dateA = getEventDate(a);
        const dateB = getEventDate(b);
        if(!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime();
    }) : [];
    
    const getPriorityVariant = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardContent className="p-2">
                    {loading ? <Skeleton className="w-full h-[350px]" /> :
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full"
                            modifiers={{ 
                                event: eventDays,
                            }}
                            modifiersClassNames={{
                                event: 'bg-accent/50 rounded-full',
                            }}
                        />
                    }
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Schedule for {date ? format(date, 'MMMM do, yyyy') : '...'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 h-[350px] overflow-y-auto">
                        {loading ? (
                            <>
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </>
                        ) : selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map(event => (
                                <div key={`${event.type}-${event.id}`} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                                    {event.type === 'task' ? (
                                        <CheckCircle2 className={`mt-1 h-5 w-5 ${event.completed ? 'text-green-500' : 'text-muted-foreground' }`} />
                                    ) : (
                                        <CalendarClock className="mt-1 h-5 w-5 text-accent" />
                                    )}
                                    <div className="flex-grow">
                                        <p className="font-semibold">{event.title}</p>
                                        {event.type === 'task' && (
                                            <Badge variant={getPriorityVariant(event.priority)}>{event.priority}</Badge>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No events for this day.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
