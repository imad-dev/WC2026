import type { Metadata } from 'next';
import WorldCup2026Hub from '../_legacy-pages/WorldCup2026Hub';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Live Streaming Hub | WC2026.games',
  description:
    'The ultimate fifa world cup 2026 live streaming hub. Get your wc 2026 stream, real-time scores, and full match replays here.',
  alternates: { canonical: '/world-cup-2026' },
};

export default function WorldCup2026Page() {
  return <WorldCup2026Hub />;
}
