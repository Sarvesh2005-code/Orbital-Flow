'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
};

export function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="relative p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-colors"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}
