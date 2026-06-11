import { HeroCountdown } from './components/wc2026/HeroCountdown';
import { TournamentKPIs } from './components/TournamentKPIs';
import { HomeBelowFold } from './components/HomeBelowFold';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      {/* SEO text */}
      <div className="sr-only">
        <h1>FIFA World Cup 2026 Live Hub</h1>
        <p>The ultimate live streaming and statistics hub for the 2026 FIFA World Cup. Follow your favorite teams, view real-time match data, predict outcomes, and connect with fans globally. Host countries: USA, Canada, Mexico.</p>
      </div>
      
      <HeroCountdown />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">
        <TournamentKPIs />
        <HomeBelowFold />
      </div>
    </div>
  );
}
