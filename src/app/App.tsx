import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Newspaper, Globe } from 'lucide-react';
import { Hero } from './components/Hero';
import { TournamentKPIs } from './components/TournamentKPIs';
import { WC2026Schedule } from './components/WC2026Schedule';
import { MoroccoFocusCard } from './components/MoroccoFocusCard';
import { CountdownBanner } from './components/CountdownBanner';
import { useTournamentPhase } from '../hooks/useTournamentPhase';
import { NewsSection } from './components/NewsSection';

const TABS = ['SCHEDULE', 'GROUPS', 'TEAMS', 'VENUES'] as const;
type Tab = typeof TABS[number];

const TICKER = [
  { text: 'MEX vs RSA · Jun 11 · Opener · Estadio Azteca' },
  { text: 'BRA vs MAR · Jun 13 · Group C' },
  { text: 'FRA vs SEN · Jun 16 · Group I' },
  { text: 'ARG vs DZA · Jun 17 · Group J' },
  { text: 'ENG vs CRO · Jun 17 · Group L' },
  { text: 'ESP vs CPV · Jun 15 · Group H' },
  { text: 'Final · MetLife Stadium · Jul 19' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('SCHEDULE');
  const { isPreTournament, daysUntilKickoff } = useTournamentPhase();

  // Map tab to WC2026Schedule sub-view
  const scheduleView = activeTab === 'SCHEDULE' ? 'schedule'
    : activeTab === 'GROUPS' ? 'groups'
    : activeTab === 'TEAMS' ? 'teams'
    : null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)', fontFamily: 'var(--font-body)' }}>
      {isPreTournament && <CountdownBanner />}

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(20px) saturate(180%)', borderColor: 'var(--border)' }}
      >
        <div className="h-14 px-4 md:px-8 lg:px-20 flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
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
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--green-live)', boxShadow: '0 2px 8px rgba(0,230,118,0.4)' }} />
                )}
              </button>
            ))}
            <Link to="/news"
              id="nav-news"
              className="flex items-center gap-1.5 text-sm font-medium transition-all duration-200 pb-1"
              style={{ color: 'var(--white-muted)', letterSpacing: '0.02em' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--white-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-muted)')}>
              <Newspaper className="w-3.5 h-3.5" /> NEWS
            </Link>
          </nav>

          {/* Right zone */}
          <div className="flex items-center gap-3">
            {/* Scrolling ticker */}
            <div className="hidden md:flex overflow-hidden rounded-md px-3 py-1.5 max-w-[260px]"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-6 text-xs whitespace-nowrap animate-scroll">
                {[...TICKER, ...TICKER].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5" style={{ color: 'var(--white-muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold-leader)' }} />
                    {item.text}
                  </span>
                ))}
              </div>
            </div>

            <button className="p-2 rounded hover:bg-muted transition-colors" aria-label="Search">
              <Search className="w-4 h-4" style={{ color: 'var(--white-muted)' }} />
            </button>

            <div className="hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5"
              style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--green-live)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />
              {daysUntilKickoff}d to KO
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <Hero />

      {/* ── TOURNAMENT KPIs ── */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8">
        <TournamentKPIs />
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-0">

        {/* ── CENTER ── */}
        <main className="flex-1 px-4 md:px-8 lg:px-20 pb-10 min-w-0">
          <div className="h-px mb-8" style={{ background: 'var(--border)' }} />

          {/* Tab content — all driven by WC2026Schedule with forced view */}
          {scheduleView && <WC2026Schedule forcedView={scheduleView as any} />}

          {/* VENUES tab */}
          {activeTab === 'VENUES' && (
            <section id="venues">
              <h2 className="text-2xl font-semibold uppercase mb-6"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--white-primary)' }}>
                16 Official Venues
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name:'MetLife Stadium',        city:'New York/NJ',   flag:'🇺🇸', cap:'82,500', note:'FINAL' },
                  { name:"AT&T Stadium",           city:'Dallas',         flag:'🇺🇸', cap:'80,000', note:'' },
                  { name:'SoFi Stadium',           city:'Los Angeles',    flag:'🇺🇸', cap:'70,240', note:'' },
                  { name:"Levi's Stadium",         city:'San Francisco',  flag:'🇺🇸', cap:'68,500', note:'' },
                  { name:'Arrowhead Stadium',      city:'Kansas City',    flag:'🇺🇸', cap:'76,416', note:'' },
                  { name:'Mercedes-Benz Stadium',  city:'Atlanta',        flag:'🇺🇸', cap:'71,000', note:'' },
                  { name:'Lincoln Financial Field',city:'Philadelphia',   flag:'🇺🇸', cap:'69,796', note:'' },
                  { name:'NRG Stadium',            city:'Houston',        flag:'🇺🇸', cap:'72,220', note:'' },
                  { name:'Lumen Field',            city:'Seattle',        flag:'🇺🇸', cap:'69,000', note:'' },
                  { name:'Hard Rock Stadium',      city:'Miami',          flag:'🇺🇸', cap:'64,767', note:'' },
                  { name:'Gillette Stadium',       city:'Boston',         flag:'🇺🇸', cap:'65,878', note:'' },
                  { name:'Estadio Azteca',         city:'Mexico City',    flag:'🇲🇽', cap:'87,523', note:'OPENER' },
                  { name:'Estadio Akron',          city:'Guadalajara',    flag:'🇲🇽', cap:'49,850', note:'' },
                  { name:'Estadio BBVA',           city:'Monterrey',      flag:'🇲🇽', cap:'53,464', note:'' },
                  { name:'BMO Field',              city:'Toronto',        flag:'🇨🇦', cap:'30,990', note:'' },
                  { name:'BC Place',               city:'Vancouver',      flag:'🇨🇦', cap:'54,500', note:'' },
                ].map((v) => (
                  <div key={v.name}
                    className="rounded-lg p-4 border transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: v.note ? 'var(--gold-leader)' : 'var(--border)',
                    }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{v.flag}</span>
                      <span className="text-sm font-semibold flex-1" style={{ color: 'var(--white-primary)' }}>{v.name}</span>
                      {v.note && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                          style={{ background: v.note === 'FINAL' ? 'var(--gold-leader)' : 'var(--green-live)', color: 'var(--void)' }}>
                          {v.note}
                        </span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>{v.city}</div>
                    <div className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--green-live)' }}>⚽ {v.cap} capacity</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── NEWS SECTION ── */}
        <div className="px-4 md:px-6 pb-6">
          <NewsSection />
        </div>

        {/* ── RIGHT RAIL ── */}
        <aside className="w-full lg:w-[300px] px-4 md:px-6 pb-10 space-y-4 flex-shrink-0">
          <MoroccoFocusCard />

          {/* Quick facts */}
          <div className="rounded-xl border p-4" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4" style={{ color: 'var(--gold-leader)' }} />
              <h3 className="text-sm font-semibold uppercase" style={{ color: 'var(--white-primary)', letterSpacing: '0.06em' }}>
                Tournament Facts
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              {[
                ['Format', '12 groups of 4 → R32 → R16 → QF → SF → Final'],
                ['Qualification', '3 per group (top 2 + 8 best 3rd place)'],
                ['Prize Fund', '$1 billion (record)'],
                ['Broadcast', '5 billion viewers expected'],
                ['Balls', 'Adidas "Félin 24"'],
                ['Mascot', 'Taíno-inspired design'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="font-semibold flex-shrink-0 w-24" style={{ color: 'var(--white-ghost)' }}>{k}</span>
                  <span style={{ color: 'var(--white-muted)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t grid grid-cols-4 h-16"
        style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(20px)', borderColor: 'var(--border)' }}>
        {TABS.map((tab) => (
          <button key={tab} id={`mobile-nav-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className="flex flex-col items-center justify-center gap-1"
            style={{ color: activeTab === tab ? 'var(--green-live)' : 'var(--white-ghost)' }}>
            <span className="text-xs font-semibold">{tab}</span>
          </button>
        ))}
      </nav>
      <div className="lg:hidden h-16" />

      {/* ── FOOTER ── */}
      <footer className="border-t mt-8" style={{ background: 'var(--void)', borderColor: 'var(--border)' }}>
        <div className="max-w-[1920px] mx-auto px-6 md:px-20 pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L24 8.5L24 19.5L14 26L4 19.5L4 8.5L14 2Z" stroke="var(--green-live)" strokeWidth="2" fill="none" />
                <path d="M14 2L14 26M4 8.5L24 19.5M24 8.5L4 19.5" stroke="var(--green-live)" strokeWidth="1.5" />
              </svg>
              <span className="font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>WC<span style={{ color: 'var(--green-live)' }}>2026</span>.games</span>
              <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>— Every stat. Every match. Every moment.</span>
            </div>
            {/* Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <Link to="/about" className="transition-colors hover:text-white" style={{ color: 'var(--white-ghost)' }}>About Us</Link>
              <Link to="/contact" className="transition-colors hover:text-white" style={{ color: 'var(--white-ghost)' }}>Contact</Link>
              <Link to="/privacy" className="transition-colors hover:text-white" style={{ color: 'var(--white-ghost)' }}>Privacy Policy</Link>
              <Link to="/terms" className="transition-colors hover:text-white" style={{ color: 'var(--white-ghost)' }}>Terms of Service</Link>
            </nav>
          </div>
          <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}>
            <span>© 2026 WC2026.games · All rights reserved</span>
            <span>Not affiliated with FIFA · 🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico · Jun 11 – Jul 19, 2026</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll { animation: scroll 35s linear infinite; }
      `}</style>
    </div>
  );
}
