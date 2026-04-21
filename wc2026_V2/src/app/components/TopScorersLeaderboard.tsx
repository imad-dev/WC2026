import { mockTopScorers } from '../../data/mockData';

interface TopScorersLeaderboardProps {
  scorers?: any[];
  loading?: boolean;
}

export function TopScorersLeaderboard({ scorers: apiScorers, loading }: TopScorersLeaderboardProps) {
  // Use API data if available, otherwise use mock data
  const scorers = apiScorers && apiScorers.length > 0 ? apiScorers : mockTopScorers;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-semibold uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            color: 'var(--white-primary)',
          }}
        >
          Top Scorers
        </h2>
        <span className="text-xs" style={{ color: 'var(--white-muted)' }}>
          (Goals + Assists)
        </span>
      </div>

      {loading && (
        <div className="text-center py-8" style={{ color: 'var(--white-muted)' }}>
          Loading top scorers...
        </div>
      )}

      {!loading && (
        <div className="rounded overflow-hidden border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          {scorers.map((scorer) => (
          <div
            key={scorer.rank}
            className="flex items-center gap-3 md:gap-6 px-3 md:px-6 py-3 md:py-4 border-b transition-all duration-200 hover:bg-surface-3 relative overflow-hidden"
            style={{
              borderColor: scorer.isTop ? 'var(--gold-leader)' : 'var(--border)',
              background: scorer.isTop
                ? 'linear-gradient(90deg, rgba(255, 179, 0, 0.12) 0%, rgba(255, 179, 0, 0.06) 50%, rgba(255, 179, 0, 0.12) 100%)'
                : 'transparent',
              borderLeft: scorer.isTop ? '3px solid var(--gold-leader)' : 'none',
              boxShadow: scorer.isTop ? '0 0 30px rgba(255, 179, 0, 0.15)' : 'none',
            }}
          >
            {/* Rank */}
            <div className="w-16 flex flex-col items-center relative">
              {scorer.rank === 1 && (
                <>
                  <div className="text-2xl mb-1 animate-pulse">👑</div>
                  <div
                    className="absolute -top-2 -left-2 -right-2 -bottom-2 opacity-20"
                    style={{
                      background: 'radial-gradient(circle, var(--gold-leader) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                    }}
                  />
                </>
              )}
              <div
                className="relative"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: scorer.rank === 1 ? '48px' : scorer.rank <= 3 ? '32px' : '24px',
                  fontWeight: 800,
                  color: scorer.rank === 1 ? 'var(--gold-leader)' : scorer.rank <= 3 ? 'var(--gold-dim)' : 'var(--white-ghost)',
                  fontFeatureSettings: '"tnum" 1',
                  textShadow: scorer.rank === 1 ? '0 0 20px rgba(255, 179, 0, 0.5)' : 'none',
                }}
              >
                {scorer.rank}
              </div>
            </div>

            {/* Player Photo */}
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border text-2xl"
                style={{
                  background: scorer.isTop ? 'linear-gradient(135deg, rgba(255, 179, 0, 0.2), var(--surface-2))' : 'var(--surface-2)',
                  borderColor: scorer.isTop ? 'var(--gold-leader)' : 'var(--border)',
                  boxShadow: scorer.isTop ? '0 0 15px rgba(255, 179, 0, 0.3)' : 'none',
                }}
              >
                {scorer.nationality}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs border"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: scorer.isTop ? 'var(--gold-leader)' : 'var(--border)',
                }}
              >
                {scorer.nationality}
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <div
                className="text-sm font-semibold flex items-center gap-2"
                style={{
                  color: scorer.isTop ? 'var(--gold-leader)' : 'var(--white-primary)',
                  fontSize: scorer.isTop ? '16px' : '14px',
                }}
              >
                {scorer.player}
                {scorer.isTop && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
                    style={{
                      background: 'var(--gold-leader)',
                      color: 'var(--void)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    LEADER
                  </span>
                )}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--white-muted)' }}>
                {scorer.team}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-8 text-center">
              <div>
                <div
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: scorer.isTop ? '32px' : '24px',
                    color: scorer.isTop ? 'var(--gold-leader)' : 'var(--white-primary)',
                    fontFeatureSettings: '"tnum" 1',
                    textShadow: scorer.isTop ? '0 0 15px rgba(255, 179, 0, 0.4)' : 'none',
                  }}
                >
                  {scorer.goals}
                </div>
                <div className="text-xs" style={{ color: scorer.isTop ? 'var(--gold-dim)' : 'var(--white-ghost)' }}>
                  Goals
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: scorer.isTop ? '24px' : '20px',
                    color: scorer.isTop ? 'var(--gold-dim)' : 'var(--white-muted)',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {scorer.assists}
                </div>
                <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                  Assists
                </div>
              </div>
              <div>
                <div
                  className="text-sm"
                  style={{
                    color: 'var(--white-ghost)',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {scorer.matches}
                </div>
                <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                  Matches
                </div>
              </div>
            </div>

            {/* Mini Bar Chart */}
            <div className="flex items-end gap-0.5 h-8">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-1.5 rounded-t"
                  style={{
                    height: `${Math.random() * 100}%`,
                    background: idx < 3 ? 'var(--green-live)' : 'var(--surface-3)',
                    opacity: idx < 3 ? 1 : 0.3,
                  }}
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
