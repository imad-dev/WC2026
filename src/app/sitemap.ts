import { MetadataRoute } from 'next';
import { supabaseAdmin } from '../lib/supabase';
import { createMatchSlug } from '../lib/utils/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wc2026.games';

  // Static routes — all canonical, indexable pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/live`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/groups`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/venues`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/world-cup-2026`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Dynamic team routes — use /team/{id} (canonical route)
  const { data: teams } = await supabaseAdmin
    .from('wc2026_teams')
    .select('id, updated_at')
    .order('name', { ascending: true });

  const teamRoutes: MetadataRoute.Sitemap = (teams || []).map((team) => ({
    url: `${baseUrl}/team/${team.id}`,
    lastModified: team.updated_at ? new Date(team.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Dynamic match routes — only include matches with valid team names
  const { data: matches } = await supabaseAdmin
    .from('wc2026_matches')
    .select('id, updated_at, home_team, away_team')
    .order('kickoff_utc', { ascending: true });

  const matchRoutes: MetadataRoute.Sitemap = (matches || [])
    .filter((match) => {
      // Exclude matches with TBD/missing teams
      if (!match.home_team || !match.away_team) return false;
      const slug = createMatchSlug(match.home_team, match.away_team);
      return slug !== 'tbd_vs_tbd' && !slug.includes('tbd');
    })
    .map((match) => ({
      url: `${baseUrl}/match/${createMatchSlug(match.home_team, match.away_team)}`,
      lastModified: match.updated_at ? new Date(match.updated_at) : new Date(),
      changeFrequency: 'always' as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...teamRoutes, ...matchRoutes];
}
