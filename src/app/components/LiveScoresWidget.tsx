import { memo, useMemo } from 'react'
import { useLiveMatches } from '@/hooks/useLiveMatches'
import { ErrorState } from './ui/ErrorState'
import { MatchCardSkeleton } from './ui/skeletons'

interface LiveRowProps {
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  time: string
}

const LiveRow = memo(function LiveRow({ teamA, teamB, scoreA, scoreB, time }: LiveRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-l-2 pl-3" style={{ borderColor: 'var(--green-live)' }}>
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs mb-1">
          <span style={{ color: 'var(--white-primary)' }}>{teamA}</span>
          <span className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
            {scoreA}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'var(--white-primary)' }}>{teamB}</span>
          <span className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
            {scoreB}
          </span>
        </div>
      </div>
      <div className="ml-3 text-xs" style={{ color: 'var(--green-live)' }}>
        {time}
      </div>
    </div>
  )
})

export function LiveScoresWidget() {
  const { data, isLoading, isError, error, refetch } = useLiveMatches()

  const rows = useMemo(
    () =>
      (data ?? []).map((match) => ({
        id: match.id,
        teamA: match.homeTeam.code,
        teamB: match.awayTeam.code,
        scoreA: match.homeScore ?? 0,
        scoreB: match.awayScore ?? 0,
        time: match.minute ? `${match.minute}'` : match.status,
      })),
    [data]
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        <MatchCardSkeleton />
      </div>
    )
  }

  if (isError) {
    return <ErrorState message={(error as Error | undefined)?.message} onRetry={() => void refetch()} />
  }

  return (
    <div className="rounded border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />
          <span className="text-xs uppercase font-semibold" style={{ color: 'var(--white-primary)', letterSpacing: '0.08em' }}>
            LIVE
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--white-muted)' }}>
          {rows.length} Matches
        </span>
      </div>

      <div className="p-4 space-y-3">
        {rows.length === 0 && (
          <div className="text-sm" style={{ color: 'var(--white-muted)' }}>
            No live matches
          </div>
        )}

        {rows.map((row) => (
          <LiveRow key={row.id} {...row} />
        ))}
      </div>

      <div className="px-4 pb-3">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
          <div className="refresh-track h-full" style={{ background: 'var(--green-live)' }} />
        </div>
        <div className="text-xs mt-1 text-center" style={{ color: 'var(--white-ghost)' }}>
          Refresh in 30s
        </div>
      </div>

      <style>{`
        .refresh-track {
          animation: refreshProgress 30s linear infinite;
          width: 0%;
        }

        @keyframes refreshProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
