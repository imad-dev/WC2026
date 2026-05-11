import { useEffect, useState } from 'react';
import { Activity, Calendar, RefreshCw } from 'lucide-react';
import { fetchWC2026LiveScores, fetchWC2026Fixtures } from '../../services/api';
import { WC2026_FIXTURES } from '../../data/wc2026Static';

interface MatchRow {
  id: string;
  home: string;
  homeFlag: string;
  away: string;
  awayFlag: string;
  homeScore?: number;
  awayScore?: number;
  status: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  time?: string;
  date?: string;
  group?: string;
}

function normalizeLiveRow(m: any): MatchRow {
  return {
    id: String(m.id ?? m.match_id ?? Math.random()),
    home: m.home_team?.name ?? m.homeTeam ?? '?',
    homeFlag: m.home_team?.flag ?? '',
    away: m.away_team?.name ?? m.awayTeam ?? '?',
    awayFlag: m.away_team?.flag ?? '',
    homeScore: m.home_score ?? m.homeScore,
    awayScore: m.away_score ?? m.awayScore,
    status: 'LIVE',
    time: m.match_time ?? m.minute ?? '',
    group: m.group ?? '',
  };
}

function normalizeFixtureRow(m: any): MatchRow {
  return {
    id: String(m.id ?? m.match_id ?? Math.random()),
    home: m.home_team?.name ?? m.home ?? '?',
    homeFlag: m.home_team?.flag ?? m.homeFlag ?? '',
    away: m.away_team?.name ?? m.away ?? '?',
    awayFlag: m.away_team?.flag ?? m.awayFlag ?? '',
    status: 'SCHEDULED',
    date: m.date ?? m.match_date,
    time: m.time ?? m.match_time ?? '',
    group: m.group ?? '',
  };
}

// Fall back to static data — next 6 upcoming matches from static list
function staticUpcoming(): MatchRow[] {
  const today = new Date().toISOString().split('T')[0];
  return WC2026_FIXTURES
    .filter(f => f.date >= today)
    .slice(0, 6)
    .map((f, i) => ({
      id: `static_${i}`,
      home: f.home,
      homeFlag: f.homeFlag,
      away: f.away,
      awayFlag: f.awayFlag,
      status: 'SCHEDULED' as const,
      date: f.date,
      time: f.time,
      group: f.group,
    }));
}

export function LiveScoresWidget() {
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiActive, setApiActive] = useState(false);

  async function refresh() {
    // 1. Try live scores first
    const live = await fetchWC2026LiveScores();
    if (live?.success && Array.isArray(live.data) && live.data.length > 0) {
      setMatches(live.data.map(normalizeLiveRow));
      setIsLive(true);
      setApiActive(true);
      setLastUpdated(new Date());
      setLoading(false);
      return;
    }
    setIsLive(false);

    // 2. Try fixtures API
    const today = new Date().toISOString().split('T')[0];
    const fixtures = await fetchWC2026Fixtures({ date: today });
    if (fixtures?.success && Array.isArray(fixtures.data) && fixtures.data.length > 0) {
      setMatches(fixtures.data.slice(0, 6).map(normalizeFixtureRow));
      setApiActive(true);
      setLastUpdated(new Date());
      setLoading(false);
      return;
    }

    // Try upcoming 7 days from fixtures API
    const upcoming = await fetchWC2026Fixtures({ page: '1' });
    if (upcoming?.success && Array.isArray(upcoming.data) && upcoming.data.length > 0) {
      setMatches(upcoming.data.slice(0, 6).map(normalizeFixtureRow));
      setApiActive(true);
      setLastUpdated(new Date());
      setLoading(false);
      return;
    }

    // 3. Fallback to static data
    setMatches(staticUpcoming());
    setApiActive(false);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // Poll every 30 s when live, every 5 min otherwise
    const interval = setInterval(refresh, isLive ? 30000 : 300000);
    return () => clearInterval(interval);
  }, [isLive]);

  const statusColor = isLive ? 'var(--red-loss)' : 'var(--green-live)';

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          {isLive
            ? <Activity className="w-4 h-4" style={{ color: statusColor }} />
            : <Calendar className="w-4 h-4" style={{ color: statusColor }} />}
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--white-primary)', letterSpacing: '0.07em' }}>
            {isLive ? 'Live Scores' : 'Upcoming Matches'}
          </span>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,61,87,0.15)', color: 'var(--red-loss)', border: '1px solid rgba(255,61,87,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--red-loss)' }} />
              LIVE
            </span>
          )}
        </div>
        <button onClick={refresh} title="Refresh" className="p-1 rounded hover:bg-surface-2 transition-colors">
          <RefreshCw className="w-3 h-3" style={{ color: 'var(--white-ghost)' }} />
        </button>
      </div>

      {/* Match list */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--green-live)', borderTopColor: 'transparent' }} />
          </div>
        )}
        {!loading && matches.length === 0 && (
          <div className="text-center py-8 text-xs" style={{ color: 'var(--white-ghost)' }}>
            No matches found
          </div>
        )}
        {matches.map((m) => (
          <div key={m.id} className="px-3 py-2.5">
            {/* Group + time/status */}
            <div className="flex items-center justify-between mb-1.5">
              {m.group && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-2)', color: 'var(--white-ghost)' }}>
                  Grp {m.group}
                </span>
              )}
              <span className="text-[10px] ml-auto" style={{ color: m.status === 'LIVE' ? 'var(--red-loss)' : 'var(--gold-leader)' }}>
                {m.status === 'LIVE' ? `${m.time}'` : m.date ? new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : m.time}
              </span>
            </div>
            {/* Teams + score */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 justify-end min-w-0">
                {m.homeFlag && <span className="text-base leading-none flex-shrink-0">{m.homeFlag}</span>}
                <span className="text-xs font-semibold truncate" style={{ color: 'var(--white-primary)' }}>{m.home}</span>
              </div>
              <div className="flex-shrink-0 w-14 text-center">
                {m.homeScore !== undefined ? (
                  <span className="text-sm font-extrabold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: m.status === 'LIVE' ? 'var(--red-loss)' : 'var(--white-primary)' }}>
                    {m.homeScore}–{m.awayScore}
                  </span>
                ) : (
                  <span className="text-xs font-medium" style={{ color: 'var(--white-ghost)' }}>vs</span>
                )}
              </div>
              <div className="flex-1 flex items-center gap-1.5 min-w-0">
                {m.awayFlag && <span className="text-base leading-none flex-shrink-0">{m.awayFlag}</span>}
                <span className="text-xs font-semibold truncate" style={{ color: 'var(--white-primary)' }}>{m.away}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <span className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>
          {apiActive ? 'WorldCup API' : 'Static schedule'}
        </span>
        {lastUpdated && (
          <span className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>
            Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
