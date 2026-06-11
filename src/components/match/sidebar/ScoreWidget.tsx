import { getPlayerPhoto } from '@/lib/utils/playerPhoto';

export default function ScoreWidget({ match, events }: any) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  
  const homeScore = match.home_score || 0;
  const awayScore = match.away_score || 0;
  
  const homeTeam = match.home_team || {};
  const awayTeam = match.away_team || {};

  return (
    <div className="bg-[var(--wc-surface)] rounded-xl border border-[var(--wc-border)] overflow-hidden shadow-md">
      {/* Top Banner */}
      <div className="flex justify-between items-center px-4 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[var(--wc-border)] text-xs">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isLive ? 'text-[var(--wc-red)]' : 'text-[var(--wc-text-muted)]'}`}>
            {isLive ? 'LIVE' : isFinished ? 'FT' : 'UPCOMING'}
          </span>
          {isLive && match.minute && (
            <span className="flex items-center gap-1 text-[var(--wc-red)] font-bold">
              <span className="w-1.5 h-1.5 bg-[var(--wc-red)] rounded-full animate-pulse" />
              {match.minute}'
            </span>
          )}
        </div>
      </div>

      {/* Score Area */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex flex-col items-center gap-2 w-[80px]">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center p-1">
            {homeTeam.country_code ? (
              <img src={`https://flagcdn.com/48x36/${homeTeam.country_code}.png`} alt={homeTeam.name} className="w-full h-auto object-cover rounded-sm" />
            ) : (
              <span className="text-xl">🏠</span>
            )}
          </div>
          <span className="font-bold text-center text-sm">{homeTeam.short_name || homeTeam.name}</span>
        </div>

        <div className="flex flex-col items-center justify-center">
          {(isLive || isFinished) ? (
            <div className="text-4xl font-black font-display tracking-wider">
              {homeScore} <span className="text-[var(--wc-text-muted)] font-normal mx-1">-</span> {awayScore}
            </div>
          ) : (
            <div className="text-xl font-bold text-[var(--wc-text-muted)]">VS</div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 w-[80px]">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center p-1">
            {awayTeam.country_code ? (
              <img src={`https://flagcdn.com/48x36/${awayTeam.country_code}.png`} alt={awayTeam.name} className="w-full h-auto object-cover rounded-sm" />
            ) : (
              <span className="text-xl">✈️</span>
            )}
          </div>
          <span className="font-bold text-center text-sm">{awayTeam.short_name || awayTeam.name}</span>
        </div>
      </div>

      {/* Event Timeline snippet if goals exist */}
      {events && events.length > 0 && (
        <div className="px-4 py-3 bg-[rgba(0,0,0,0.2)] border-t border-[var(--wc-border)] text-xs space-y-2 max-h-[120px] overflow-y-auto hide-scrollbar">
          {events.filter((e: any) => e.event_type === 'goal').map((e: any) => (
            <div key={e.id} className={`flex items-center gap-2 ${e.team_id === (homeTeam.id || match.home_team_id) ? 'justify-start' : 'justify-end'}`}>
              {e.team_id === (homeTeam.id || match.home_team_id) && <span className="text-[10px]">⚽</span>}
              <span className="font-medium text-white">{e.player?.short_name || 'Player'}</span>
              <span className="text-[var(--wc-text-muted)]">{e.minute}'</span>
              {e.team_id === (awayTeam.id || match.away_team_id) && <span className="text-[10px]">⚽</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
