// src/app/layout.tsx
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/providers/app-providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Orbital Flow — AI Productivity, Notes, Tasks | by Savesh Nakhale',
  description: 'Orbital Flow is an AI-powered productivity platform for notes, tasks, habits, goals, and email—crafted solo by Savesh Nakhale.',
  authors: [{ name: 'Savesh Nakhale' }],
  keywords: ['Orbital Flow', 'productivity', 'AI notes', 'tasks app', 'habits tracker', 'goals', 'classroom', 'email', 'notifications', 'Firebase', 'Next.js', 'Vercel', 'Savesh Nakhale'],
  robots: 'index, follow',
  openGraph: {
    title: 'Orbital Flow',
    description: 'AI productivity hub for notes, tasks, habits, goals, and email.',
    type: 'website',
    url: 'https://orbital-flow.vercel.app/',
    images: ['https://orbital-flow.vercel.app/icons/orbital-flow-logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Orbital Flow — AI Productivity, Notes, Tasks',
    description: 'Built by Savesh Nakhale.',
    images: ['https://orbital-flow.vercel.app/icons/orbital-flow-logo.png'],
    creator: '@savesh',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icons/orbital-flow-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/orbital-flow-logo.png" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          {children}
        </AppProviders>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
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
        )}
      </body>
    </html>
  );
}
