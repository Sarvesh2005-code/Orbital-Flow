// src/app/layout.tsx
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { QueryProvider } from '@/providers/QueryProvider';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useEffect } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// This is a temporary solution for metadata in a client component.
// See: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-in-client-components
const AppMetadata = () => {
  useEffect(() => {
    document.title = 'Orbital Flow — AI Productivity, Notes, Tasks | by Savesh Nakhale';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', 'Orbital Flow is an AI-powered productivity platform for notes, tasks, habits, goals, and email—crafted solo by Savesh Nakhale.');

    const ensureMeta = (attrName: string, attrValue: string, content: string) => {
      let m = document.querySelector(`meta[${attrName}='${attrValue}']`);
      if (!m) {
        m = document.createElement('meta');
        m.setAttribute(attrName, attrValue);
        document.head.appendChild(m);
      }
      m.setAttribute('content', content);
    };

    // Basic SEO
    ensureMeta('name', 'author', 'Savesh Nakhale');
    ensureMeta('name', 'keywords', 'Orbital Flow, productivity, AI notes, tasks app, habits tracker, goals, classroom, email, notifications, Firebase, Next.js, Vercel, Savesh Nakhale');
    ensureMeta('name', 'theme-color', '#0b0b0c');
    ensureMeta('name', 'robots', 'index, follow');

    // Open Graph
    ensureMeta('property', 'og:title', 'Orbital Flow — AI Productivity, Notes, Tasks');
    ensureMeta('property', 'og:description', 'AI productivity hub for notes, tasks, habits, goals, and email.');
    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:url', 'https://orbital-flow.vercel.app/');
    ensureMeta('property', 'og:image', 'https://orbital-flow.vercel.app/icons/orbital-flow-logo.png');

    // Twitter
    ensureMeta('name', 'twitter:card', 'summary');
    ensureMeta('name', 'twitter:title', 'Orbital Flow — AI Productivity, Notes, Tasks');
    ensureMeta('name', 'twitter:description', 'Built by Savesh Nakhale.');
    ensureMeta('name', 'twitter:image', 'https://orbital-flow.vercel.app/icons/orbital-flow-logo.png');
    ensureMeta('name', 'twitter:creator', '@savesh');

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://orbital-flow.vercel.app/');
  }, []);
  
  return null;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDarkMode } = useDarkMode();

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <head>
        <AppMetadata />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icons/orbital-flow-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/orbital-flow-logo.png" />
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Orbital Flow',
          url: 'https://orbital-flow.vercel.app/',
          applicationCategory: 'ProductivityApplication',
          operatingSystem: 'Web',
          author: { '@type': 'Person', name: 'Savesh Nakhale' },
          image: 'https://orbital-flow.vercel.app/icons/orbital-flow-logo.png',
          description: 'AI-powered productivity hub for notes, tasks, habits, goals, and email.'
        }) }} />
        {/* Prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var theme = localStorage.getItem('theme');
              var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var isDark = theme ? theme === 'dark' : systemDark;
              if (isDark) document.documentElement.classList.add('dark');
            } catch (e) {}
          })();
        `}} />
      </head>
      <body className="font-body antialiased">
        <QueryProvider>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics if provided */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-setup" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
