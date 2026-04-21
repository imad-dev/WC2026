import dayjs from 'dayjs'
import { useDashboard } from '@/hooks/useDashboard'
import { ErrorState } from './ui/ErrorState'
import { MatchCardSkeleton } from './ui/skeletons'

export function MatchResultsGrid() {
  const { data, isLoading, isError, error, refetch } = useDashboard()

  if (isLoading) {
    return (
      <section>
        <h2
          className="text-2xl font-semibold uppercase mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            color: 'var(--white-primary)',
          }}
        >
          Match Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MatchCardSkeleton key={index} />
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
      <h2
        className="text-2xl font-semibold uppercase mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
          color: 'var(--white-primary)',
        }}
      >
        Match Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.recentMatches.map((match) => (
          <div
            key={match.id}
            className="rounded border transition-all duration-200 hover:border-border-active overflow-hidden"
            style={{
              background: 'var(--surface-1)',
              borderColor: 'var(--border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
            >
              <span className="text-xs" style={{ color: 'var(--white-muted)' }}>
                {match.group ?? match.phase}
              </span>
              <span className="text-xs" style={{ color: 'var(--white-muted)' }}>
                {dayjs(match.date).format('MMM DD, YYYY')}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs border" style={{ borderColor: 'var(--border)' }}>
                    {match.homeTeam.code}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                      {match.homeTeam.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--white-muted)' }}>
                      {match.homeTeam.code}
                    </div>
                  </div>
                </div>
                <div
                  className="text-5xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: (match.homeScore ?? 0) > (match.awayScore ?? 0) ? 'var(--green-live)' : 'var(--white-muted)',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {match.homeScore ?? '-'}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs border" style={{ borderColor: 'var(--border)' }}>
                    {match.awayTeam.code}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                      {match.awayTeam.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--white-muted)' }}>
                      {match.awayTeam.code}
                    </div>
                  </div>
                </div>
                <div
                  className="text-5xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: (match.awayScore ?? 0) > (match.homeScore ?? 0) ? 'var(--green-live)' : 'var(--white-muted)',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {match.awayScore ?? '-'}
                </div>
              </div>

              {match.stats && (
                <div className="space-y-2 text-xs pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <div className="flex justify-between mb-1" style={{ color: 'var(--white-muted)' }}>
                      <span>Possession</span>
                      <span style={{ fontFeatureSettings: '"tnum" 1' }}>
                        {match.stats.homePossession}% - {match.stats.awayPossession}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                      <div className="h-full" style={{ width: `${match.stats.homePossession}%`, background: 'var(--green-live)' }} />
                    </div>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--white-muted)' }}>
                    <span>Shots</span>
                    <span style={{ fontFeatureSettings: '"tnum" 1' }}>
                      {match.stats.homeShots} - {match.stats.awayShots}
                    </span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--white-muted)' }}>
                    <span>Corners</span>
                    <span style={{ fontFeatureSettings: '"tnum" 1' }}>
                      {match.stats.homeCorners} - {match.stats.awayCorners}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
