'use client';
import React from 'react';

export const FeatureCard = ({ icon, title, description, delay = 0, isDark }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    delay?: number;
    isDark: boolean;
}) => (
    <div 
        className={`group p-8 ${isDark 
            ? 'bg-zinc-900/40 hover:bg-zinc-800/60 border-zinc-800 hover:border-zinc-700' 
            : 'bg-white/60 hover:bg-white/80 border-zinc-200 hover:border-zinc-300'
        } backdrop-blur-xl rounded-3xl border transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 ${isDark 
                    ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-400' 
                    : 'bg-gradient-to-br from-orange-500/10 to-pink-500/10 text-orange-600'
                } rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-3`}>
                        {title}
                    </h3>
                    <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    </div>
);
