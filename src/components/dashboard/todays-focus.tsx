// src/components/dashboard/todays-focus.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal, Plus, Focus, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { Task } from '@/services/taskService';
import { useAuth } from '@/hooks/use-auth';
import { useTodaysFocus, useUpdateTask } from '@/hooks/use-task-queries';
import { Skeleton } from '../ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export function TodaysFocus({ onTaskUpdate }: { onTaskUpdate: () => void}) {
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use optimized query hook for today's focus tasks
  const { tasks, isLoading: loading } = useTodaysFocus();
  const updateTaskMutation = useUpdateTask();

  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    setCompletingTask(taskId);
    
    updateTaskMutation.mutate(
      { taskId, updates: { completed, completedAt: completed ? new Date() : null } },
      {
        onSuccess: () => {
          if (completed) {
            toast({
              title: 'Task Completed! 🎉',
              description: 'Great job! Keep up the momentum.',
              variant: 'default',
            });
          }
          onTaskUpdate(); // This will trigger a re-fetch in the parent component (dashboard)
        },
        onSettled: () => {
          setCompletingTask(null);
        }
      }
    );
  };


  const getPriorityVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-500">
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <div className="flex items-center gap-2">
            <Focus className="h-5 w-5 text-orange-500" />
            <CardTitle className="font-headline text-xl md:text-2xl">Today's Focus</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/tasks">
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <Focus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-3">No tasks for today</p>
              <Link href="/tasks">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first task
                </Button>
              </Link>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 group ${
                      completingTask === task.id ? 'opacity-50' : ''
                    }`}
                  >
                    <Checkbox
                      id={`focus-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={(checked) => handleTaskCompletion(task.id, !!checked)}
                      className="h-5 w-5 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      disabled={completingTask === task.id}
                    />
                    <label 
                      htmlFor={`focus-${task.id}`} 
                      className={`ml-3 flex-1 text-sm font-medium cursor-pointer transition-all duration-200 ${
                        task.completed 
                          ? 'line-through text-muted-foreground' 
                          : 'text-card-foreground group-hover:text-foreground'
                      }`}
                    >
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2">
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <Badge 
                        variant={getPriorityVariant(task.priority)} 
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
