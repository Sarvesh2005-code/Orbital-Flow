import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Orbital Flow',
    short_name: 'Orbital Flow',
    description: 'AI-powered productivity platform for notes, tasks, habits, goals, and email.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b0c',
    theme_color: '#0b0b0c',
    icons: [
      {
        src: '/icons/orbital-flow-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/orbital-flow-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
