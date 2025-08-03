'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { MoreHorizontal, CalendarClock, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Deadline, getDeadlines, addDeadline, deleteDeadline } from '@/services/deadlineService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow, parseISO } from 'date-fns';

export function UpcomingDeadlines() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDeadlineTitle, setNewDeadlineTitle] = useState('');
  const [newDeadlineDate, setNewDeadlineDate] = useState('');

  const fetchDeadlines = async () => {
    if (user) {
      setLoading(true);
      const userDeadlines = await getDeadlines(user.uid);
      setDeadlines(userDeadlines);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, [user]);

  const handleAddDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadlineTitle.trim() || !newDeadlineDate || !user) return;
    const newDeadline: Omit<Deadline, 'id'> = {
      title: newDeadlineTitle,
      date: newDeadlineDate,
      userId: user.uid,
    };
    await addDeadline(newDeadline);
    fetchDeadlines();
    setNewDeadlineTitle('');
    setNewDeadlineDate('');
    setIsDialogOpen(false);
  };

  const handleDeleteDeadline = async (deadlineId: string) => {
    await deleteDeadline(deadlineId);
    fetchDeadlines();
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className="font-headline text-2xl">Upcoming</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new deadline</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDeadline} className="space-y-4">
              <Input
                placeholder="Deadline title"
                value={newDeadlineTitle}
                onChange={(e) => setNewDeadlineTitle(e.target.value)}
              />
              <Input
                type="date"
                value={newDeadlineDate}
                onChange={(e) => setNewDeadlineDate(e.target.value)}
              />
              <Button type="submit" className='w-full'>Add Deadline</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (<p>Loading...</p>) : deadlines.length === 0 ? (<p className="text-muted-foreground text-center py-4">No upcoming deadlines.</p>) : (
            <ul className="space-y-4">
            {deadlines.map((deadline) => (
                <li key={deadline.id} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1">
                    <CalendarClock className="h-5 w-5 text-accent" />
                </div>
                <div className='flex-grow'>
                    <p className="font-medium text-card-foreground">{deadline.title}</p>
                    <p className="text-sm text-muted-foreground">
                        Due {formatDistanceToNow(parseISO(deadline.date), { addSuffix: true })}
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => handleDeleteDeadline(deadline.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                </Button>
                </li>
            ))}
            </ul>
        )}
      </CardContent>
    </Card>
  );
}
