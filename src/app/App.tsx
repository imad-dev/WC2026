import { useState } from 'react';
import { Search } from 'lucide-react';
import { Hero } from './components/Hero';
import { TournamentKPIs } from './components/TournamentKPIs';
import { WC2026Schedule } from './components/WC2026Schedule';
import { LeagueSelector } from './components/LeagueSelector';
import { LeagueStandings } from './components/LeagueStandings';
import { MatchResultsGrid } from './components/MatchResultsGrid';
import { TopScorersLeaderboard } from './components/TopScorersLeaderboard';
import { LiveScoresWidget } from './components/LiveScoresWidget';
import { UpcomingFixtures } from './components/UpcomingFixtures';
import { MoroccoFocusCard } from './components/MoroccoFocusCard';
import { ApiStatusBanner } from './components/ApiStatusBanner';
import { CountdownBanner } from './components/CountdownBanner';
import { useTournamentPhase } from '../hooks/useTournamentPhase';
import { COMPETITIONS, type CompetitionCode } from '../services/api';

const TABS = ['OVERVIEW', 'LEAGUES', 'GROUPS', 'MAP'] as const;
type Tab = typeof TABS[number];

const NAV_ITEMS = [
  { name: 'Home', tab: 'OVERVIEW' as Tab },
  { name: 'Leagues', tab: 'LEAGUES' as Tab },
  { name: 'Groups', tab: 'GROUPS' as Tab },
  { name: 'Map', tab: 'MAP' as Tab },
];

// Scoreboard ticker items (upcoming WC2026 opener + Moroccan matches)
const TICKER = [
  { a: 'MEX', b: 'RSA', info: 'Jun 11 · Opener' },
  { a: 'MAR', b: 'Group F', info: 'WC2026 · TBD' },
  { a: 'ARG', b: 'Group C', info: 'WC2026 · TBD' },
  { a: 'BRA', b: 'Group G', info: 'WC2026 · TBD' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [activeLeague, setActiveLeague] = useState<CompetitionCode>('PL');

  const { isPreTournament, daysUntilKickoff } = useTournamentPhase();

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Countdown Banner */}
      {isPreTournament && <CountdownBanner />}

      {/* ── HEADER ───────────────────────────────────────── */}
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
          <div className="flex items-center gap-2 md:w-56">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L24 8.5L24 19.5L14 26L4 19.5L4 8.5L14 2Z" stroke="var(--green-live)" strokeWidth="2" fill="none" />
              <path d="M14 2L14 26M4 8.5L24 19.5M24 8.5L4 19.5" stroke="var(--green-live)" strokeWidth="1.5" />
            </svg>
            <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              <span className="text-xl font-extrabold text-white">WC</span>
              <span className="text-xl font-extrabold" style={{ color: 'var(--green-live)' }}>2026</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                id={`nav-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className="text-sm font-medium transition-all duration-200 pb-1 relative"
                style={{ color: activeTab === tab ? 'var(--white-primary)' : 'var(--white-muted)', letterSpacing: '0.02em' }}
              >
                {tab}
                {activeTab === tab && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--green-live)', boxShadow: '0 2px 8px rgba(0,230,118,0.4)' }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right zone */}
          <div className="flex items-center gap-3 md:w-56 justify-end">
            {/* Ticker */}
            <div
              className="hidden md:flex overflow-hidden rounded-md px-3 py-1.5"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', maxWidth: '240px' }}
            >
              <div className="flex items-center gap-4 text-xs whitespace-nowrap animate-scroll">
                {[...TICKER, ...TICKER].map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1.5" style={{ color: 'var(--white-muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-leader)' }} />
                    {item.a} vs {item.b}
                    <span style={{ color: 'var(--white-ghost)' }}>· {item.info}</span>
                  </span>
                ))}
              </div>
            </div>

            <button className="p-2 rounded hover:bg-muted transition-colors" aria-label="Search">
              <Search className="w-4 h-4" style={{ color: 'var(--white-muted)' }} />
            </button>

            {/* WC countdown badge */}
            <div
              className="hidden sm:flex px-3 py-1.5 rounded-full text-xs font-semibold items-center gap-1.5"
              style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--green-live)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />
              {daysUntilKickoff}d
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────── */}
      <Hero />

      {/* ── API STATUS BANNER ─────────────────────────────── */}
      <ApiStatusBanner />

      {/* ── MAIN LAYOUT ───────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row">

        {/* ── CENTER CONTENT ─────────────────────────────── */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-10 space-y-10 min-w-0">

          {/* Tournament KPIs — always visible */}
          <TournamentKPIs />

          <div className="h-px" style={{ background: 'var(--border)' }} />

          {/* ── OVERVIEW + LEAGUES tab ─────────────────────── */}
          {(activeTab === 'OVERVIEW' || activeTab === 'LEAGUES') && (
            <>
              {/* League selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-2xl font-semibold uppercase"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--white-primary)' }}
                  >
                    European Leagues
                  </h2>
                </div>
                <LeagueSelector selected={activeLeague} onChange={setActiveLeague} />
              </div>

              {/* League data sections */}
              <LeagueStandings competition={activeLeague} />

              <div className="h-px" style={{ background: 'var(--border)' }} />

              <MatchResultsGrid competition={activeLeague} />

              <div className="h-px" style={{ background: 'var(--border)' }} />

              <TopScorersLeaderboard competition={activeLeague} />
            </>
          )}

          {activeTab === 'GROUPS' && <WC2026Schedule />}

          {/* ── MAP tab ─────────────────────────────────────── */}
          {activeTab === 'MAP' && (
            <section id="venues-map">
              <h2
                className="text-2xl font-semibold uppercase mb-6"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--white-primary)' }}
              >
                WC2026 Venues
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: 'MetLife Stadium', city: 'New York/NJ', flag: '🇺🇸', capacity: '82,500' },
                  { name: 'AT&T Stadium', city: 'Dallas', flag: '🇺🇸', capacity: '80,000' },
                  { name: 'SoFi Stadium', city: 'Los Angeles', flag: '🇺🇸', capacity: '70,240' },
                  { name: "Levi's Stadium", city: 'San Francisco', flag: '🇺🇸', capacity: '68,500' },
                  { name: 'Arrowhead Stadium', city: 'Kansas City', flag: '🇺🇸', capacity: '76,416' },
                  { name: 'Mercedes-Benz Stadium', city: 'Atlanta', flag: '🇺🇸', capacity: '71,000' },
                  { name: 'Lincoln Financial Field', city: 'Philadelphia', flag: '🇺🇸', capacity: '69,796' },
                  { name: 'NRG Stadium', city: 'Houston', flag: '🇺🇸', capacity: '72,220' },
                  { name: 'Lumen Field', city: 'Seattle', flag: '🇺🇸', capacity: '69,000' },
                  { name: 'Hard Rock Stadium', city: 'Miami', flag: '🇺🇸', capacity: '64,767' },
                  { name: 'Gillette Stadium', city: 'Boston', flag: '🇺🇸', capacity: '65,878' },
                  { name: 'Estadio Azteca', city: 'Mexico City', flag: '🇲🇽', capacity: '87,523', isOpener: true },
                  { name: 'Estadio Akron', city: 'Guadalajara', flag: '🇲🇽', capacity: '49,850' },
                  { name: 'Estadio BBVA', city: 'Monterrey', flag: '🇲🇽', capacity: '53,464' },
                  { name: 'BMO Field', city: 'Toronto', flag: '🇨🇦', capacity: '30,990' },
                  { name: 'BC Place', city: 'Vancouver', flag: '🇨🇦', capacity: '54,500' },
                ].map((venue) => (
                  <div
                    key={venue.name}
                    className="rounded-lg p-4 border transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: (venue as any).isOpener ? 'var(--gold-leader)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{venue.flag}</span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>{venue.name}</span>
                      {(venue as any).isOpener && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--gold-leader)', color: 'var(--void)', fontWeight: 700 }}>OPENER</span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>{venue.city}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--green-live)' }}>⚽ {venue.capacity} cap.</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── RIGHT RAIL ─────────────────────────────────── */}
        <aside className="w-full lg:w-[300px] px-4 md:px-6 py-6 md:py-10 space-y-4 flex-shrink-0">
          <LiveScoresWidget />
          <UpcomingFixtures competition={activeLeague} />
          <MoroccoFocusCard />
        </aside>
      </div>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(20px)', borderColor: 'var(--border)' }}
      >
        <div className="grid grid-cols-4 h-16">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              id={`mobile-nav-${item.name.toLowerCase()}`}
              onClick={() => setActiveTab(item.tab)}
              className="flex flex-col items-center justify-center gap-1"
              style={{ color: activeTab === item.tab ? 'var(--green-live)' : 'var(--white-ghost)' }}
            >
              <div className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="lg:hidden h-16" />

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t mt-16" style={{ background: 'var(--void)', borderColor: 'var(--border)' }}>
        <div className="max-w-[1920px] mx-auto px-6 md:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L24 8.5L24 19.5L14 26L4 19.5L4 8.5L14 2Z" stroke="var(--green-live)" strokeWidth="2" fill="none" />
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--green-live)', fontSize: '1.1rem', fontWeight: 700 }}>WC2026</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--white-ghost)' }}>
              Every stat. Every match. Every moment.<br />
              Live data from football-data.org
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>Quick Links</h4>
            <div className="space-y-2 text-sm" style={{ color: 'var(--white-muted)' }}>
              {['Schedule', 'Groups', 'Venues', 'Morocco'].map(l => (
                <div key={l} className="hover:text-white cursor-pointer transition-colors">{l}</div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>Data Sources</h4>
            <div className="space-y-2 text-xs" style={{ color: 'var(--white-muted)' }}>
              <div>football-data.org (live leagues)</div>
              <div>worldcupapi.com (WC2026 — coming Jun 2026)</div>
              <div>FIFA official static data</div>
            </div>
          </div>
        </div>
        <div className="border-t px-6 md:px-20 py-4 flex items-center justify-between text-xs" style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}>
          <span>© 2026 WC2026 Stats. All rights reserved.</span>
          <span>USA · Canada · Mexico</span>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
