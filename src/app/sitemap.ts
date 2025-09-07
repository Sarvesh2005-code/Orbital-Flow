import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://orbital-flow.vercel.app';
  const now = new Date().toISOString();
  const routes = [
    '',
    '/login',
    '/signup',
    '/tasks',
    '/notes',
    '/calendar',
    '/habits',
    '/goals',
    '/notifications',
    '/settings',
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: path === '' ? 1.0 : 0.7,
  }));
}

