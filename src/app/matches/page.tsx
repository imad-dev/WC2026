"use client";

import { HeroCountdown } from '../components/wc2026/HeroCountdown';
import { MatchList } from '../components/wc2026/MatchList';
import { GroupStandings } from '../components/wc2026/GroupStandings';

// Mock Data for matches layout (To be replaced with real Supabase data later)
const MOCK_MATCHES_JUNE_11 = [
  {
    id: 'match_1',
    teamA: 'Mexico',
    flagA: '🇲🇽',
    teamB: 'South Africa',
    flagB: '🇿🇦',
    time: '20:00',
    stage: 'First Stage',
    group: 'Group A',
    stadium: 'Mexico City Stadium (Mexico City)',
    broadcasters: ['FOX', 'Tubi', 'Telemundo']
  }
];

const MOCK_MATCHES_JUNE_12 = [
  {
    id: 'match_2',
    teamA: 'Korea Republic',
    flagA: '🇰🇷',
    teamB: 'Czechia',
    flagB: '🇨🇿',
    time: '03:00',
    stage: 'First Stage',
    group: 'Group A',
    stadium: 'Guadalajara Stadium (Guadalajara)',
    broadcasters: ['FS1', 'Peacock']
  },
  {
    id: 'match_3',
    teamA: 'Canada',
    flagA: '🇨🇦',
    teamB: 'Bosnia and Herzegovina',
    flagB: '🇧🇦',
    time: '20:00',
    stage: 'First Stage',
    group: 'Group B',
    stadium: 'Toronto Stadium (Toronto)',
    broadcasters: ['FOX', 'Tubi']
  }
];

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-20">
      <HeroCountdown />

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-12">
        {/* Top Navbar / Navigation specific to this page could go here */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Scores & Fixtures</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-semibold" style={{ color: 'var(--white-muted)' }}>Where to watch:</span>
            <select className="bg-[var(--surface-1)] border border-[var(--border)] rounded px-2 py-1 text-sm font-bold text-[var(--white-primary)] outline-none">
              <option>USA</option>
              <option>UK</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>

        {/* Fixtures List */}
        <div>
          <MatchList dateString="Thursday 11 June 2026" matches={MOCK_MATCHES_JUNE_11} />
          <MatchList dateString="Friday 12 June 2026" matches={MOCK_MATCHES_JUNE_12} />
        </div>

        <div className="w-full h-px bg-[var(--border)] my-8"></div>

        {/* Group Standings */}
        <GroupStandings />
      </main>
    </div>
  );
}
