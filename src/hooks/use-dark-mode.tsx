// src/hooks/use-dark-mode.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        setIsDarkMode(true);
      } else if (theme === 'light') {
        setIsDarkMode(false);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
      }
    } catch (e) {
      // no-op
    }
  }, []);

  const toggleDarkMode = useCallback((forceState?: boolean) => {
    setIsDarkMode(prev => {
      const newState = forceState !== undefined ? forceState : !prev;
      try {
        localStorage.setItem('theme', newState ? 'dark' : 'light');
      } catch (e) {}
      if (newState) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newState;
    });
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
};
