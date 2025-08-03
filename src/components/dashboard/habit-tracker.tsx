'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { habits } from '@/lib/placeholder-data';
import { Check, Dumbbell, BookOpen, GlassWater, BrainCircuit, MoreHorizontal } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
    Dumbbell,
    BookOpen,
    GlassWater,
    BrainCircuit,
};

export function HabitTracker() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className="font-headline text-2xl">Habit Tracker</CardTitle>
        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {habits.map((habit) => {
            const Icon = iconMap[habit.icon] || Dumbbell;
            return (
              <div key={habit.id} className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                <Icon className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium text-center text-card-foreground">{habit.name}</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Done
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
