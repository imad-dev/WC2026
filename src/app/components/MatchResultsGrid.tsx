import { useLeagueMatches } from '../../hooks/useFootballData';
import { COMPETITIONS, type CompetitionCode } from '../../services/api';

interface MatchResultsGridProps {
  competition: CompetitionCode;
}

export function MatchResultsGrid({ competition }: MatchResultsGridProps) {
  const { matches, loading } = useLeagueMatches(competition, 'FINISHED', 9);
  const comp = COMPETITIONS[competition];

  return (
    <section id={`matches-${competition.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-semibold uppercase flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', color: 'var(--white-primary)' }}
        >
          <span>{comp?.flag}</span>
          <span>Recent Results</span>
        </h2>
        <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>{comp?.name} · 2025/26</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {matches.slice(0, 9).map((match) => {
            const homeWon = match.winner === 'HOME_TEAM';
            const awayWon = match.winner === 'AWAY_TEAM';
            return (
              <div
                key={match.id}
                className="rounded-lg p-4 border transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
              >
                {/* Date + Round */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>{match.round}</span>
                  <span className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>{match.dateFormatted}</span>
                </div>

                {/* Home team */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: homeWon ? 'var(--white-primary)' : 'var(--white-muted)' }}>
                    {match.homeTeam.name}
                  </span>
                  <span
                    className="text-lg font-extrabold tabular-nums ml-2"
                    style={{ fontFamily: 'var(--font-display)', color: homeWon ? 'var(--green-live)' : 'var(--white-muted)' }}
                  >
                    {match.homeTeam.score ?? '–'}
                  </span>
                </div>

                {/* Away team */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: awayWon ? 'var(--white-primary)' : 'var(--white-muted)' }}>
                    {match.awayTeam.name}
                  </span>
                  <span
                    className="text-lg font-extrabold tabular-nums ml-2"
                    style={{ fontFamily: 'var(--font-display)', color: awayWon ? 'var(--green-live)' : 'var(--white-muted)' }}
                  >
                    {match.awayTeam.score ?? '–'}
                  </span>
                </div>

                {/* FT badge */}
                <div className="mt-2 text-right">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-3)', color: 'var(--white-ghost)' }}>FT</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 rounded-lg border text-sm" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', color: 'var(--white-muted)' }}>
          No match results available
        </div>
      )}
    </section>
  );
}
