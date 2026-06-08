"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMatches } from '../../hooks/useSupabase';
import { LivePlayer } from '../components/wc2026/LivePlayer';
import { MatchSchedule } from '../components/wc2026/MatchSchedule';
import { GroupStandings } from '../components/wc2026/GroupStandings';
import type { WC2026Match } from '../../lib/supabaseClient';
import { ArrowLeft, Tv, Calendar, BarChart3, Trophy } from 'lucide-react';

type HubTab = 'live' | 'schedule' | 'standings';

export default function WorldCup2026Hub() {
  const { matches } = useMatches();
  const [activeTab, setActiveTab] = useState<HubTab>('live');
  const [selectedMatch, setSelectedMatch] = useState<WC2026Match | null>(null);


  // Find next upcoming or currently live match
  const nextMatch = useMemo(() => {
    const now = Date.now();
    // First check for live matches
    const liveMatch = matches.find((m) => m.status === 'live');
    if (liveMatch) return liveMatch;
    // Then find next upcoming
    return matches.find(
      (m) => m.status === 'upcoming' && new Date(m.kickoff_utc).getTime() > now
    ) ?? null;
  }, [matches]);

  // Count live matches
  const liveCount = useMemo(
    () => matches.filter((m) => m.status === 'live').length,
    [matches]
  );

  const handleMatchClick = (match: WC2026Match) => {
    setSelectedMatch(match);
    if (match.status === 'live') {
      setActiveTab('live');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const TABS: { key: HubTab; label: string; icon: React.ReactNode; accent?: boolean }[] = [
    {
      key: 'live',
      label: 'Live',
      icon: <Tv className="w-4 h-4" />,
      accent: liveCount > 0,
    },
    {
      key: 'schedule',
      label: 'Schedule',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      key: 'standings',
      label: 'Standings',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)', fontFamily: 'var(--font-body)' }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: 'var(--white-ghost)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="h-5 w-px" style={{ background: 'var(--border)' }} />

            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" style={{ color: 'var(--gold-leader)' }} />
              <span className="font-bold text-sm" style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--white-primary)',
                letterSpacing: '-0.01em',
              }}>
                FIFA WORLD CUP
              </span>
              <span className="text-sm font-bold" style={{
                color: 'var(--green-live)',
                fontFamily: 'var(--font-display)',
              }}>
                2026
              </span>
            </div>
          </div>

          {/* Live badge */}
          {liveCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{
              background: 'rgba(0,230,118,0.12)',
              border: '1px solid rgba(0,230,118,0.25)',
              color: 'var(--green-live)',
            }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{
                background: 'var(--green-live)',
                boxShadow: '0 0 6px var(--green-live)',
              }} />
              {liveCount} LIVE
            </div>
          )}
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden" style={{
        background: `
          linear-gradient(180deg,
            rgba(0,230,118,0.06) 0%,
            transparent 40%
          ),
          radial-gradient(ellipse at 70% 0%, rgba(255,179,0,0.04) 0%, transparent 50%),
          var(--void)
        `,
      }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{
                  background: 'rgba(0,230,118,0.12)',
                  color: 'var(--green-live)',
                  border: '1px solid rgba(0,230,118,0.2)',
                }}>
                  Live Hub
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{
                  background: 'rgba(255,179,0,0.12)',
                  color: 'var(--gold-leader)',
                  border: '1px solid rgba(255,179,0,0.2)',
                }}>
                  🇺🇸 🇲🇽 🇨🇦
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-1" style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--white-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                Watch Every Match <span style={{ color: 'var(--green-live)' }}>Live</span>
              </h1>
              <p className="text-sm md:text-base" style={{ color: 'var(--white-muted)' }}>
                All 104 matches · Real-time scores · Free streams · Group standings
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--white-ghost)' }}>
              <span>June 11 – July 19, 2026</span>
              <span>·</span>
              <span>48 teams · 16 venues</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="sticky top-14 z-40 border-b" style={{
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--border)',
      }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                id={`hub-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 relative"
                style={{
                  color: activeTab === tab.key
                    ? tab.accent ? 'var(--green-live)' : 'var(--white-primary)'
                    : 'var(--white-ghost)',
                }}
              >
                {tab.icon}
                {tab.label}
                {tab.key === 'live' && liveCount > 0 && (
                  <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{
                    background: 'var(--green-live)',
                    color: 'var(--void)',
                  }}>
                    {liveCount}
                  </span>
                )}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{
                    background: tab.accent ? 'var(--green-live)' : 'var(--white-primary)',
                    boxShadow: tab.accent ? '0 2px 8px rgba(0,230,118,0.4)' : 'none',
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {activeTab === 'live' && (
          <div className="space-y-8">
            <LivePlayer nextMatch={selectedMatch || nextMatch} />

            {/* Quick upcoming matches below player */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matches
                .filter((m) => m.status === 'live' || m.status === 'upcoming')
                .slice(0, 6)
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleMatchClick(m)}
                    className="text-left rounded-xl p-3 border transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: m.status === 'live'
                        ? 'linear-gradient(135deg, rgba(0,230,118,0.08) 0%, var(--surface-1) 100%)'
                        : 'var(--surface-1)',
                      borderColor: m.status === 'live' ? 'rgba(0,230,118,0.3)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold" style={{
                        color: m.group_name ? 'var(--white-ghost)' : 'var(--gold-leader)',
                      }}>
                        {m.group_name ? `Group ${m.group_name}` : 'Knockout'}
                      </span>
                      {m.status === 'live' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: 'var(--green-live)' }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                      {m.home_team} vs {m.away_team}
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: 'var(--white-ghost)' }}>
                      {new Intl.DateTimeFormat(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(m.kickoff_utc))}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <MatchSchedule onMatchClick={handleMatchClick} />
        )}

        {activeTab === 'standings' && (
          <GroupStandings />
        )}
      </main>

      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsEvent',
            name: 'FIFA World Cup 2026',
            description: 'The 23rd FIFA World Cup hosted by USA, Mexico, and Canada',
            startDate: '2026-06-11',
            endDate: '2026-07-19',
            location: {
              '@type': 'Place',
              name: 'Multiple venues across USA, Mexico, and Canada',
              address: {
                '@type': 'PostalAddress',
                addressCountry: ['US', 'MX', 'CA'],
              },
            },
            organizer: {
              '@type': 'Organization',
              name: 'FIFA',
              url: 'https://www.fifa.com',
            },
            sport: 'Football/Soccer',
            competitor: '48 national teams',
            url: 'https://wc2026.games/world-cup-2026',
            performer: [
              {
                '@type': 'SportsTeam',
                name: '48 National Teams',
              }
            ],
            offers: {
              '@type': 'Offer',
              url: 'https://wc2026.games/world-cup-2026',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t grid grid-cols-3 h-14" style={{
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex flex-col items-center justify-center gap-0.5"
            style={{
              color: activeTab === tab.key
                ? tab.accent ? 'var(--green-live)' : 'var(--white-primary)'
                : 'var(--white-ghost)',
            }}
          >
            {tab.icon}
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="lg:hidden h-14" />
    </div>
  );
}
