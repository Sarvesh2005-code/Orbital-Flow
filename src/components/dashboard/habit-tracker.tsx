// src/components/dashboard/habit-tracker.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Dumbbell, BookOpen, GlassWater, BrainCircuit, Plus, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Habit, getHabits, addHabit, updateHabit, HabitIcon } from '@/services/habitService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

const iconMap: { [key in HabitIcon]: React.ElementType } = {
    Dumbbell,
    BookOpen,
    GlassWater,
    BrainCircuit,
};

export function HabitTracker() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState<HabitIcon>('Dumbbell');
  
  const fetchHabits = async () => {
    if (user) {
      setLoading(true);
      const userHabits = await getHabits(user.uid);
      setHabits(userHabits.slice(0, 4)); // Show max 4 habits on dashboard
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const handleCompleteHabit = async (habit: Habit) => {
    const today = new Date().toDateString();
    if(habit.lastCompleted !== today) {
        const streak = (habit.lastCompleted && new Date(new Date(habit.lastCompleted).setDate(new Date(habit.lastCompleted).getDate() + 1)).toDateString() === today) ? habit.streak + 1 : 1;
        await updateHabit(habit.id, { streak, lastCompleted: today });
        fetchHabits();
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim() || !user) return;
    const newHabit: Omit<Habit, 'id'> = {
      name: newHabitName,
      icon: newHabitIcon,
      streak: 0,
      userId: user.uid,
      lastCompleted: null
    };
    await addHabit(newHabit);
    fetchHabits();
    setNewHabitName('');
    setNewHabitIcon('Dumbbell');
    setIsDialogOpen(false);
  };

  const isHabitCompletedToday = (habit: Habit) => {
    return habit.lastCompleted === new Date().toDateString();
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className="font-headline text-2xl">Habit Tracker</CardTitle>
        <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                 <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new habit</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddHabit} className="space-y-4">
                  <Input
                    placeholder="Habit name (e.g. Meditate)"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                  />
                  <Select onValueChange={(value: HabitIcon) => setNewHabitIcon(value)} value={newHabitIcon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dumbbell">Workout</SelectItem>
                      <SelectItem value="BookOpen">Read</SelectItem>
                      <SelectItem value="GlassWater">Hydrate</SelectItem>
                      <SelectItem value="BrainCircuit">Meditate</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className='w-full'>Add Habit</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Link href="/habits">
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? ( 
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
         ) : habits.length === 0 ? (<p className="text-muted-foreground text-center py-4">No habits yet. Add one!</p>) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {habits.map((habit) => {
                const Icon = iconMap[habit.icon] || Dumbbell;
                const isCompleted = isHabitCompletedToday(habit);
                return (
                <div key={habit.id} className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                    <div className='relative'>
                        <Icon className={`h-8 w-8 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                        {habit.streak > 0 && <span className="absolute -top-1 -right-2 text-xs font-bold text-amber-500">{habit.streak}</span>}
                    </div>
                    <p className="text-sm font-medium text-center text-card-foreground">{habit.name}</p>
                    <Button size="sm" variant={isCompleted ? 'default': 'outline'} className="w-full mt-auto" onClick={() => handleCompleteHabit(habit)} disabled={isCompleted}>
                        <Check className="h-4 w-4 mr-1" />
                        {isCompleted ? 'Done!' : 'Done'}
                    </Button>
                </div>
                );
            })}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
