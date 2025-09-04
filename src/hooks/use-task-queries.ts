// src/hooks/use-task-queries.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/taskService';
import { useToast } from './use-toast';
import { useEffect } from 'react';
import { RealtimeService } from '@/services/realtimeService';

export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_QUERY_KEYS.all, 'list'] as const,
  list: (userId: string, filters?: any) => [...TASK_QUERY_KEYS.lists(), userId, filters] as const,
  details: () => [...TASK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TASK_QUERY_KEYS.details(), id] as const,
};

// Hook for getting all tasks with real-time updates
export function useTasks(filters?: { completed?: boolean; limit?: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const unsubscribe = RealtimeService.subscribeToTasks(
      user.uid,
      (tasks) => {
        queryClient.setQueryData(
          TASK_QUERY_KEYS.list(user.uid, filters),
          tasks
        );
      },
      filters
    );

    return () => {
      unsubscribe();
    };
  }, [user, queryClient, filters]);

  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(user?.uid || '', filters),
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getTasks(user.uid);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      if (!data) return [];
      
      let filteredTasks = data;
      
      // Apply filters
      if (filters?.completed !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.completed === filters.completed);
      }
      
      if (filters?.limit) {
        filteredTasks = filteredTasks.slice(0, filters.limit);
      }
      
      return filteredTasks;
    },
  });
}

// Hook for creating tasks
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Invalidate all task queries for the user
      if (user) {
        queryClient.invalidateQueries({
          queryKey: TASK_QUERY_KEYS.lists(),
        });
      }
      
      toast({
        title: 'Task Created',
        description: 'Your task has been created successfully.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create task',
        variant: 'destructive',
      });
    },
  });
}

// Hook for updating tasks
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: any }) => 
      updateTask(taskId, updates),
    onMutate: async ({ taskId, updates }) => {
      if (!user) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(
        TASK_QUERY_KEYS.list(user.uid)
      );

      // Optimistically update the cache
      queryClient.setQueryData(
        TASK_QUERY_KEYS.list(user.uid),
        (old: any[]) => {
          if (!old) return [];
          return old.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          );
        }
      );

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks && user) {
        queryClient.setQueryData(
          TASK_QUERY_KEYS.list(user.uid),
          context.previousTasks
        );
      }
      
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      }
    },
  });
}

// Hook for deleting tasks
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      if (!user) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(
        TASK_QUERY_KEYS.list(user.uid)
      );

      // Optimistically remove the task
      queryClient.setQueryData(
        TASK_QUERY_KEYS.list(user.uid),
        (old: any[]) => {
          if (!old) return [];
          return old.filter(task => task.id !== taskId);
        }
      );

      return { previousTasks };
    },
    onError: (error, taskId, context) => {
      // Roll back on error
      if (context?.previousTasks && user) {
        queryClient.setQueryData(
          TASK_QUERY_KEYS.list(user.uid),
          context.previousTasks
        );
      }
      
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Task Deleted',
        description: 'Task has been deleted successfully.',
        variant: 'default',
      });
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      }
    },
  });
}

// Hook to get today's focus tasks
export function useTodaysFocus() {
  const { data: tasks = [], isLoading } = useTasks({ completed: false, limit: 10 });

  const todaysTasks = tasks
    .sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return (
        (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) -
        (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
      );
    })
    .slice(0, 3);

  return {
    tasks: todaysTasks,
    isLoading,
  };
}
