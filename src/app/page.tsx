import { HeroCountdown } from './components/wc2026/HeroCountdown';
import { TournamentKPIs } from './components/TournamentKPIs';
import { HomeBelowFold } from './components/HomeBelowFold';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      <HeroCountdown />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">
        <TournamentKPIs />
        <HomeBelowFold />
      </div>
    </div>
  );
}
