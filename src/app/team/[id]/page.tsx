import { Metadata } from 'next';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import TeamDetailClient from './TeamDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: team } = await supabase
    .from('wc2026_teams')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!team) return { title: 'Team | WC2026' };
  
  return {
    title: `${team.name} — Squad, Fixtures & Stats | WC2026`,
    description: `${team.name} at the 2026 FIFA World Cup. Group ${team.group_name || 'Stage'}, FIFA ranking #${team.world_ranking || '-'}. Full squad, fixtures and group standings.`,
  };
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [teamRes, playersRes, fixturesRes] = await Promise.all([
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

    supabase
      .from('wc2026_matches')
      .select(`
        id, kickoff_utc, group_name, round, status, home_score, away_score,
        home_team_id, away_team_id, venue_id
      `)
      .or(`home_team_id.eq.${resolvedParams.id},away_team_id.eq.${resolvedParams.id}`)
      .order('kickoff_utc', { ascending: true })
  ]);

  if (!teamRes.data) notFound();

  // Due to schema relation issues on the match table fetching relations right now,
  // we do a secondary query to populate team details for the fixtures
  const fixtures = fixturesRes.data || [];
  let populatedFixtures = fixtures;
  
  if (fixtures.length > 0) {
    // Get all unique team IDs from these fixtures
    const teamIds = new Set<string>();
    fixtures.forEach(f => {
      if (f.home_team_id) teamIds.add(f.home_team_id);
      if (f.away_team_id) teamIds.add(f.away_team_id);
    });
    
    // Also get venues
    const venueIds = new Set<string>();
    fixtures.forEach(f => {
      if (f.venue_id) venueIds.add(f.venue_id);
    });

    const [fTeamsRes, fVenuesRes] = await Promise.all([
      supabase.from('wc2026_teams').select('id, name, country_code, kit_primary_color').in('id', Array.from(teamIds)),
      supabase.from('wc2026_venues').select('id, name, city').in('id', Array.from(venueIds))
    ]);

    const fTeamsMap = new Map(fTeamsRes.data?.map(t => [t.id, t]) || []);
    const fVenuesMap = new Map(fVenuesRes.data?.map(v => [v.id, v]) || []);

    populatedFixtures = fixtures.map(f => ({
      ...f,
      home_team: f.home_team_id ? fTeamsMap.get(f.home_team_id) : null,
      away_team: f.away_team_id ? fTeamsMap.get(f.away_team_id) : null,
      venue: f.venue_id ? fVenuesMap.get(f.venue_id) : null
    }));
  }

  return (
    <TeamDetailClient
      team={teamRes.data}
      players={playersRes.data || []}
      fixtures={populatedFixtures}
    />
  );
}
