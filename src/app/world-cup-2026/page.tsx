import type { Metadata } from 'next';
import WorldCup2026Hub from '../_legacy-pages/WorldCup2026Hub';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 — Live Hub, Scores & Standings',
  description:
    'Your all-in-one hub for the 2026 FIFA World Cup. Watch live streams, track real-time scores and group standings, browse match schedules, and get full replays for all 104 games.',
  alternates: { canonical: '/world-cup-2026' },
  openGraph: {
    title: 'FIFA World Cup 2026 — Live Hub, Scores & Standings',
    description: 'Live streaming, real-time scores, and full match coverage for all 104 World Cup 2026 games.',
    url: 'https://wc2026.games/world-cup-2026',
  },
};

export default function WorldCup2026Page() {
  return <WorldCup2026Hub />;
}
