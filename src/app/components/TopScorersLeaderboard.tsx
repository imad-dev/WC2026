import { useTopScorers } from '@/hooks/useTopScorers'
import { ErrorState } from './ui/ErrorState'
import { ScorerRowSkeleton } from './ui/skeletons'

export function TopScorersLeaderboard() {
  const { data, isLoading, isError, error, refetch } = useTopScorers()

  if (isLoading) {
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

        <div className="rounded overflow-hidden border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <ScorerRowSkeleton key={idx} />
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data) {
    return <ErrorState message={(error as Error | undefined)?.message} onRetry={() => void refetch()} />
  }

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

      <div className="rounded overflow-hidden border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
        {data.map((scorer, index) => {
          const isTop = index === 0
          return (
            <div
              key={scorer.player.id}
              className="flex items-center gap-3 md:gap-6 px-3 md:px-6 py-3 md:py-4 border-b transition-all duration-200 hover:bg-surface-3 relative overflow-hidden"
              style={{
                borderColor: isTop ? 'var(--gold-leader)' : 'var(--border)',
                background: isTop
                  ? 'linear-gradient(90deg, rgba(255, 179, 0, 0.12) 0%, rgba(255, 179, 0, 0.06) 50%, rgba(255, 179, 0, 0.12) 100%)'
                  : 'transparent',
                borderLeft: isTop ? '3px solid var(--gold-leader)' : 'none',
              }}
            >
              <div className="w-16 flex flex-col items-center relative">
                <div
                  className="relative"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: isTop ? '48px' : index < 3 ? '32px' : '24px',
                    fontWeight: 800,
                    color: isTop ? 'var(--gold-leader)' : index < 3 ? 'var(--gold-dim)' : 'var(--white-ghost)',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {index + 1}
                </div>
              </div>

              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border text-xs"
                  style={{
                    background: isTop ? 'linear-gradient(135deg, rgba(255, 179, 0, 0.2), var(--surface-2))' : 'var(--surface-2)',
                    borderColor: isTop ? 'var(--gold-leader)' : 'var(--border)',
                  }}
                >
                  {scorer.team.code}
                </div>
              </div>

              <div className="flex-1">
                <div
                  className="text-sm font-semibold flex items-center gap-2"
                  style={{
                    color: isTop ? 'var(--gold-leader)' : 'var(--white-primary)',
                    fontSize: isTop ? '16px' : '14px',
                  }}
                >
                  {scorer.player.name}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--white-muted)' }}>
                  {scorer.team.name}
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8 text-center">
                <div>
                  <div
                    className="font-bold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isTop ? '32px' : '24px',
                      color: isTop ? 'var(--gold-leader)' : 'var(--white-primary)',
                      fontFeatureSettings: '"tnum" 1',
                    }}
                  >
                    {scorer.goals}
                  </div>
                  <div className="text-xs" style={{ color: isTop ? 'var(--gold-dim)' : 'var(--white-ghost)' }}>
                    Goals
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isTop ? '24px' : '20px',
                      color: isTop ? 'var(--gold-dim)' : 'var(--white-muted)',
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
                  <div className="text-sm" style={{ color: 'var(--white-ghost)', fontFeatureSettings: '"tnum" 1' }}>
                    {scorer.matchesPlayed}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                    Matches
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
