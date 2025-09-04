'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    title: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Basic task management',
      'Daily focus planning',
      'Simple habit tracking',
      'Limited AI assistance',
      'Email support'
    ]
  },
  {
    title: 'Pro',
    price: '$9.99',
    period: '/month',
    features: [
      'Advanced task management',
      'Unlimited focus planning',
      'Comprehensive habit tracking',
      'Full AI assistance',
      'Priority support',
      'Team collaboration (up to 3)',
      'Analytics dashboard'
    ],
    popular: true
  },
  {
    title: 'Team',
    price: '$19.99',
    period: '/month',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated account manager',
      'API access',
      'SSO authentication'
    ]
  }
];

export function PricingSection({ isDark }: { isDark: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="pricing" className={`py-12 sm:py-16 md:py-20 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2 sm:mb-4`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${isDark ? 'text-zinc-300' : 'text-zinc-600'} max-w-3xl mx-auto px-2`}>
            Choose the plan that fits your productivity needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${
                plan.popular 
                  ? 'bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-rose-500/10 border-orange-500/30 shadow-xl shadow-orange-500/10'
                  : isDark 
                    ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-white/60 border-zinc-200 hover:border-zinc-300'
              } backdrop-blur-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2`}>
                  {plan.title}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {plan.period}
                  </span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className={`${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' 
                    : isDark 
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}
                size="lg"
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}