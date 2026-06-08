import type { Metadata } from 'next';
import WorldCup2026Hub from '../_legacy-pages/WorldCup2026Hub';

export const metadata: Metadata = {
  title: 'Live Hub — FIFA World Cup 2026 | WC2026.games',
  description:
    'Watch FIFA World Cup 2026 matches live. Geo-routed free streams, real-time scores, and full match replays.',
  alternates: { canonical: '/world-cup-2026' },
};

export default function WorldCup2026Page() {
  return <WorldCup2026Hub />;
}
