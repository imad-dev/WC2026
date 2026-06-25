'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useMatches } from '../../hooks/useSupabase';
import type { WC2026Match } from '../../lib/supabaseClient';
import { MatchCard } from '@/components/ui/MatchCard';
import { Calendar, Loader2 } from 'lucide-react';
import { createMatchSlug } from '../../lib/utils/slug';

type FilterTab = 'all' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'knockout';
const GROUP_TABS: FilterTab[] = ['A','B','C','D','E','F','G','H','I','J','K','L'];

function formatLocalDateHeader(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr)).toUpperCase();
}

export function MatchGrid({ onMatchClick }: { onMatchClick?: (match: WC2026Match) => void }) {
  const router = useRouter();
  const { matches, loading } = useMatches();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredMatches = useMemo(() => {
    if (activeTab === 'all') return matches;
    if (activeTab === 'knockout') return matches.filter((m) => !m.group_name);
    return matches.filter((m) => m.group_name === activeTab);
  }, [matches, activeTab]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, WC2026Match[]> = {};
    filteredMatches.forEach((m) => {
      const dateKey = new Date(m.kickoff_utc).toISOString().split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    // Sort dates
    return Object.keys(groups).sort().map(date => ({
      date,
      matches: groups[date]
    }));
  }, [filteredMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--wc-green)]" />
        <p className="text-[var(--wc-text-muted)] font-mono tracking-widest uppercase text-sm">Loading Schedule...</p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-green)] mb-3 font-semibold">
            Full Tournament Schedule
          </p>
          <h1 className="text-4xl md:text-5xl text-[var(--wc-text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            MATCH SCHEDULE
          </h1>
          <p className="text-[var(--wc-text-muted)] text-sm md:text-base">
            All 104 matches across USA, Canada, and Mexico.
          </p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="relative mb-10 pb-2 overflow-x-auto snap-x scrollbar-hide">
        <div className="flex gap-2 min-w-max px-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`snap-start shrink-0 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${activeTab === 'all' ? 'bg-[var(--wc-green)] text-black shadow-[0_0_15px_rgba(0,166,81,0.4)]' : 'bg-[var(--wc-surface-2)] text-[var(--wc-text-muted)] hover:bg-[var(--wc-surface-2)] hover:text-white'}`}
          >
            All Matches
          </button>
          
          <div className="w-px bg-[var(--wc-border)] mx-2 my-1" />
          
          {GROUP_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`snap-start shrink-0 w-9 h-9 sm:w-12 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === tab ? 'bg-[var(--wc-green)] text-black shadow-[0_0_15px_rgba(0,166,81,0.4)]' : 'bg-[var(--wc-surface-2)] text-[var(--wc-text-muted)] hover:bg-[var(--wc-surface-2)] hover:text-white'}`}
            >
              {tab}
            </button>
          ))}

          <div className="w-px bg-[var(--wc-border)] mx-2 my-1" />

          <button
            onClick={() => setActiveTab('knockout')}
            className={`snap-start shrink-0 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${activeTab === 'knockout' ? 'bg-[var(--wc-gold)] text-black shadow-[0_0_15px_rgba(245,166,35,0.4)]' : 'bg-[var(--wc-surface-2)] text-[var(--wc-text-muted)] hover:bg-[var(--wc-surface-2)] hover:text-white'}`}
          >
            Knockout
          </button>
        </div>
      </div>

      {/* MATCH GRID WITH ANIMATIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--wc-surface)] rounded-2xl border border-[var(--wc-border)]">
              <span className="text-6xl mb-4 animate-bounce">⚽</span>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>No matches for this group yet</h3>
              <p className="text-[var(--wc-text-muted)] text-sm">Check back later or select another filter.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {groupedByDate.map((group) => (
                <section key={group.date}>
                  <div className="sticky top-[64px] z-30 bg-[rgba(10,14,26,0.9)] backdrop-blur-md py-4 mb-6 border-b border-[var(--wc-border)]">
                    <h2 className="text-2xl tracking-wider text-[var(--wc-text-muted)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {formatLocalDateHeader(group.matches[0].kickoff_utc)}
                    </h2>
                  </div>
                  
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6" 
                  >
                    {group.matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onClick={() => {
                          if (onMatchClick) onMatchClick(match);
                          else router.push(`/match/${createMatchSlug(match.home_team, match.away_team)}`);
                        }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
