'use client';
import { useState, useEffect, memo, useMemo } from 'react';
import { motion } from 'framer-motion';

export const AnimatedCounter = memo(({ target, label, suffix = '+', isDark, delay = 0 }: { 
    target: number; 
    label: string; 
    suffix?: string;
    isDark: boolean;
    delay?: number;
}) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    
    const countStyles = useMemo(() => ({
        main: `text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2 group-hover:scale-110 transition-all duration-300`,
        label: `text-xs sm:text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'} uppercase tracking-wider`
    }), [isDark]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasStarted(true);
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            const stepDuration = duration / steps;
            
            let current = 0;
            const countTimer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(countTimer);
                } else {
                    setCount(Math.floor(current));
                }
            }, stepDuration);
            
            return () => clearInterval(countTimer);
        }, delay);
        
        return () => clearTimeout(timer);
    }, [target, delay]);
    
    return (
        <motion.div 
            className="text-center group"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay / 1000 }}
        >
            <div className={`${countStyles.main} ${hasStarted ? 'animate-pulse' : ''}`}>
                {count.toLocaleString()}{suffix}
            </div>
            <div className={countStyles.label}>
                {label}
            </div>
        </motion.div>
    );
});
