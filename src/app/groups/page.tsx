import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '../../lib/supabase';
import { StandingsTable } from '../../components/ui/StandingsTable';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'World Cup 2026 Groups & Standings — Live Updates',
  description: 'Live group standings for the 2026 FIFA World Cup. Track all 12 groups (A–L), see which teams qualify for the knockout stage, and follow points, goal difference, and head-to-head records.',
  alternates: { canonical: '/groups' },
  openGraph: {
    title: 'World Cup 2026 Groups & Standings — Live Updates',
    description: 'Real-time group stage standings for all 48 teams across 12 groups at the FIFA World Cup 2026.',
    url: 'https://wc2026.games/groups',
  },
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

  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-3 font-semibold">
          Group Stage
        </p>
        <h1 className="text-3xl md:text-4xl text-white uppercase mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          World Cup 2026 Groups & Standings
        </h1>
        <p className="text-[var(--wc-text-muted)] text-sm md:text-base max-w-3xl leading-relaxed mb-6">
          Follow the live group stage standings for all 12 groups in the 2026 FIFA World Cup. The top 2 teams from each group plus the 8 best third-placed teams advance to the Round of 32. Standings update in real-time as matches finish.
        </p>

        {/* Internal Navigation */}
        <nav className="flex flex-wrap gap-2 mb-6" aria-label="Quick links">
          <Link href="/schedule" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">Match Schedule</Link>
          <Link href="/teams" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">All 48 Teams</Link>
          <Link href="/live" className="text-xs px-3 py-1.5 rounded-full bg-[rgba(0,166,81,0.1)] border border-[rgba(0,166,81,0.3)] text-[var(--wc-green)] hover:bg-[var(--wc-green)] hover:text-black transition-colors">Watch Live</Link>
        </nav>
      </div>

      <StandingsTable initialGroupedTeams={groupedTeams} />
    </div>
  );
}
