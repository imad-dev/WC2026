import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useDashboard } from '@/hooks/useDashboard'
import { useLiveMatches } from '@/hooks/useLiveMatches'
import { ErrorState } from './ui/ErrorState'
import { HeroSkeleton } from './ui/skeletons'

const ANIMATION_DURATION_MS = 1200

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function useAnimatedScore(target: number) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frameId = 0
    let startTime = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1)
      setValue(Math.round(target * easeOutCubic(progress)))

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [target])

  return value
}

function buildCountdown(date: string) {
  const now = dayjs()
  const target = dayjs(date)
  const diffSeconds = Math.max(0, target.diff(now, 'second'))
  const hours = Math.floor(diffSeconds / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)
  const seconds = diffSeconds % 60

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
}

export function Hero() {
  const liveQuery = useLiveMatches()
  const dashboardQuery = useDashboard()

  const featuredMatch =
    liveQuery.data?.find((match) => match.status === 'LIVE')
    ?? dashboardQuery.data?.upcomingMatches[0]
    ?? dashboardQuery.data?.recentMatches[0]

  const homeScore = useAnimatedScore(featuredMatch?.homeScore ?? 0)
  const awayScore = useAnimatedScore(featuredMatch?.awayScore ?? 0)

  if (liveQuery.isLoading || dashboardQuery.isLoading) {
    return <HeroSkeleton />
  }

  if (liveQuery.isError && dashboardQuery.isError) {
    const message = (liveQuery.error as Error | undefined)?.message || (dashboardQuery.error as Error | undefined)?.message
    return <ErrorState message={message} onRetry={() => void Promise.all([liveQuery.refetch(), dashboardQuery.refetch()])} />
  }

  if (!featuredMatch) {
    return <ErrorState message="No featured match available." onRetry={() => void dashboardQuery.refetch()} />
  }

  const isLive = featuredMatch.status === 'LIVE'

  return (
    <section
      className="relative overflow-hidden"
      style={{
        height: 'auto',
        minHeight: '500px',
        background: 'radial-gradient(circle at center, transparent 0%, var(--void) 100%)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0A0E1A 0%, #121828 50%, #0A0E1A 100%)',
          opacity: 0.8,
        }}
      />

      <div className="relative h-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div className="flex items-center gap-2">
            <div className="live-dot w-2 h-2 rounded-full" style={{ background: isLive ? 'var(--green-live)' : 'var(--white-muted)' }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: isLive ? 'var(--green-live)' : 'var(--white-muted)', letterSpacing: '0.08em' }}
            >
              {isLive ? `LIVE — ${featuredMatch.minute ?? 0}'` : featuredMatch.status}
            </span>
          </div>

          <div
            className="text-xs uppercase tracking-wider"
            style={{ color: 'var(--white-muted)', letterSpacing: '0.08em' }}
          >
            {featuredMatch.phase}
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm border" style={{ borderColor: 'var(--border)' }}>
                {featuredMatch.homeTeam.code}
              </div>
              <div
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase flex-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--white-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {featuredMatch.homeTeam.name}
              </div>
              <div
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--green-live)',
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                {homeScore}
              </div>
            </div>

            <div className="h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

            <div className="flex items-center gap-3 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm border" style={{ borderColor: 'var(--border)' }}>
                {featuredMatch.awayTeam.code}
              </div>
              <div
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase flex-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--white-muted)',
                  letterSpacing: '-0.02em',
                }}
              >
                {featuredMatch.awayTeam.name}
              </div>
              <div
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--white-muted)',
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                {awayScore}
              </div>
            </div>
          </div>

          <div className="text-sm" style={{ color: 'var(--white-muted)' }}>
            {featuredMatch.stats
              ? `${featuredMatch.stats.homePossession}% possession · ${featuredMatch.stats.homeShotsOnTarget}-${featuredMatch.stats.awayShotsOnTarget} shots on target`
              : `Kickoff: ${dayjs(featuredMatch.date).format('DD MMM YYYY HH:mm')}`}
          </div>

          {!isLive && (
            <div className="text-xs" style={{ color: 'var(--green-live)' }}>
              Starts in {buildCountdown(featuredMatch.date)}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--white-muted)', letterSpacing: '0.08em' }}>
            TODAY'S FIXTURES
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {(dashboardQuery.data?.upcomingMatches ?? []).slice(0, 5).map((match) => (
              <div
                key={match.id}
                className="rounded p-4 border transition-all duration-200 hover:border-border-active hover:bg-surface-3"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm" style={{ color: 'var(--white-primary)' }}>
                      {match.homeTeam.code}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--white-muted)', fontFeatureSettings: '"tnum" 1' }}>
                    {dayjs(match.date).format('HH:mm')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm" style={{ color: 'var(--white-primary)' }}>
                      {match.awayTeam.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                    {match.stadium}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold uppercase"
                    style={{
                      background: 'var(--surface-3)',
                      color: 'var(--white-muted)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {match.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .live-dot {
          animation: livePulse 1.2s ease-in-out infinite;
        }

        @keyframes livePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  )
}
