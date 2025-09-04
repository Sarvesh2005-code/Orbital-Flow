import React, { useEffect, useState } from 'react';

const AnimatedCounter = ({ target, label, isDark }: { target: number; label: string; isDark: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * target);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [target]);

    return (
        <div className="text-center group">
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {count.toLocaleString()}+
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'} uppercase tracking-wider`}>
                {label}
            </div>
        </div>
    );
};

export default AnimatedCounter;
