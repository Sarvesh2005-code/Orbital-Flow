// src/lib/analytics.ts
// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Common tracking events
export const trackEvent = {
  // User interactions
  login: () => event({ action: 'login', category: 'user' }),
  logout: () => event({ action: 'logout', category: 'user' }),
  signup: () => event({ action: 'signup', category: 'user' }),
  
  // Task management
  createTask: () => event({ action: 'create_task', category: 'tasks' }),
  completeTask: () => event({ action: 'complete_task', category: 'tasks' }),
  deleteTask: () => event({ action: 'delete_task', category: 'tasks' }),
  
  // Notes
  createNote: () => event({ action: 'create_note', category: 'notes' }),
  updateNote: () => event({ action: 'update_note', category: 'notes' }),
  
  // Habits
  trackHabit: (habitName: string) => event({ 
    action: 'track_habit', 
    category: 'habits', 
    label: habitName 
  }),
  
  // Goals
  createGoal: () => event({ action: 'create_goal', category: 'goals' }),
  achieveGoal: () => event({ action: 'achieve_goal', category: 'goals' }),
  
  // AI features
  useAI: (feature: string) => event({ 
    action: 'use_ai', 
    category: 'ai', 
    label: feature 
  }),
};
