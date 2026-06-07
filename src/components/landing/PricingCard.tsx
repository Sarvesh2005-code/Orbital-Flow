'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const PricingCard = ({ title, price, period, features, popular = false, isDark, onSelect }: {
    title: string;
    price: string;
    period: string;
    features: string[];
    popular?: boolean;
    isDark: boolean;
    onSelect: () => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div 
            className={`relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${
                popular 
                    ? 'bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-rose-500/10 border-orange-500/30 shadow-xl shadow-orange-500/10'
                    : isDark 
                        ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700' 
                        : 'bg-white/60 border-zinc-200 hover:border-zinc-300'
            } backdrop-blur-xl cursor-pointer group`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                        Most Popular
                    </div>
                </div>
            )}
            <div className="text-center mb-6 sm:mb-8">
                <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300`}>
                    {title}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                        {price}
                    </span>
                    <span className={`text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {period}
                    </span>
                </div>
            </div>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className={`${isDark ? 'text-zinc-300' : 'text-zinc-600'} leading-relaxed`}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>
            <Button 
                className={`w-full text-sm sm:text-base font-semibold transition-all duration-300 group-hover:scale-105 ${
                    popular 
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl' 
                        : isDark 
                            ? 'bg-zinc-800 hover:bg-zinc-700 text-white hover:shadow-lg' 
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white hover:shadow-lg'
                }`}
                size="lg"
                onClick={onSelect}
            >
                {title === 'Starter' ? 'Start Free' : 'Choose Plan'}
            </Button>
        </div>
    );
};
