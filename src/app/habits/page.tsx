// src/app/habits/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Dumbbell, BookOpen, GlassWater, BrainCircuit, Plus, Trash2, Flame, Target } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Habit, addHabit, updateHabit, deleteHabit, HabitIcon } from '@/services/habitService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRealtimeHabits } from '@/hooks/use-realtime-data';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: { [key in HabitIcon]: React.ElementType } = {
    Dumbbell,
    BookOpen,
    GlassWater,
    BrainCircuit,
};

export default function HabitsPage() {
  const { user } = useAuth();
  const { habits, loading } = useRealtimeHabits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState<HabitIcon>('Dumbbell');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCompleteHabit = async (habit: Habit) => {
    const today = new Date().toDateString();
    if (habit.lastCompleted !== today) {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = habit.lastCompleted === yesterday.toDateString();
        const streak = isConsecutive ? habit.streak + 1 : 1;
        
        await updateHabit(habit.id, { streak, lastCompleted: today });
        
        toast({
          title: 'Habit completed! 🎉',
          description: `Great job! You're on a ${streak} day streak!`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update habit. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const newHabit: Omit<Habit, 'id'> = {
        name: newHabitName.trim(),
        icon: newHabitIcon,
        streak: 0,
        userId: user.uid,
        lastCompleted: null
      };
      
      await addHabit(newHabit);
      
      setNewHabitName('');
      setNewHabitIcon('Dumbbell');
      setIsDialogOpen(false);
      
      toast({
        title: 'Habit created!',
        description: `"${newHabit.name}" has been added to your habits.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create habit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
      toast({
        title: 'Habit deleted',
        description: 'The habit has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isHabitCompletedToday = (habit: Habit) => {
    return habit.lastCompleted === new Date().toDateString();
  }

  const completedToday = habits.filter(habit => isHabitCompletedToday(habit)).length;
  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground">
            Build consistent habits to achieve your goals
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{completedToday}/{habits.length} today</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="h-4 w-4" />
            <span>{totalStreak} total streak</span>
          </div>
        </div>
      </div>

      {/* Add Habit Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Add New Habit</h3>
                <p className="text-muted-foreground">Create a new habit to track</p>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new habit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddHabit} className="space-y-4">
            <Input
              placeholder="Habit name (e.g. Morning workout)"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              disabled={isSubmitting}
            />
            <Select onValueChange={(value: HabitIcon) => setNewHabitIcon(value)} value={newHabitIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dumbbell">💪 Workout</SelectItem>
                <SelectItem value="BookOpen">📚 Read</SelectItem>
                <SelectItem value="GlassWater">💧 Hydrate</SelectItem>
                <SelectItem value="BrainCircuit">🧘 Meditate</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Habit'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Habits Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-10 w-10 rounded mx-auto mb-4" />
                <Skeleton className="h-6 w-24 mx-auto mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : habits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No habits yet</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Create your first habit above to start building consistency and achieving your goals!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {habits.map((habit, index) => {
              const Icon = iconMap[habit.icon] || Dumbbell;
              const isCompleted = isHabitCompletedToday(habit);
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`relative group transition-all duration-300 hover:shadow-lg ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800/50' 
                      : 'hover:bg-muted/50'
                  }`}>
                    <CardContent className="flex flex-col items-center gap-4 p-6">
                      <div className='relative'>
                        <div className={`p-3 rounded-full transition-colors ${
                          isCompleted 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-muted'
                        }`}>
                          <Icon className={`h-8 w-8 transition-colors ${
                            isCompleted 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        {habit.streak > 0 && (
                          <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs font-bold">
                            <Flame className="h-3 w-3" />
                            <span>{habit.streak}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-1">{habit.name}</h3>
                        {habit.streak > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {habit.streak} day streak! 🔥
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        size="lg" 
                        variant={isCompleted ? 'default': 'outline'} 
                        className={`w-full transition-all ${
                          isCompleted 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : ''
                        }`}
                        onClick={() => handleCompleteHabit(habit)} 
                        disabled={isCompleted}
                      >
                        <Check className="h-5 w-5 mr-2" />
                        {isCompleted ? 'Completed Today! ✓' : 'Mark as Done'}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive" 
                        onClick={() => handleDeleteHabit(habit.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
