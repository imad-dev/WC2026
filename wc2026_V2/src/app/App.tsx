import { useState } from 'react';
import { Search } from 'lucide-react';
import { Hero } from './components/Hero';
import { GroupNavigator } from './components/GroupNavigator';
import { TournamentKPIs } from './components/TournamentKPIs';
import { GroupStandings } from './components/GroupStandings';
import { MatchResultsGrid } from './components/MatchResultsGrid';
import { TopScorersLeaderboard } from './components/TopScorersLeaderboard';
import { LiveScoresWidget } from './components/LiveScoresWidget';
import { UpcomingFixtures } from './components/UpcomingFixtures';
import { MoroccoFocusCard } from './components/MoroccoFocusCard';
import { useLiveMatches, useStandings, useTopScorers, useFixtures } from '../hooks/useFootballData';
import { mockLiveMatches } from '../data/mockData';
import { ApiDebugPanel } from './components/ApiDebugPanel';
import { ApiStatusBanner } from './components/ApiStatusBanner';
import { CountdownBanner } from './components/CountdownBanner';
import { useTournamentPhase } from '../hooks/useTournamentPhase';

export default function App() {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [activeGroup, setActiveGroup] = useState('F');

  const tabs = ['OVERVIEW', 'FIXTURES', 'GROUPS', 'TEAMS', 'SCORERS', 'STATS', 'MAP'];

  // Tournament phase awareness
  const { isPreTournament, isLive, daysUntilKickoff } = useTournamentPhase();

  // Fetch live data from API with fallback to mock data
  const { matches: apiLiveMatches, loading: liveLoading, error: liveError } = useLiveMatches();
  const { standings: apiStandings, loading: standingsLoading, error: standingsError } = useStandings();
  const { scorers: apiScorers, loading: scorersLoading, error: scorersError } = useTopScorers();
  const { fixtures: apiFixtures, loading: fixturesLoading, error: fixturesError } = useFixtures();

  // Check if we're using mock data (only relevant during LIVE phase)
  const isUsingMockData = isLive && (apiLiveMatches.length === 0 && apiScorers.length === 0 && Object.keys(apiStandings).length === 0);
  const hasAnyError = liveError || standingsError || scorersError || fixturesError;

  // Use API data if available, otherwise use mock data
  const liveMatches = apiLiveMatches.length > 0 ? apiLiveMatches.slice(0, 3).map((m: any) => ({
    teamA: m.teamA.code || m.teamA.name.substring(0, 3),
    teamB: m.teamB.code || m.teamB.name.substring(0, 3),
    scoreA: m.teamA.score,
    scoreB: m.teamB.score
  })) : mockLiveMatches;

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Countdown Banner - Only visible before tournament starts */}
      {isPreTournament && <CountdownBanner />}

      {/* Header - Glassmorphism */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="h-14 px-4 md:px-8 lg:px-20 flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 md:w-60">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="md:w-7 md:h-7">
              <path
                d="M14 2L24 8.5L24 19.5L14 26L4 19.5L4 8.5L14 2Z"
                stroke="var(--green-live)"
                strokeWidth="2"
                fill="none"
              />
              <path d="M14 2L14 26M4 8.5L24 19.5M24 8.5L4 19.5" stroke="var(--green-live)" strokeWidth="1.5" />
            </svg>
            <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              <span className="text-lg md:text-xl font-extrabold text-white">WC</span>
              <span className="text-lg md:text-xl font-extrabold" style={{ color: 'var(--green-live)' }}>
                2026
              </span>
            </div>
          </div>

          {/* Navigation - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium transition-all duration-200 pb-1 relative`}
                style={{
                  color: activeTab === tab ? 'var(--white-primary)' : 'var(--white-muted)',
                  letterSpacing: '0.02em',
                }}
              >
                {tab}
                {activeTab === tab && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{
                      background: 'var(--green-live)',
                      boxShadow: '0 2px 12px rgba(0, 230, 118, 0.3)',
                    }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Zone */}
          <div className="flex items-center gap-2 md:gap-4 md:w-60 justify-end">
            <div
              className="hidden md:block overflow-hidden rounded px-3 py-1.5 max-w-[320px]"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-4 text-xs whitespace-nowrap animate-scroll">
                {[...liveMatches, ...liveMatches].map((match, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: 'var(--green-live)' }}
                    />
                    <span style={{ color: 'var(--white-muted)' }}>
                      {match.teamA}{' '}
                      <span style={{ color: 'var(--green-live)', fontFeatureSettings: '"tnum" 1' }}>
                        {match.scoreA}–{match.scoreB}
                      </span>{' '}
                      {match.teamB}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Search className="w-3 h-3 md:w-4 md:h-4" style={{ color: 'var(--white-muted)' }} />
            </button>
            <div
              className="px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'var(--green-live)',
                color: 'var(--void)',
                letterSpacing: '0.02em',
              }}
            >
              <span className="hidden md:inline">LIVE NOW: </span>3
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* API Status Banner */}
      <ApiStatusBanner error={hasAnyError} isUsingMockData={isUsingMockData} />

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row">
        {/* Left Sidebar - 220px */}
        <div className="hidden lg:block">
          <GroupNavigator activeGroup={activeGroup} onGroupChange={setActiveGroup} />
        </div>

        {/* Center Content */}
        <main className="flex-1 px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-10">
          <TournamentKPIs />

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <GroupStandings
            activeGroup={activeGroup}
            standings={apiStandings}
            loading={standingsLoading}
          />

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <MatchResultsGrid
            fixtures={apiFixtures}
            loading={fixturesLoading}
          />

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <TopScorersLeaderboard
            scorers={apiScorers}
            loading={scorersLoading}
          />
        </main>

        {/* Right Rail - 300px */}
        <aside className="w-full lg:w-[300px] px-4 md:px-6 py-6 md:py-8 space-y-4">
          <LiveScoresWidget
            matches={apiLiveMatches}
            loading={liveLoading}
          />
          <UpcomingFixtures
            fixtures={apiFixtures}
            loading={fixturesLoading}
          />
          <MoroccoFocusCard
            standings={apiStandings}
          />
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="grid grid-cols-5 h-16">
          {[
            { name: 'Home', active: true },
            { name: 'Fixtures', active: false },
            { name: 'Groups', active: false },
            { name: 'Scorers', active: false },
            { name: 'Stats', active: false },
          ].map((item) => (
            <button
              key={item.name}
              className="flex flex-col items-center justify-center gap-1"
              style={{
                color: item.active ? 'var(--green-live)' : 'var(--white-ghost)',
              }}
            >
              <div className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile spacing for bottom nav */}
      <div className="lg:hidden h-16" />

      {/* API Debug Panel */}
      <ApiDebugPanel />

      {/* Footer */}
      <footer
        className="border-t mt-16"
        style={{ background: 'var(--void)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-[1920px] mx-auto px-20 py-12 grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 2L24 8.5L24 19.5L14 26L4 19.5L4 8.5L14 2Z"
                  stroke="var(--green-live)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--green-live)' }} className="text-lg font-bold">
                WC2026
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--white-ghost)' }}>
              Every stat. Every match. Every moment.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>
              Quick Links
            </h4>
            <div className="space-y-2 text-sm" style={{ color: 'var(--white-muted)' }}>
              <div>Schedule</div>
              <div>Teams</div>
              <div>Venues</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>
              Data Sources
            </h4>
            <div className="space-y-2 text-sm" style={{ color: 'var(--white-muted)' }}>
              <div>FIFA Official</div>
              <div>Opta Stats</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>
              Social
            </h4>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
