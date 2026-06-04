import { useState, useMemo } from 'react';
import { useMatches } from '../../../hooks/useSupabase';
import type { WC2026Match } from '../../../lib/supabaseClient';
import { Calendar, Trophy, Users, Loader2 } from 'lucide-react';

interface MatchScheduleProps {
  onMatchClick?: (match: WC2026Match) => void;
}

// ── Tab definitions ────────────────────────────────────────────

type FilterTab =
  | 'all'
  | 'today'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'
  | 'knockout';

const GROUP_TABS: FilterTab[] = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// ── Helpers ────────────────────────────────────────────────────

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function formatLocalTime(dateStr: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(dateStr));
}

function formatLocalDate(dateStr: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

function getCountdown(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return 'Now';
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (h > 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h`;
  }
  return `${h}h ${m}m`;
}

// ── Component ──────────────────────────────────────────────────

export function MatchSchedule({ onMatchClick }: MatchScheduleProps) {
  const { matches, loading } = useMatches();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredMatches = useMemo(() => {
    if (activeTab === 'all') return matches;
    if (activeTab === 'today') return matches.filter((m) => isToday(m.kickoff_utc));
    if (activeTab === 'knockout') return matches.filter((m) => !m.group_name);
    return matches.filter((m) => m.group_name === activeTab);
  }, [matches, activeTab]);

  // Group matches by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, WC2026Match[]> = {};
    filteredMatches.forEach((m) => {
      const dateKey = new Date(m.kickoff_utc).toLocaleDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return groups;
  }, [filteredMatches]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--green-live)' }} />
      </div>
    );
  }

  return (
    <section id="match-schedule">
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 mb-5">
        <Calendar className="w-5 h-5" style={{ color: 'var(--green-live)' }} />
        <h2 className="text-xl font-bold uppercase" style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--white-primary)',
          letterSpacing: '-0.01em',
        }}>
          Match Schedule
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
          background: 'rgba(0,230,118,0.1)',
          color: 'var(--green-live)',
          border: '1px solid rgba(0,230,118,0.2)',
        }}>
          {matches.length} matches
        </span>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="mb-6 overflow-x-auto pb-2 -mx-1">
        <div className="flex gap-1.5 min-w-max px-1">
          {/* Main tabs */}
          {(['all', 'today'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all duration-200"
              style={{
                background: activeTab === tab ? 'var(--green-live)' : 'var(--surface-2)',
                color: activeTab === tab ? 'var(--void)' : 'var(--white-muted)',
                border: `1px solid ${activeTab === tab ? 'var(--green-live)' : 'var(--border)'}`,
              }}
            >
              {tab === 'all' ? '📋 All' : '📅 Today'}
            </button>
          ))}

          {/* Separator */}
          <div className="w-px mx-1 self-stretch" style={{ background: 'var(--border)' }} />

          {/* Group tabs */}
          {GROUP_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center"
              style={{
                background: activeTab === tab ? 'var(--green-live)' : 'var(--surface-2)',
                color: activeTab === tab ? 'var(--void)' : 'var(--white-muted)',
                border: `1px solid ${activeTab === tab ? 'var(--green-live)' : 'var(--border)'}`,
              }}
            >
              {tab}
            </button>
          ))}

          {/* Separator */}
          <div className="w-px mx-1 self-stretch" style={{ background: 'var(--border)' }} />

          {/* Knockout */}
          <button
            onClick={() => setActiveTab('knockout')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all duration-200 flex items-center gap-1.5"
            style={{
              background: activeTab === 'knockout' ? 'var(--gold-leader)' : 'var(--surface-2)',
              color: activeTab === 'knockout' ? 'var(--void)' : 'var(--white-muted)',
              border: `1px solid ${activeTab === 'knockout' ? 'var(--gold-leader)' : 'var(--border)'}`,
            }}
          >
            <Trophy className="w-3 h-3" /> Knockout
          </button>
        </div>
      </div>

      {/* ── Match Cards ── */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <Users className="w-8 h-8" style={{ color: 'var(--white-ghost)' }} />
          <p className="text-sm" style={{ color: 'var(--white-muted)' }}>
            No matches found for this filter
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateKey, dateMatches]) => (
            <div key={dateKey}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{
                  color: 'var(--white-ghost)',
                }}>
                  {formatLocalDate(dateMatches[0].kickoff_utc)}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-[10px] font-medium" style={{ color: 'var(--white-ghost)' }}>
                  {dateMatches.length} {dateMatches.length === 1 ? 'match' : 'matches'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dateMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => onMatchClick?.(match)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── MatchCard ──────────────────────────────────────────────────

function MatchCard({ match, onClick }: { match: WC2026Match; onClick: () => void }) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isUpcoming = match.status === 'upcoming';

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-3 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
      style={{
        background: isLive
          ? 'linear-gradient(135deg, rgba(0,230,118,0.08) 0%, var(--surface-1) 100%)'
          : 'var(--surface-1)',
        borderColor: isLive ? 'rgba(0,230,118,0.3)' : 'var(--border)',
        cursor: match.youtube_video_id ? 'pointer' : 'default',
      }}
      id={`match-${match.match_number}`}
    >
      {/* Top row: group/round + time + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {match.group_name ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{
              background: 'var(--surface-3)',
              color: 'var(--white-muted)',
            }}>
              Group {match.group_name}
            </span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{
              background: 'rgba(255,179,0,0.15)',
              color: 'var(--gold-leader)',
            }}>
              Knockout
            </span>
          )}
          <span className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>
            #{match.match_number}
          </span>
        </div>

        {/* Status badge */}
        {isLive && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{
            background: 'rgba(0,230,118,0.15)',
          }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{
              background: 'var(--green-live)',
              boxShadow: '0 0 6px var(--green-live)',
            }} />
            <span className="text-[10px] font-bold" style={{ color: 'var(--green-live)' }}>
              LIVE
            </span>
          </div>
        )}
        {isFinished && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{
            background: 'var(--surface-3)',
            color: 'var(--white-ghost)',
          }}>
            FT
          </span>
        )}
        {isUpcoming && (
          <span className="text-[10px] font-semibold" style={{ color: 'var(--gold-leader)' }}>
            {getCountdown(match.kickoff_utc)}
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold truncate" style={{
              color: isFinished && match.home_score !== null && match.away_score !== null
                ? (match.home_score > match.away_score ? 'var(--white-primary)' : 'var(--white-muted)')
                : 'var(--white-primary)',
            }}>
              {match.home_team}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate" style={{
              color: isFinished && match.home_score !== null && match.away_score !== null
                ? (match.away_score > match.home_score ? 'var(--white-primary)' : 'var(--white-muted)')
                : 'var(--white-primary)',
            }}>
              {match.away_team}
            </span>
          </div>
        </div>

        {/* Score */}
        {(isLive || isFinished) && match.home_score !== null && match.away_score !== null ? (
          <div className="flex flex-col items-center ml-3 px-3 py-1 rounded-lg" style={{
            background: isLive ? 'rgba(0,230,118,0.1)' : 'var(--surface-3)',
          }}>
            <span className="text-lg font-bold leading-tight" style={{
              color: isLive ? 'var(--green-live)' : 'var(--white-primary)',
              fontFamily: 'var(--font-display)',
            }}>
              {match.home_score}
            </span>
            <div className="w-3 h-px my-0.5" style={{ background: 'var(--border)' }} />
            <span className="text-lg font-bold leading-tight" style={{
              color: isLive ? 'var(--green-live)' : 'var(--white-primary)',
              fontFamily: 'var(--font-display)',
            }}>
              {match.away_score}
            </span>
          </div>
        ) : (
          <div className="ml-3 text-xs text-center" style={{ color: 'var(--white-ghost)' }}>
            <div>{formatLocalTime(match.kickoff_utc)}</div>
          </div>
        )}
      </div>

      {/* Venue */}
      <div className="mt-2 text-[10px] truncate" style={{ color: 'var(--white-ghost)' }}>
        📍 {match.venue}
      </div>
    </button>
  );
}
