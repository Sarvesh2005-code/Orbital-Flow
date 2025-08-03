import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { todaysFocusTasks } from '@/lib/placeholder-data';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';

export function TodaysFocus() {
  const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className="font-headline text-2xl">Today's Focus</CardTitle>
        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysFocusTasks.map((task) => (
            <div key={task.id} className="flex items-center p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox id={task.id} checked={task.completed} className="h-5 w-5" />
              <label htmlFor={task.id} className={`ml-3 flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                {task.title}
              </label>
              <Badge variant={getPriorityVariant(task.priority)} className="ml-auto">
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
