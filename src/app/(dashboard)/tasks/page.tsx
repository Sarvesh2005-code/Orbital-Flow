'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Task, addTask, updateTask, deleteTask } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, CheckCircle, Circle, Calendar, LayoutGrid, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealtimeTasks } from '@/hooks/use-realtime-data';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function TasksPage() {
    const { user } = useAuth();
    const { tasks, loading } = useRealtimeTasks();
    const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Local state for optimistic drag-and-drop updates
    const [localTasks, setLocalTasks] = useState<Task[]>([]);

    useEffect(() => {
        setLocalTasks(tasks.sort((a, b) => (a.order || 0) - (b.order || 0)));
    }, [tasks]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const newTask: Omit<Task, 'id' | 'createdAt' | 'completedAt'> = {
                title: newTaskTitle.trim(),
                priority: newTaskPriority,
                completed: false,
                status: 'todo',
                order: localTasks.length,
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
        const taskToUpdate = localTasks.find(t => t.id === taskId);
        if (!taskToUpdate) return;
        
        try {
            // Optimistic update
            setLocalTasks(prev => prev.map(t => 
                t.id === taskId ? { ...t, completed, status: completed ? 'done' : 'todo' } : t
            ));
            
            await updateTask(taskId, { completed, status: completed ? 'done' : 'todo' });
            toast({
                title: completed ? 'Task completed!' : 'Task reopened',
                description: completed ? 'Great job! 🎉' : 'Task marked as incomplete.',
            });
        } catch (error) {
            // Revert on error
            setLocalTasks(tasks);
            toast({
                title: 'Error',
                description: 'Failed to update task. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            setLocalTasks(prev => prev.filter(t => t.id !== taskId));
            await deleteTask(taskId);
            toast({
                title: 'Task deleted',
                description: 'The task has been removed from your list.',
            });
        } catch (error) {
            setLocalTasks(tasks);
            toast({
                title: 'Error',
                description: 'Failed to delete task. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const newStatus = destination.droppableId as 'todo' | 'in-progress' | 'done';
        const completed = newStatus === 'done';

        // Find the task and update local state optimistically
        const draggedTask = localTasks.find(t => t.id === draggableId);
        if (!draggedTask) return;

        const newTasks = Array.from(localTasks);
        
        // Remove from old position
        const sourceList = newTasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === source.droppableId);
        sourceList.splice(source.index, 1);
        
        // Add to new position
        const destList = newTasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === destination.droppableId && t.id !== draggableId);
        destList.splice(destination.index, 0, { ...draggedTask, status: newStatus, completed });

        // Merge back lists and reassign order
        const allOtherTasks = newTasks.filter(t => 
            (t.status || (t.completed ? 'done' : 'todo')) !== source.droppableId && 
            (t.status || (t.completed ? 'done' : 'todo')) !== destination.droppableId && 
            t.id !== draggableId
        );
        
        const mergedList = [...sourceList, ...destList, ...allOtherTasks];
        // Re-assign order for the destination list to ensure clean sorting
        destList.forEach((t, i) => {
            t.order = i;
        });

        setLocalTasks(mergedList);

        // Batch update to firestore
        try {
            await updateTask(draggableId, { status: newStatus, completed, order: destination.index });
            destList.forEach((t, index) => {
                if (t.id !== draggableId) {
                    updateTask(t.id, { order: index });
                }
            });
        } catch (error) {
            setLocalTasks(tasks); // Revert
            toast({
                title: 'Error',
                description: 'Failed to reorder tasks.',
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

    const renderTaskCard = (task: Task) => (
        <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200 group">
            <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                className="h-5 w-5"
            />
            <div className="flex-grow space-y-1">
                <h3 className={`font-medium leading-none ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                </h3>
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                )}
            </div>
            <Badge variant={getPriorityVariant(task.priority)} className={`text-xs ${task.completed ? 'opacity-50' : ''}`}>
                {task.priority === 'High' && '🔴'} 
                {task.priority === 'Medium' && '🟡'} 
                {task.priority === 'Low' && '🟢'} 
                {task.priority}
            </Badge>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDeleteTask(task.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const columns = [
        { id: 'todo', title: 'To Do', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
        { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
        { id: 'done', title: 'Done', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    ];

    return (
        <div className="space-y-6 p-2 sm:p-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">
                        Manage your tasks and stay productive
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                    <Button 
                        variant={viewMode === 'list' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setViewMode('list')}
                        className="h-8"
                    >
                        <List className="h-4 w-4 mr-2" /> List
                    </Button>
                    <Button 
                        variant={viewMode === 'board' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setViewMode('board')}
                        className="h-8"
                    >
                        <LayoutGrid className="h-4 w-4 mr-2" /> Board
                    </Button>
                </div>
            </div>

            {/* Add Task Form */}
            <Card className="flex-shrink-0 border shadow-sm">
                <CardContent className="p-4">
                    <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="text"
                            placeholder="What needs to be done?"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="flex-grow text-base bg-muted/30 border-muted focus-visible:ring-offset-0"
                            disabled={isSubmitting}
                        />
                        <div className="flex gap-3">
                            <Input
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                className="w-[140px] bg-muted/30 border-muted"
                                disabled={isSubmitting}
                            />
                            <Select onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewTaskPriority(value)} value={newTaskPriority}>
                                <SelectTrigger className="w-[120px] bg-muted/30 border-muted">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">🔴 High</SelectItem>
                                    <SelectItem value="Medium">🟡 Medium</SelectItem>
                                    <SelectItem value="Low">🟢 Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
                                <Plus className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">{isSubmitting ? 'Adding...' : 'Add Task'}</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {loading ? (
                <div className="space-y-4 flex-grow">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                </div>
            ) : (
                <div className="flex-grow min-h-0 relative">
                    {viewMode === 'board' ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="flex h-full gap-6 overflow-x-auto pb-4 px-1 snap-x">
                                {columns.map(col => {
                                    const colTasks = localTasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === col.id).sort((a, b) => (a.order || 0) - (b.order || 0));
                                    
                                    return (
                                        <div key={col.id} className="flex flex-col min-w-[320px] max-w-[380px] flex-1 bg-muted/20 rounded-xl border snap-center">
                                            <div className="flex items-center justify-between p-4 flex-shrink-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${col.color}`}>
                                                        {col.title}
                                                    </span>
                                                    <span className="text-muted-foreground text-sm font-medium">
                                                        {colTasks.length}
                                                    </span>
                                                </div>
                                            </div>
                                            <Droppable droppableId={col.id}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef} 
                                                        {...provided.droppableProps}
                                                        className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${
                                                            snapshot.isDraggingOver ? 'bg-muted/40' : ''
                                                        }`}
                                                    >
                                                        {colTasks.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={snapshot.isDragging ? 'shadow-xl opacity-90 scale-[1.02] rotate-1 z-50 transition-transform' : ''}
                                                                    >
                                                                        {renderTaskCard(task)}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    );
                                })}
                            </div>
                        </DragDropContext>
                    ) : (
                        <div className="h-full overflow-y-auto pr-2 space-y-4">
                            {['todo', 'in-progress', 'done'].map(status => {
                                const statusTasks = localTasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === status);
                                if (statusTasks.length === 0) return null;
                                
                                return (
                                    <div key={status} className="space-y-3">
                                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                                            {status.replace('-', ' ')} ({statusTasks.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {statusTasks.map(task => renderTaskCard(task))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
