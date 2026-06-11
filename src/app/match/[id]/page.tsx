import { Metadata } from 'next';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import MatchDetailClient from '@/components/match/MatchDetailClient';
import { notFound } from 'next/navigation';
import { fetchWC2026Lineups, fetchWC2026Statistics, fetchWC2026Events, fetchWC2026Head2Head } from '@/services/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: match } = await supabase
    .from('wc2026_matches')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!match) return { title: 'Match | WC2026' };
  
  const homeName = match.home_team;
  const awayName = match.away_team;
  
  const title = `${homeName} vs ${awayName} — WC2026 Live`;
  const descGroup = match.group_name || 'Group Stage';
  const descDate = match.kickoff_utc ? new Date(match.kickoff_utc).toLocaleDateString() : 'TBA';
  
  return {
    title,
    description: `${descGroup} · ${descDate} · Live score, lineups, H2H and predictions`,
    openGraph: {
      images: [`/api/og?match=${resolvedParams.id}`]
    }
  };
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Fetch match, teams, and predictions
  const [matchRes, teamsRes, predictionsRes] = await Promise.all([
    supabase
      .from('wc2026_matches')
      .select('*')
      .eq('id', resolvedParams.id)
      .single(),

    supabase
      .from('wc2026_teams')
      .select('*'),

    supabase
      .from('wc2026_predictions')
      .select('choice')
      .eq('match_id', resolvedParams.id)
  ]);

  if (!matchRes.data) notFound();

  let match = matchRes.data;

  // Match home_team and away_team with their team objects
  const allTeams = teamsRes.data || [];
  const homeTeamObj = allTeams.find((t) => t.name === match.home_team) || { name: match.home_team };
  const awayTeamObj = allTeams.find((t) => t.name === match.away_team) || { name: match.away_team };

  // Attach team objects directly
  match = {
    ...match,
    home_team: homeTeamObj,
    away_team: awayTeamObj
  };

  // Process predictions
  const preds = predictionsRes.data || [];
  const total = preds.length;
  let homeCount = 0;
  let drawCount = 0;
  let awayCount = 0;

  if (total > 0) {
    preds.forEach((p) => {
      if (p.choice === 'home') homeCount++;
      if (p.choice === 'draw') drawCount++;
      if (p.choice === 'away') awayCount++;
    });
  }

  const predictionStats = total === 0 ? { home: 33, draw: 34, away: 33, total: 0 } : {
    home: Math.round((homeCount / total) * 100),
    draw: Math.round((drawCount / total) * 100),
    away: Math.round((awayCount / total) * 100),
    total
  };

  // 1. Fetch from worldcupapi.com using the new key
  // Note: External APIs often require internal API IDs. For now, we try to pass team names/TLAs or match IDs.
  // If the API doesn't support these IDs or the match hasn't happened, these will return gracefully empty.
  const [apiLineups, apiStats, apiEvents, apiH2H] = await Promise.all([
    fetchWC2026Lineups(match.id).catch(() => null),
    fetchWC2026Statistics(match.id).catch(() => null),
    fetchWC2026Events(match.id).catch(() => null),
    fetchWC2026Head2Head(homeTeamObj.id || homeTeamObj.name, awayTeamObj.id || awayTeamObj.name).catch(() => null),
  ]);

  // Return the client component with API data or fallback to empty arrays
  return (
    <MatchDetailClient
      match={match}
      lineups={apiLineups?.data || []}
      stats={apiStats?.data || []}
      events={apiEvents?.data || []}
      h2h={apiH2H?.data || []}
      predictions={predictionStats}
    />
  );
}
