'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "What is Orbital Flow?",
    answer: "Orbital Flow is a productivity platform designed to help you manage tasks, build habits, set goals, and stay focused. It combines task management, habit tracking, and AI assistance in one seamless experience."
  },
  {
    question: "How does the AI assistant work?",
    answer: "Our AI assistant analyzes your productivity patterns, task completion rates, and habits to provide personalized suggestions. It can help prioritize tasks, recommend focus sessions, and offer insights to improve your workflow."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All your data is encrypted both in transit and at rest. We use industry-standard security practices and never share your personal information with third parties without your consent."
  },
  {
    question: "Can I use Orbital Flow on multiple devices?",
    answer: "Absolutely! Orbital Flow is accessible across all your devices. Your data syncs automatically, so you can seamlessly switch between your computer, tablet, and smartphone."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a free plan with basic features. You can upgrade to our Pro or Team plans anytime to access advanced features like unlimited focus planning, comprehensive habit tracking, and team collaboration."
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up for an account, and you'll be guided through a quick onboarding process. You can start adding tasks, setting up habits, and exploring features right away. Our intuitive interface makes it easy to get started."
  }
];

export function FaqSection({ isDark }: { isDark: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="faq" className={`py-12 sm:py-16 md:py-20 lg:py-24 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2 sm:mb-4`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto ${isDark ? 'text-zinc-300' : 'text-zinc-600'} px-4 sm:px-0`}>
            Find answers to common questions about Orbital Flow.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className={`mb-3 sm:mb-4 rounded-lg border ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}
              >
                <AccordionTrigger 
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium ${isDark ? 'text-white hover:text-white' : 'text-zinc-900 hover:text-zinc-900'} hover:no-underline`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent 
                  className={`px-4 sm:px-6 pb-3 sm:pb-4 pt-1 text-xs sm:text-sm md:text-base ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}