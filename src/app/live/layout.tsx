import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watch FIFA World Cup 2026 Live — Free HD Stream',
  description:
    'Watch every FIFA World Cup 2026 match live in Full HD for free. Real-time scores, live chat, match predictions, and minute-by-minute commentary for all 104 games.',
  alternates: { canonical: '/live' },
  openGraph: {
    title: 'Watch FIFA World Cup 2026 Live — Free HD Stream',
    description:
      'Live streaming all 104 World Cup 2026 matches. Real-time scores, predictions, and live chat with fans worldwide.',
    url: 'https://wc2026.games/live',
  },
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
