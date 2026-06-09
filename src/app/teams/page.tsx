import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import TeamsClient from './TeamsClient';

const getTeams = unstable_cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from('wc2026_teams')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
    return data || [];
  },
  ['wc2026-teams'],
  { revalidate: 30 }
);

export default async function TeamsPage() {
  const teams = await getTeams();
  return <TeamsClient teams={teams} />;
}
