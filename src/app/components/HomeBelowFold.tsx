'use client';

import Link from 'next/link';
import { useMatches, useWCStandings } from '@/hooks/useSupabase';
import { MatchCard } from '@/components/ui/MatchCard';
import { ChevronRight, Trophy, Calendar, Newspaper } from 'lucide-react';

const NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&q=80',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80',
];

export function HomeBelowFold() {
  const { matches } = useMatches();
  const { standings } = useWCStandings();

  // 1. TODAY'S MATCHES — take first 6
  const todayMatches = matches.slice(0, 6);

  // 2. GROUP STANDINGS SNAPSHOT (Groups A, B, C, D)
  const snapshotGroups = ['A', 'B', 'C', 'D'].map(groupName => {
    const liveGroupStandings = standings.filter(s => s.group_name === groupName);

    if (liveGroupStandings.length > 0) {
      return { name: groupName, standings: liveGroupStandings.map(s => ({ team: s.team, played: s.played, pts: s.points })) };
    }

    const groupMatches = matches.filter(m => m.group_name === groupName);
    const teams = Array.from(new Set(groupMatches.flatMap(m => [m.home_team, m.away_team])));
    return {
      name: groupName,
      standings: teams.map(team => ({
        team, played: 0, pts: 0
      }))
    };
  });

  // 3. MOCK NEWS
  const mockNews = [
    { title: 'FIFA Announces Final Venues for 2026 World Cup', category: 'Official', date: '2h ago' },
    { title: 'Estadio Azteca Ready for Historic Third Opening Match', category: 'Venues', date: '5h ago' },
    { title: 'Ticket Sales Break Records in First 24 Hours', category: 'Tickets', date: '1d ago' }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">

      {/* ─── SECTION 1: TODAY'S MATCHES ──────────────────────── */}
      <section id="matches" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-green)] mb-2 font-semibold flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Upcoming fixtures
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-white tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TODAY'S MATCHES
            </h2>
          </div>
          <Link
            href="/schedule"
            className="text-xs sm:text-sm font-bold text-[var(--wc-green)] hover:text-white transition-colors flex items-center gap-1 shrink-0"
          >
            FULL SCHEDULE <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          {todayMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* ─── SECTION 2: GROUP STANDINGS SNAPSHOT ──────────────── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-2 font-semibold flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" />
              Group stage
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-white tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              GROUP STANDINGS
            </h2>
          </div>
          <Link
            href="/groups"
            className="text-xs sm:text-sm font-bold text-[var(--wc-gold)] hover:text-white transition-colors flex items-center gap-1 shrink-0"
          >
            ALL GROUPS <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {snapshotGroups.map(group => (
            <div
              key={group.name}
              className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl overflow-hidden flex flex-col hover:border-[rgba(245,166,35,0.3)] transition-colors"
            >
              <div
                className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[var(--wc-border)] flex items-center gap-2"
                style={{ background: 'var(--wc-surface-2)' }}
              >
                <div className="w-1 h-5 bg-[var(--wc-gold)] rounded-full shrink-0" />
                <span
                  className="text-lg sm:text-xl text-white tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  GROUP {group.name}
                </span>
              </div>
              <div className="p-3 sm:p-4 flex-1">
                {group.standings.map((team, idx) => (
                  <div
                    key={team.team}
                    className="flex items-center justify-between py-2 sm:py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-[var(--wc-text-muted)] font-bold w-4 text-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-sm text-white truncate">{team.team}</span>
                    </div>
                    <span className="font-bold text-sm tabular-nums text-[var(--wc-green)] shrink-0 ml-2">
                      {team.pts} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 3: LATEST NEWS ──────────────────────────── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-red)] mb-2 font-semibold flex items-center gap-2">
              <Newspaper className="w-3.5 h-3.5" />
              Stay updated
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-white tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LATEST NEWS
            </h2>
          </div>
          <Link
            href="/news"
            className="text-xs sm:text-sm font-bold text-[var(--wc-red)] hover:text-white transition-colors flex items-center gap-1 shrink-0"
          >
            MORE NEWS <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {mockNews.map((news, i) => (
            <Link
              href="/news"
              key={i}
              className="group flex flex-col bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl overflow-hidden hover:border-[rgba(232,0,29,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-40 sm:h-48 w-full overflow-hidden relative">
                <img
                  src={NEWS_IMAGES[i]}
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-2.5 py-1 bg-[var(--wc-red)] text-white text-[9px] sm:text-[10px] font-bold tracking-wider rounded uppercase">
                  {news.category}
                </div>
              </div>
              <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">
                <h3 className="font-bold text-sm sm:text-base leading-snug text-white group-hover:text-[var(--wc-red)] transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <span className="text-xs text-[var(--wc-text-muted)] mt-auto">{news.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
