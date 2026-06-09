import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wc2026.games';

  // Static routes
  const staticRoutes = [
    '',
    '/schedule',
    '/groups',
    '/teams',
    '/venues',
    '/news',
    '/live',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'always' as const,
    priority: route === '' || route === '/live' ? 1 : 0.8,
  }));

  // Dynamic match routes
  const { data: matches } = await supabase
    .from('wc2026_matches')
    .select('id, updated_at')
    .order('kickoff_utc', { ascending: true });

  const matchRoutes = (matches || []).map((match) => ({
    url: `${baseUrl}/match/${match.id}`,
    lastModified: match.updated_at ? new Date(match.updated_at) : new Date(),
    changeFrequency: 'always' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...matchRoutes];
}
