// src/app/habits/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Dumbbell, BookOpen, GlassWater, BrainCircuit, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Habit, getHabits, addHabit, updateHabit, deleteHabit, HabitIcon } from '@/services/habitService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const iconMap: { [key in HabitIcon]: React.ElementType } = {
    Dumbbell,
    BookOpen,
    GlassWater,
    BrainCircuit,
};

export default function HabitsPage() {
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
      setHabits(userHabits);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchHabits();
    }
  }, [user]);

  const handleCompleteHabit = async (habit: Habit) => {
    const today = new Date().toDateString();
    if (habit.lastCompleted !== today) {
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
  
  const handleDeleteHabit = async (habitId: string) => {
      await deleteHabit(habitId);
      fetchHabits();
  }

  const isHabitCompletedToday = (habit: Habit) => {
    return habit.lastCompleted === new Date().toDateString();
  }

  return (
    <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className="font-headline text-2xl">Manage Habits</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Habit</Button>
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
        </CardHeader>
        <CardContent>
            {loading ? ( <p>Loading habits...</p> ) : habits.length === 0 ? (<p className="text-muted-foreground text-center py-8">No habits yet. Add one to get started!</p>) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {habits.map((habit) => {
                    const Icon = iconMap[habit.icon] || Dumbbell;
                    const isCompleted = isHabitCompletedToday(habit);
                    return (
                    <Card key={habit.id} className="flex flex-col items-center gap-4 p-6 bg-background hover:bg-muted/50 transition-colors group">
                        <div className='relative'>
                            <Icon className={`h-10 w-10 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                            {habit.streak > 0 && <span className="absolute -top-2 -right-3 text-base font-bold text-amber-500 bg-background rounded-full px-2">{habit.streak}</span>}
                        </div>
                        <p className="text-lg font-semibold text-center text-card-foreground">{habit.name}</p>
                        <Button size="lg" variant={isCompleted ? 'default': 'outline'} className="w-full mt-auto" onClick={() => handleCompleteHabit(habit)} disabled={isCompleted}>
                            <Check className="h-5 w-5 mr-2" />
                            {isCompleted ? 'Completed!' : 'Mark as Done'}
                        </Button>
                         <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteHabit(habit.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                         </Button>
                    </Card>
                    );
                })}
                </div>
            )}
        </CardContent>
    </Card>
  );
}
