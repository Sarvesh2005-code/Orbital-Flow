// src/hooks/use-realtime-data.ts
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { RealtimeService } from '@/services/realtimeService';

export function useRealtimeTasks(filters?: { completed?: boolean; limit?: number }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToTasks(
      user.uid,
      (data) => {
        console.log('Tasks updated:', data.length);
        setTasks(data);
        setLoading(false);
      },
      filters
    );

    // Set a timeout to ensure loading doesn't stay true forever
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [user?.uid, filters?.completed, filters?.limit]);

  return { tasks, loading, error, setTasks };
}

export function useRealtimeHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToHabits(
      user.uid,
      (data) => {
        console.log('Habits updated:', data.length);
        setHabits(data);
        setLoading(false);
      }
    );

    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [user?.uid]);

  return { habits, loading, error, setHabits };
}

export function useRealtimeNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToNotes(
      user.uid,
      (data) => {
        setNotes(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { notes, loading, error, setNotes };
}

export function useRealtimeGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToGoals(
      user.uid,
      (data) => {
        setGoals(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { goals, loading, error, setGoals };
}

export function useRealtimeNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToNotifications(
      user.uid,
      (data) => {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { notifications, unreadCount, loading, error, setNotifications };
}

export function useRealtimeUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToUserProfile(
      user.uid,
      (data) => {
        setProfile(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { profile, loading, error, setProfile };
}
