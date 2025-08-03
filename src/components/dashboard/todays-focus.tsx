// src/components/dashboard/todays-focus.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Task, getTasks, updateTask } from '@/services/taskService';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

export function TodaysFocus({ onTaskUpdate }: { onTaskUpdate: () => void}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        setLoading(true);
        const userTasks = await getTasks(user.uid);
        const sortedTasks = userTasks
          .filter(t => !t.completed)
          .sort((a, b) => {
            const priorityOrder = { High: 0, Medium: 1, Low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
        setTasks(sortedTasks.slice(0, 3));
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, onTaskUpdate]); // Re-run effect when onTaskUpdate changes (i.e. parent triggers refresh)

  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    await updateTask(taskId, { completed });
    onTaskUpdate(); // This will trigger a re-fetch in the parent component (dashboard)
  };


  const getPriorityVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
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
        <Link href="/tasks">
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </>
          ) : tasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks for today. Add one to get started!</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`focus-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={(checked) => handleTaskCompletion(task.id, !!checked)}
                  className="h-5 w-5"
                />
                <label htmlFor={`focus-${task.id}`} className={`ml-3 flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                  {task.title}
                </label>
                <Badge variant={getPriorityVariant(task.priority)} className="ml-auto">
                  {task.priority}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
