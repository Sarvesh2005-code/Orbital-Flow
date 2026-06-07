// src/app/layout.tsx
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { QueryProvider } from '@/providers/QueryProvider';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useEffect } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Metadata in client component workaround
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
    ensureMeta('property', 'og:title', 'Orbital Flow');
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
    <html lang="en" className={isDarkMode ? 'dark' : ''} suppressHydrationWarning>
      <head>
        <AppMetadata />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icons/orbital-flow-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/orbital-flow-logo.png" />
      </head>
      <body className="font-body antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics if provided */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-setup" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true
              });
            `}</Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
