import type { WC2026Match } from '../../lib/supabaseClient';
import { getFlagCode } from '../../lib/countryCodes';
import { PredictionWidget } from '@/app/components/wc2026/PredictionWidget';

function formatLocalTime(dateStr: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(dateStr));
}

function formatLocalDate(dateStr: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

export function MatchCard({ match, onClick }: { match: WC2026Match; onClick?: () => void }) {
  const isLive = match.status === 'live';
  const flagA = getFlagCode(match.home_team);
  const flagB = getFlagCode(match.away_team);

  return (
    <div 
      onClick={onClick}
      className="flex flex-col rounded-xl border cursor-pointer group transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_0_0_1px_var(--wc-green),0_8px_32px_rgba(0,166,81,0.12)] overflow-hidden"
      style={{ background: 'var(--wc-surface)', borderColor: 'var(--wc-border)' }}
    >
      {/* Header strip */}
      <div
        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.08em] sm:tracking-[0.12em] uppercase border-b flex-wrap"
        style={{ background: 'var(--wc-surface-2)', borderColor: 'var(--wc-border)' }}
      >
        {match.group_name ? (
          <span className="text-[var(--wc-gold)]">Group {match.group_name}</span>
        ) : (
          <span className="text-[var(--wc-gold)]">Knockout</span>
        )}
        <span className="text-[var(--wc-text-muted)] opacity-40">·</span>
        <span className="text-[var(--wc-text-muted)]">{formatLocalDate(match.kickoff_utc)}</span>
        <span className="text-[var(--wc-text-muted)] opacity-40">·</span>
        <span className="text-[var(--wc-text-muted)]">{formatLocalTime(match.kickoff_utc)}</span>
      </div>

      {/* Main Match Info */}
      <div className="flex w-full items-center justify-between gap-1 sm:gap-2 px-3 sm:px-5 py-4 sm:py-6">
        
        {/* Team A */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          {flagA !== 'xx' ? (
            <img
              src={`https://flagcdn.com/48x36/${flagA}.png`}
              alt={match.home_team}
              className="w-10 h-[30px] sm:w-[48px] sm:h-[36px] rounded shadow-md"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-[30px] sm:w-[48px] sm:h-[36px] rounded shadow-md bg-[var(--wc-surface-2)] border border-[var(--wc-border)] flex items-center justify-center text-[var(--wc-text-muted)] text-[8px]">
              ?
            </div>
          )}
          <span
            className="mt-2 text-center text-white truncate w-full"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem, 2vw, 1.5rem)', letterSpacing: '0.02em', lineHeight: 1.1 }}
          >
            {match.home_team}
          </span>
        </div>

        {/* Score or VS */}
        <div className="flex flex-col items-center px-1 sm:px-3 shrink-0">
          {(match.status === 'live' || match.status === 'finished') && match.home_score !== null ? (
            <div
              className="flex items-center gap-1.5 sm:gap-3 text-white leading-none"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
            >
              <span>{match.home_score}</span>
              <span className="text-[var(--wc-text-muted)] opacity-40" style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}>—</span>
              <span>{match.away_score}</span>
            </div>
          ) : (
            <div
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold tracking-widest text-[var(--wc-text-muted)]"
              style={{ background: 'var(--wc-surface-2)' }}
            >
              VS
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          {flagB !== 'xx' ? (
            <img
              src={`https://flagcdn.com/48x36/${flagB}.png`}
              alt={match.away_team}
              className="w-10 h-[30px] sm:w-[48px] sm:h-[36px] rounded shadow-md"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-[30px] sm:w-[48px] sm:h-[36px] rounded shadow-md bg-[var(--wc-surface-2)] border border-[var(--wc-border)] flex items-center justify-center text-[var(--wc-text-muted)] text-[8px]">
              ?
            </div>
          )}
          <span
            className="mt-2 text-center text-white truncate w-full"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem, 2vw, 1.5rem)', letterSpacing: '0.02em', lineHeight: 1.1 }}
          >
            {match.away_team}
          </span>
        </div>
      </div>

      {/* Venue + Live badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 px-3 sm:px-5 pb-3 sm:pb-4">
        {isLive && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--wc-live)] shadow-[0_0_6px_var(--wc-live)] animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest text-[var(--wc-live)]">LIVE</span>
          </div>
        )}
        <div className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wide text-[var(--wc-text-muted)] truncate max-w-[200px]" style={{ background: 'var(--wc-surface-2)' }}>
          📍 {match.venue}
        </div>
      </div>

      {/* Predictor */}
      <div className="px-3 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 border-t border-[var(--wc-border)]" onClick={(e) => e.stopPropagation()}>
        <PredictionWidget 
          matchId={String(match.id)} 
          teamA={match.home_team} 
          teamB={match.away_team} 
        />
      </div>
    </div>
  );
}
