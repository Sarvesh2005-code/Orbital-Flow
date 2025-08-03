'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Task, getTasks, addTask, updateTask, deleteTask } from '@/services/taskService';
import ProtectedRoute from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchTasks = async () => {
                setLoading(true);
                const userTasks = await getTasks(user.uid);
                setTasks(userTasks.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : 1));
                setLoading(false);
            };
            fetchTasks();
        }
    }, [user]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user) return;

        const newTask: Omit<Task, 'id' | 'createdAt'> = {
            title: newTaskTitle,
            priority: newTaskPriority,
            completed: false,
            userId: user.uid,
        };
        
        // This is optimistic UI update. We can implement a more robust solution later.
        await addTask(newTask);
        const userTasks = await getTasks(user.uid);
        setTasks(userTasks.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : 1));

        setNewTaskTitle('');
        setNewTaskPriority('Medium');
    };

    const handleToggleTask = async (taskId: string, completed: boolean) => {
        await updateTask(taskId, { completed });
        setTasks(tasks.map(task => task.id === taskId ? { ...task, completed } : task));
    };

    const handleDeleteTask = async (taskId: string) => {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
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
        <ProtectedRoute>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add a new task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2">
                            <Input
                                type="text"
                                placeholder="Task title..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="flex-grow"
                            />
                            <Select onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewTaskPriority(value)} value={newTaskPriority}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">Add Task</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {loading ? (
                            <>
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                             </>
                        ) : tasks.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">You have no tasks yet.</p>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                                    />
                                    <span className={`flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {task.title}
                                    </span>
                                    <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </div>
                            ))
                        )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
