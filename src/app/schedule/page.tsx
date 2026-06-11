import type { Metadata } from 'next';
import { MatchGrid } from '@/components/sections/MatchGrid';

export const metadata: Metadata = {
  title: 'WC2026 Match Schedule | All 104 Games Live',
  description: 'View the complete schedule for the FIFA World Cup 2026. Filter by groups, dates, and venues across USA, Canada, and Mexico.',
  alternates: { canonical: '/schedule' },
};

export default function SchedulePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      {/* SEO text */}
      <div className="sr-only">
        <h1>FIFA World Cup 2026 Match Schedule</h1>
        <p>Complete match schedule for the 2026 FIFA World Cup. View all 104 matches, group stage to the final, across host cities in USA, Canada, and Mexico. Check kick-off times and results.</p>
      </div>

      <MatchGrid />
    </div>
  );
}
