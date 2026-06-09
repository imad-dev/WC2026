import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { StandingsTable } from '@/components/ui/StandingsTable';

export const metadata: Metadata = {
  title: 'WC2026 Group Standings | Live Updates',
  description: 'Live group standings for the FIFA World Cup 2026. See which teams are advancing to the knockout stage.',
  alternates: { canonical: '/groups' },
};

const getTeams = unstable_cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from('wc2026_teams')
      .select('*')
      .order('group_letter', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
    return data || [];
  },
  ['wc2026-teams-grouped'],
  { revalidate: 30 }
);

export default async function GroupsPage() {
  const teams = await getTeams();
  
  // Cluster teams by group_letter (A through L)
  const groupedTeams = teams.reduce((acc, team) => {
    const letter = team.group_letter;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(team);
    return acc;
  }, {} as Record<string, any[]>);

  // Note: StandingsTable currently fetches its own data internally via useMatches and useWCStandings,
  // but per requirements we provide the clustered teams here as well, either to wrap it or 
  // replacing it if needed in the future. Since the requirement asks to keep the live match sync logic
  // completely intact, we will render StandingsTable and pass initial teams if we decide to refactor it.
  
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      {/* 
        The live match sync countdown logic is maintained inside StandingsTable. 
        We pass the pre-fetched structured teams so it can use them for base rendering.
      */}
      <StandingsTable initialGroupedTeams={groupedTeams} />
    </div>
  );
}
