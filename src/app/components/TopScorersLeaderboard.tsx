import { useLeagueScorers } from '../../hooks/useFootballData';
import { COMPETITIONS, type CompetitionCode } from '../../services/api';
import { Trophy } from 'lucide-react';

interface TopScorersLeaderboardProps {
  competition: CompetitionCode;
}

export function TopScorersLeaderboard({ competition }: TopScorersLeaderboardProps) {
  const { scorers, loading } = useLeagueScorers(competition, 10);
  const comp = COMPETITIONS[competition];

  return (
    <section id={`scorers-${competition.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-semibold uppercase flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', color: 'var(--white-primary)' }}
        >
          <Trophy className="w-5 h-5" style={{ color: 'var(--gold-leader)' }} />
          Top Scorers
        </h2>
        <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>
          {comp?.flag} {comp?.name}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)', opacity: 1 - i * 0.1 }} />
          ))}
        </div>
      ) : scorers.length > 0 ? (
        <div
          className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          {scorers.map((scorer, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 px-4 py-3 border-b transition-colors duration-150 hover:bg-surface-2"
              style={{ borderColor: 'var(--border)' }}
            >
              {/* Rank */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: idx === 0 ? 'var(--gold-leader)' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--surface-3)',
                  color: idx < 3 ? 'var(--void)' : 'var(--white-muted)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {scorer.rank}
              </div>

              {/* Team crest */}
              {scorer.teamCrest ? (
                <img src={scorer.teamCrest} alt={scorer.team} className="w-6 h-6 object-contain flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: 'var(--surface-3)' }} />
              )}

              {/* Player info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate" style={{ color: 'var(--white-primary)' }}>
                    {scorer.player}
                  </span>
                  <span className="text-base leading-none flex-shrink-0">{scorer.nationality}</span>
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--white-ghost)' }}>
                  {scorer.team}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center">
                  <div
                    className="text-xl font-extrabold tabular-nums"
                    style={{ fontFamily: 'var(--font-display)', color: idx === 0 ? 'var(--gold-leader)' : 'var(--green-live)' }}
                  >
                    {scorer.goals}
                  </div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--white-ghost)' }}>Goals</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div
                    className="text-xl font-extrabold tabular-nums"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--blue-ref)' }}
                  >
                    {scorer.assists}
                  </div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--white-ghost)' }}>Ast</div>
                </div>
                <div className="text-center hidden md:block">
                  <div
                    className="text-xl font-extrabold tabular-nums"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--white-muted)' }}
                  >
                    {scorer.matches}
                  </div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--white-ghost)' }}>Apps</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-8 rounded-lg border text-sm"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', color: 'var(--white-muted)' }}
        >
          Top scorers data coming soon
        </div>
      )}
    </section>
  );
}
