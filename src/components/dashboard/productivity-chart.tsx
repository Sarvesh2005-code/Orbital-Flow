'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { getTasks } from '@/services/taskService';
import { subDays, format } from 'date-fns';

export function ProductivityChart() {
    const { user } = useAuth();
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchTaskData = async () => {
            if (user) {
                const tasks = await getTasks(user.uid);
                const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
                
                const data = last7Days.map(day => {
                    const completedTasks = tasks.filter(task => 
                        task.completed && 
                        task.completedAt && 
                        new Date(task.completedAt.seconds * 1000).toDateString() === day.toDateString()
                    );
                    return {
                        day: format(day, 'EEE'),
                        completed: completedTasks.length,
                    };
                });
                setChartData(data);
            }
        };

        fetchTaskData();
    }, [user]);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Weekly Productivity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartContainer config={{
              completed: {
                label: "Tasks",
                color: "hsl(var(--primary))",
              },
            }} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                      formatter={(value) => `${value} tasks`}
                      indicator='dot'
                  />}
                />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
