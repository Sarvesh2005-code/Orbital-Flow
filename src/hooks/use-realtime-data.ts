// src/hooks/use-realtime-data.ts
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { RealtimeService } from '@/services/realtimeService';

// Module-level caches to prevent skeleton flashes during navigation
let cachedTasks: any[] | null = null;
let cachedHabits: any[] | null = null;
let cachedNotes: any[] | null = null;
let cachedGoals: any[] | null = null;
let cachedNotifications: any[] | null = null;
let cachedProfile: any | null = null;

export function useRealtimeTasks(filters?: { completed?: boolean; limit?: number }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>(cachedTasks || []);
  const [loading, setLoading] = useState(!cachedTasks);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    if (!cachedTasks) setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToTasks(
      user.uid,
      (data) => {
        cachedTasks = data;
        setTasks(data);
        setLoading(false);
      },
      filters
    );

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
  const [habits, setHabits] = useState<any[]>(cachedHabits || []);
  const [loading, setLoading] = useState(!cachedHabits);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setHabits([]);
      setLoading(false);
      return;
    }

    if (!cachedHabits) setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToHabits(
      user.uid,
      (data) => {
        cachedHabits = data;
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
  const [notes, setNotes] = useState<any[]>(cachedNotes || []);
  const [loading, setLoading] = useState(!cachedNotes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    if (!cachedNotes) setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToNotes(
      user.uid,
      (data) => {
        cachedNotes = data;
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
  const [goals, setGoals] = useState<any[]>(cachedGoals || []);
  const [loading, setLoading] = useState(!cachedGoals);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    if (!cachedGoals) setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToGoals(
      user.uid,
      (data) => {
        cachedGoals = data;
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
  const [notifications, setNotifications] = useState<any[]>(cachedNotifications || []);
  const [loading, setLoading] = useState(!cachedNotifications);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(
    cachedNotifications ? cachedNotifications.filter(n => !n.isRead).length : 0
  );

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    if (!cachedNotifications) setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToNotifications(
      user.uid,
      (data) => {
        cachedNotifications = data;
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
  const [profile, setProfile] = useState<any>(cachedProfile || null);
  const [loading, setLoading] = useState(!cachedProfile);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    if (!cachedProfile) setLoading(true);
    setError(null);

    const unsubscribe = RealtimeService.subscribeToUserProfile(
      user.uid,
      (data) => {
        cachedProfile = data;
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
