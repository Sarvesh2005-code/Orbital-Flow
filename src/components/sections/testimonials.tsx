'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { ImageLoadingPlaceholder } from '@/lib/lazy-loading';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    content: 'Orbital Flow has completely transformed how I manage my daily tasks. The AI assistant is incredibly helpful for prioritizing my work.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'DevWorks',
    content: 'The habit tracking feature has helped me build consistent coding practices. I love how it integrates with my calendar.',
    rating: 4
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    role: 'Freelance Designer',
    company: 'Self-employed',
    content: 'As someone who juggles multiple projects, the deadline management in Orbital Flow has been a lifesaver. Highly recommended!',
    rating: 5
  }
];

export function TestimonialsSection({ isDark }: { isDark: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="testimonials" className={`py-12 sm:py-16 md:py-20 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2 sm:mb-4`}>
            What Our Users Say
          </h2>
          <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${isDark ? 'text-zinc-300' : 'text-zinc-600'} max-w-3xl mx-auto px-2`}>
            Join thousands of professionals who have transformed their productivity with Orbital Flow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className={`p-6 ${isDark 
                ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700' 
                : 'bg-white/60 border-zinc-200 hover:border-zinc-300'} 
              backdrop-blur-xl rounded-xl border transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center">
                  {testimonial.avatar ? (
                    <ImageLoadingPlaceholder 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full" 
                      placeholderClassName="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <span className="text-xl font-bold text-orange-500">
                      {testimonial.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
              
              <p className={`mb-4 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {testimonial.content}
              </p>
              
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-400'}`} 
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}