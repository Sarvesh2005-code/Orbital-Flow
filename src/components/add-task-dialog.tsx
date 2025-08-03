// src/components/add-task-dialog.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { addTask, Task } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children?: React.ReactNode;
}

export function AddTaskDialog({ open, onOpenChange, children }: AddTaskDialogProps) {
    const { user } = useAuth();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const { toast } = useToast();

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user) return;

        const newTask: Omit<Task, 'id' | 'createdAt'> = {
            title: newTaskTitle,
            priority: newTaskPriority,
            completed: false,
            userId: user.uid,
        };
        
        await addTask(newTask);
        
        toast({
            title: "Task Added",
            description: `"${newTaskTitle}" has been added to your tasks.`,
        });

        setNewTaskTitle('');
        setNewTaskPriority('Medium');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Task</DialogTitle>
                    <DialogDescription>
                        What do you need to get done?
                    </DialogDescription>
                </DialogHeader>
                <form id="add-task-form" onSubmit={handleAddTask} className="grid gap-4 py-4">
                    <Input
                        id="title"
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="col-span-3"
                    />
                    <Select onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewTaskPriority(value)} value={newTaskPriority}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="add-task-form">Add Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
