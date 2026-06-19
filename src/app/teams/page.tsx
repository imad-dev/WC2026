import { supabaseAdmin } from '@/lib/supabase';
import TeamsClient from './TeamsClient';

async function getTeams() {
  const { data, error } = await supabaseAdmin
    .from('wc2026_teams')
    .select('id, name, kit_primary_color, kit_secondary_color, is_host_country, group_letter, world_ranking, participations, flag_url')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
  return data || [];
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All 48 Teams | Live FIFA World Cup 2026 | wc2026.games',
  description: 'All 48 qualified teams for the 2026 FIFA World Cup. Get ready for live streaming wc 2026. View squad lists, fixtures, and statistics.',
};

export default async function TeamsPage() {
  const teams = await getTeams();
  return (
    <>
      <div className="sr-only">
        <h1>All 48 Teams - Live FIFA World Cup 2026</h1>
        <p>Explore all 48 qualified teams competing in the 2026 FIFA World Cup. Find out when your favorite team plays their next wc match and prepare for live streaming wc 2026.</p>
      </div>
      <TeamsClient teams={teams} />
    </>
  );
}
