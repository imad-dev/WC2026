import { Metadata } from 'next';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import TeamDetailClient from './TeamDetailClient';
import { notFound } from 'next/navigation';
import { generateBreadcrumbJsonLd, generateTeamJsonLd } from '../../../lib/seo-helpers';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: team } = await supabase
    .from('wc2026_teams')
    .select('name, group_letter, world_ranking, bio_short, flag_url')
    .eq('id', resolvedParams.id)
    .single();

  if (!team) return { title: 'Team Not Found' };
  
  return {
    title: `${team.name} — Squad, Fixtures & Stats | World Cup 2026`,
    description: team.bio_short || `${team.name} at the 2026 FIFA World Cup. Group ${team.group_letter || 'Stage'}, FIFA ranking #${team.world_ranking || '-'}. Full squad list, match schedule, and group standings.`,
    alternates: { canonical: `/team/${resolvedParams.id}` },
    openGraph: {
      title: `${team.name} | FIFA World Cup 2026`,
      description: team.bio_short || `Full squad, fixtures, and group stats for ${team.name} at the 2026 World Cup.`,
      url: `https://wc2026.games/team/${resolvedParams.id}`,
      images: team.flag_url ? [{ url: team.flag_url }] : [],
    },
  };
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [teamRes, playersRes] = await Promise.all([
    supabase
      .from('wc2026_teams')
      .select('*')
      .eq('id', resolvedParams.id)
      .single(),
    supabase
      .from('wc2026_players')
      .select('*')
      .eq('team_id', resolvedParams.id)
      .order('number', { ascending: true }),
  ]);

  if (!teamRes.data) notFound();

  const team = teamRes.data;

  // Fetch fixtures using team name (matches table stores names as text)
  const { data: fixtures } = await supabase
    .from('wc2026_matches')
    .select('id, kickoff_utc, group_name, status, home_score, away_score, home_team, away_team, venue')
    .or(`home_team.eq.${team.name},away_team.eq.${team.name}`)
    .order('kickoff_utc', { ascending: true });

  // Structured data
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/live' },
    { name: 'Teams', url: '/teams' },
    { name: team.name, url: `/team/${resolvedParams.id}` },
  ]);
  const teamJsonLd = generateTeamJsonLd(team);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamJsonLd) }}
      />
      <TeamDetailClient
        team={team}
        players={playersRes.data || []}
        fixtures={fixtures || []}
      />
    </>
  );
}
