import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { upcomingDeadlines } from '@/lib/placeholder-data';
import { Button } from '../ui/button';
import { MoreHorizontal, CalendarClock } from 'lucide-react';

export function UpcomingDeadlines() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className="font-headline text-2xl">Upcoming</CardTitle>
        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {upcomingDeadlines.map((deadline) => (
            <li key={deadline.id} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CalendarClock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">{deadline.title}</p>
                <p className="text-sm text-muted-foreground">{deadline.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
