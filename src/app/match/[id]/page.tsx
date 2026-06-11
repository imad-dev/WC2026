import { Metadata } from 'next';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import MatchDetailClient from '@/components/match/MatchDetailClient';
import { notFound } from 'next/navigation';
import { fetchWC2026Lineups, fetchWC2026Statistics, fetchWC2026Events, fetchWC2026Head2Head } from '@/services/api';
import { createMatchSlug } from '@/lib/utils/slug';
import { generatePredictedLineups, generateH2H } from '@/services/mockData';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: matches } = await supabase
    .from('wc2026_matches')
    .select('*');
    
  const match = (matches || []).find(m => createMatchSlug(m.home_team, m.away_team) === resolvedParams.id);

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
  const { data: allMatches } = await supabase
    .from('wc2026_matches')
    .select('*');
    
  const matchData = (allMatches || []).find(m => createMatchSlug(m.home_team, m.away_team) === resolvedParams.id);

  if (!matchData) notFound();

  const [teamsRes, predictionsRes] = await Promise.all([
    supabase
      .from('wc2026_teams')
      .select('*'),

    supabase
      .from('wc2026_predictions')
      .select('choice')
      .eq('match_id', matchData.id)
  ]);



  let match = matchData;

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

  // Fetch squad players to use in mock lineups if API fails
  const { data: squadPlayers } = await supabase
    .from('wc2026_players')
    .select('*')
    .in('team_id', [homeTeamObj.id, awayTeamObj.id].filter(Boolean));

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
    fetchWC2026Lineups(homeTeamObj.name, awayTeamObj.name).catch(() => null),
    fetchWC2026Statistics(homeTeamObj.name, awayTeamObj.name).catch(() => null),
    fetchWC2026Events(homeTeamObj.name, awayTeamObj.name).catch(() => null),
    fetchWC2026Head2Head(homeTeamObj.name, awayTeamObj.name).catch(() => null),
  ]);

  // 2. Generate Realistic Mock Data if API is empty
  const hasApiLineups = apiLineups?.data && apiLineups.data.length > 0;
  const hasApiH2H = apiH2H?.data && apiH2H.data.length > 0;

  const finalLineups = hasApiLineups ? apiLineups.data : generatePredictedLineups(homeTeamObj, awayTeamObj, squadPlayers || []);
  const finalH2H = hasApiH2H ? apiH2H.data : generateH2H(homeTeamObj, awayTeamObj);

  // Return the client component with API data or fallback to empty arrays
  return (
    <MatchDetailClient
      match={match}
      lineups={finalLineups}
      stats={apiStats?.data || []}
      events={apiEvents?.data || []}
      h2h={finalH2H}
      predictions={predictionStats}
    />
  );
}
