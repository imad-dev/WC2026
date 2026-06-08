import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const baseUrl = 'https://wc2026.games';
  
  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/world-cup-2026`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Dynamic match routes
    const { data: matches } = await supabase
      .from('wc2026_matches')
      .select('id, updated_at, status');

    if (matches) {
      const matchRoutes = matches.map((match) => ({
        url: `${baseUrl}/match/${match.id}`,
        lastModified: match.updated_at ? new Date(match.updated_at) : new Date(),
        changeFrequency: match.status === 'live' ? 'always' : match.status === 'upcoming' ? 'daily' : 'weekly',
        priority: match.status === 'live' ? 0.9 : 0.7,
      })) as MetadataRoute.Sitemap;

      routes.push(...matchRoutes);
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return routes;
}
