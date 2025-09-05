'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Task, addTask, updateTask, deleteTask } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, CheckCircle, Circle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealtimeTasks } from '@/hooks/use-realtime-data';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function TasksPage() {
    const { user } = useAuth();
    const { tasks, loading } = useRealtimeTasks();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const newTask: Omit<Task, 'id' | 'createdAt'> = {
                title: newTaskTitle.trim(),
                priority: newTaskPriority,
                completed: false,
                userId: user.uid,
                dueDate: newTaskDueDate || undefined,
            };
            
            await addTask(newTask);
            
            setNewTaskTitle('');
            setNewTaskPriority('Medium');
            setNewTaskDueDate('');
            
            toast({
                title: 'Task created',
                description: `"${newTask.title}" has been added to your tasks.`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create task. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleTask = async (taskId: string, completed: boolean) => {
        try {
            await updateTask(taskId, { completed });
            toast({
                title: completed ? 'Task completed!' : 'Task reopened',
                description: completed ? 'Great job! 🎉' : 'Task marked as incomplete.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update task. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
            toast({
                title: 'Task deleted',
                description: 'The task has been removed from your list.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete task. Please try again.',
                variant: 'destructive',
            });
        }
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


    const completedTasks = tasks.filter(t => t.completed);
    const incompleteTasks = tasks.filter(t => !t.completed);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">
                        Manage your tasks and stay productive
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Circle className="h-4 w-4" />
                        <span>{incompleteTasks.length} pending</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        <span>{completedTasks.length} completed</span>
                    </div>
                </div>
            </div>

            {/* Add Task Form */}
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add a new task
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="flex flex-col lg:flex-row gap-4">
                        <Input
                            type="text"
                            placeholder="What needs to be done?"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="flex-grow text-base"
                            disabled={isSubmitting}
                        />
                        <Input
                            type="date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            className="w-full lg:w-48"
                            disabled={isSubmitting}
                        />
                        <Select onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewTaskPriority(value)} value={newTaskPriority}>
                            <SelectTrigger className="w-full lg:w-32">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">🔴 High</SelectItem>
                                <SelectItem value="Medium">🟡 Medium</SelectItem>
                                <SelectItem value="Low">🟢 Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={isSubmitting} className="w-full lg:w-auto">
                            {isSubmitting ? 'Adding...' : 'Add Task'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="grid gap-6">
                {/* Incomplete Tasks */}
                {incompleteTasks.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Circle className="h-5 w-5 text-orange-500" />
                                Pending Tasks ({incompleteTasks.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {incompleteTasks.map(task => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200"
                                        >
                                            <Checkbox
                                                checked={task.completed}
                                                onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                                                className="h-5 w-5"
                                            />
                                            <div className="flex-grow space-y-1">
                                                <h3 className="font-medium leading-none">{task.title}</h3>
                                                {task.dueDate && (
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                                                {task.priority === 'High' && '🔴'} 
                                                {task.priority === 'Medium' && '🟡'} 
                                                {task.priority === 'Low' && '🟢'} 
                                                {task.priority}
                                            </Badge>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Completed Tasks ({completedTasks.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {completedTasks.map(task => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex items-center gap-4 p-4 rounded-lg border bg-muted/20 transition-all duration-200"
                                        >
                                            <Checkbox
                                                checked={task.completed}
                                                onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                                                className="h-5 w-5"
                                            />
                                            <div className="flex-grow space-y-1">
                                                <h3 className="font-medium leading-none line-through text-muted-foreground">{task.title}</h3>
                                                {task.dueDate && (
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Badge variant="outline" className="text-xs opacity-50">
                                                ✅ Done
                                            </Badge>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Loading State */}
                {loading && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && tasks.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Circle className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                            <p className="text-muted-foreground text-center max-w-sm">
                                Get started by creating your first task above. Stay organized and boost your productivity!
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
