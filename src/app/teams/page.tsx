import type { Metadata } from 'next';
import { supabaseAdmin } from '../../lib/supabase';
import TeamsClient from './TeamsClient';

export const metadata: Metadata = {
  title: 'All 48 Qualified Teams — Squads, Groups & Stats',
  description: 'Explore all 48 qualified teams for the 2026 FIFA World Cup. View squad lists, group assignments, FIFA rankings, World Cup history, and upcoming fixtures for every nation.',
  alternates: { canonical: '/teams' },
  openGraph: {
    title: 'All 48 Qualified Teams — FIFA World Cup 2026',
    description: 'Complete list of all 48 teams competing in the World Cup 2026, with squads, groups, and stats.',
    url: 'https://wc2026.games/teams',
  },
};

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

export default async function TeamsPage() {
  const teams = await getTeams();
  return (
    <>
      {/* Visible Page Header */}
      <div className="w-full bg-[var(--wc-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-3 font-semibold">
            Tournament Participants
          </p>
          <h1 className="text-3xl md:text-4xl text-[var(--wc-text)] uppercase mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            All 48 Qualified Teams
          </h1>
          <p className="text-[var(--wc-text-muted)] text-sm md:text-base max-w-3xl leading-relaxed">
            The 2026 FIFA World Cup features 48 nations competing across 12 groups. Three host countries — Canada, Mexico, and the United States — are joined by 45 teams from all six FIFA confederations. Tap any team card to view their full squad, fixtures, and group details.
          </p>
        </div>
      </div>
      <TeamsClient teams={teams} />
    </>
  );
}
