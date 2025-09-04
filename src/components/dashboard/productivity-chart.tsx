'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRealtimeTasks } from '@/hooks/use-realtime-data';
import { useEffect, useState, useMemo } from 'react';
import { subDays, format } from 'date-fns';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductivityChart() {
    const { user } = useAuth();
    const { tasks, loading: tasksLoading } = useRealtimeTasks({ completed: true });
    const [chartData, setChartData] = useState<any[]>([]);
    const [totalCompleted, setTotalCompleted] = useState(0);

    const loading = tasksLoading;

    // Memoize chart data calculation
    const processedData = useMemo(() => {
        if (!tasks.length) return { chartData: [], total: 0 };
        
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        
        let weekTotal = 0;
        const data = last7Days.map(day => {
            const completedTasks = tasks.filter(task => {
                if (!task.completedAt) return false;
                
                const completedDate = task.completedAt.seconds 
                    ? new Date(task.completedAt.seconds * 1000)
                    : new Date(task.completedAt);
                    
                return completedDate.toDateString() === day.toDateString();
            });
            
            weekTotal += completedTasks.length;
            return {
                day: format(day, 'EEE'),
                fullDate: format(day, 'MMM dd'),
                completed: completedTasks.length,
            };
        });
        
        return { chartData: data, total: weekTotal };
    }, [tasks]);

    useEffect(() => {
        setChartData(processedData.chartData);
        setTotalCompleted(processedData.total);
    }, [processedData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <CardTitle className="font-headline text-xl md:text-2xl">Weekly Productivity</CardTitle>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-500">{totalCompleted}</div>
              <div className="text-xs text-muted-foreground">tasks completed</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="space-y-3 w-full">
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-end h-32">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className={`w-8 h-${Math.floor(Math.random() * 20) + 10}`} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[200px]">
              <ChartContainer config={{
                  completed: {
                    label: "Tasks",
                    color: "hsl(24 95% 53%)", // Orange color
                  },
                }} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                      width={30}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background/95 backdrop-blur border rounded-lg px-3 py-2 shadow-lg">
                              <p className="font-medium text-sm">{data.fullDate}</p>
                              <p className="text-orange-500 text-sm">
                                {payload[0].value} tasks completed
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="hsl(24 95% 53%)" 
                      radius={[4, 4, 0, 0]} 
                      className="hover:fill-orange-600 transition-colors duration-200"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
