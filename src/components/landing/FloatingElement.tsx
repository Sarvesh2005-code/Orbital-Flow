import React from 'react';

export const FloatingElement = ({ children, delay = 0, duration = 6 }: { 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}) => (
    <div 
        className="animate-float"
        style={{ 
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
        }}
    >
        {children}
    </div>
);
