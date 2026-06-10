import { supabaseAdmin } from '@/lib/supabase';
import TeamsClient from './TeamsClient';

async function getTeams() {
  const { data, error } = await supabaseAdmin
    .from('wc2026_teams')
    .select('id, name, country_code, kit_primary_color, kit_secondary_color, is_host_country, group_name, world_ranking, participations, flag_url')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
  return data || [];
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All 48 Teams — FIFA World Cup 2026 | wc2026.games',
  description: 'All 48 qualified teams for the 2026 FIFA World Cup in USA, Canada and Mexico. Group draw, squad lists, fixtures and statistics.',
};

export default async function TeamsPage() {
  const teams = await getTeams();
  return <TeamsClient teams={teams} />;
}
