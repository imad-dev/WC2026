import { useTodayMatches } from '../../hooks/useFootballData';
import { RefreshCw } from 'lucide-react';

export function LiveScoresWidget() {
  const { matches, loading, refetch } = useTodayMatches();

  const live = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const finished = matches.filter(m => m.status === 'FINISHED').slice(0, 6);
  const upcoming = matches.filter(m => ['SCHEDULED', 'TIMED'].includes(m.status)).slice(0, 4);

  return (
    <div className="rounded-xl border p-4" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {live.length > 0 && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />}
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--white-primary)', letterSpacing: '0.06em' }}>
            {live.length > 0 ? `${live.length} Live` : "Today's Matches"}
          </h3>
        </div>
        <button onClick={refetch} className="p-1 rounded hover:opacity-70 transition-opacity" title="Refresh">
          <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--white-ghost)' }} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 rounded animate-pulse" style={{ background: 'var(--surface-2)' }} />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {live.map(match => (
            <div key={match.id} className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: 'rgba(0,230,118,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--green-live)' }} />
              <div className="flex-1 text-xs flex items-center gap-1.5">
                <span className="font-semibold" style={{ color: 'var(--white-primary)' }}>{match.homeTeam.tla}</span>
                <span className="font-bold" style={{ color: 'var(--green-live)', fontFamily: 'var(--font-display)' }}>
                  {match.homeTeam.score ?? 0}–{match.awayTeam.score ?? 0}
                </span>
                <span className="font-semibold" style={{ color: 'var(--white-primary)' }}>{match.awayTeam.tla}</span>
              </div>
            </div>
          ))}

          {finished.map(match => (
            <div key={match.id} className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex-1 text-xs flex items-center gap-1.5">
                <span style={{ color: match.winner === 'HOME_TEAM' ? 'var(--white-primary)' : 'var(--white-ghost)' }}>{match.homeTeam.tla}</span>
                <span className="font-semibold tabular-nums" style={{ color: 'var(--white-muted)', fontFamily: 'var(--font-display)' }}>
                  {match.homeTeam.score}–{match.awayTeam.score}
                </span>
                <span style={{ color: match.winner === 'AWAY_TEAM' ? 'var(--white-primary)' : 'var(--white-ghost)' }}>{match.awayTeam.tla}</span>
              </div>
              {match.homeTeam.crest && (
                <img src={match.homeTeam.crest} alt="" className="w-4 h-4 object-contain" />
              )}
              <span className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>FT</span>
            </div>
          ))}

          {upcoming.map(match => (
            <div key={match.id} className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex-1 text-xs flex items-center gap-1.5">
                <span style={{ color: 'var(--white-muted)' }}>{match.homeTeam.tla}</span>
                <span className="font-semibold" style={{ color: 'var(--gold-leader)', fontFamily: 'var(--font-display)' }}>vs</span>
                <span style={{ color: 'var(--white-muted)' }}>{match.awayTeam.tla}</span>
              </div>
              <span className="text-[10px] tabular-nums" style={{ color: 'var(--gold-leader)' }}>{match.timeFormatted}</span>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="text-center py-4 text-xs" style={{ color: 'var(--white-ghost)' }}>No matches today</div>
          )}
        </div>
      )}
    </div>
  );
}
