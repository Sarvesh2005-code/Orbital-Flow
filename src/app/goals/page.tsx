// src/app/goals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import ProtectedRoute from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal, getGoals, addGoal, updateGoal, deleteGoal, GoalStatus } from '@/services/goalService';
import { Plus, Trash2, Edit, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function GoalsPage() {
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<GoalStatus>('Not Started');
    const [targetDate, setTargetDate] = useState('');

    const fetchGoals = async () => {
        if(user) {
            setLoading(true);
            const userGoals = await getGoals(user.uid);
            setGoals(userGoals);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [user]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus('Not Started');
        setTargetDate('');
        setEditingGoal(null);
    };

    const handleOpenDialog = (goal: Goal | null) => {
        setEditingGoal(goal);
        if (goal) {
            setTitle(goal.title);
            setDescription(goal.description);
            setStatus(goal.status);
            setTargetDate(goal.targetDate);
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title.trim()) return;

        if (editingGoal) {
            await updateGoal(editingGoal.id, { title, description, status, targetDate });
        } else {
            const newGoal: Omit<Goal, 'id' | 'createdAt'> = {
                title,
                description,
                status,
                targetDate,
                userId: user.uid,
            };
            await addGoal(newGoal);
        }
        await fetchGoals();
        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = async (goalId: string) => {
        await deleteGoal(goalId);
        await fetchGoals();
    };
    
    const getStatusVariant = (status: GoalStatus) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'In Progress': return 'secondary';
            default: return 'outline';
        }
    }

    return (
        <ProtectedRoute>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Your Goals</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog(null)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add a New Goal'}</DialogTitle>
                            <DialogDescription>
                                Set a new objective to work towards.
                            </DialogDescription>
                        </DialogHeader>
                        <form id="goal-form" onSubmit={handleSubmit} className="space-y-4">
                            <Input placeholder="Goal title" value={title} onChange={e => setTitle(e.target.value)} required />
                            <Textarea placeholder="Describe your goal..." value={description} onChange={e => setDescription(e.target.value)} />
                            <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
                            <Select onValueChange={(value: GoalStatus) => setStatus(value)} value={status}>
                                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Not Started">Not Started</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </form>
                         <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" form="goal-form">{editingGoal ? 'Save Changes' : 'Add Goal'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <Card key={goal.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="font-bold text-xl">{goal.title}</CardTitle>
                                    <Badge variant={getStatusVariant(goal.status)}>{goal.status}</Badge>
                                </div>
                                {goal.targetDate && <CardDescription>Target: {format(parseISO(goal.targetDate), "MMM dd, yyyy")}</CardDescription>}
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{goal.description || 'No description provided.'}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(goal)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(goal.id)}><Trash2 className="h-4 w-4" /></Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-dashed border-2 rounded-lg">
                    <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Goals Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Click "Add Goal" to get started on your objectives.</p>
                </div>
            )}
        </ProtectedRoute>
    );
}
