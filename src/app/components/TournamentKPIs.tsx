import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Shield, Target, Timer } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { ErrorState } from './ui/ErrorState'
import { KPIChipSkeleton } from './ui/skeletons'

const ANIMATION_DURATION_MS = 1200

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frameId = 0
    let startTime = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1)
      const eased = easeOutCubic(progress)

      setValue(Math.round(target * eased))

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [target])

  return value
}

interface KPIValueCardProps {
  icon: typeof Target
  value: number
  label: string
  subtitle: string
  color: string
}

function KPIValueCard({ icon: Icon, value, label, subtitle, color }: KPIValueCardProps) {
  const animatedValue = useAnimatedNumber(value)

  return (
    <div
      className="rounded p-5 border transition-all duration-200 hover:border-border-active"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div
        className="text-4xl"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--white-primary)',
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {animatedValue}
      </div>
      <div className="mt-2 text-xs" style={{ color: 'var(--white-muted)' }}>
        {label}
      </div>
      <div className="mt-1 text-xs" style={{ color: 'var(--white-ghost)' }}>
        {subtitle}
      </div>
    </div>
  )
}

export function TournamentKPIs() {
  const { data, isLoading, isError, error, refetch } = useDashboard()

  const kpis = useMemo(() => {
    const values = data?.kpis
    if (!values) return []

    return [
      {
        icon: Target,
        value: values.totalGoals,
        label: 'Goals Scored',
        subtitle: `${values.goalsPerMatch.toFixed(1)} per match avg`,
        color: 'var(--green-live)',
      },
      {
        icon: Timer,
        value: values.matchesPlayed,
        label: 'Matches Played',
        subtitle: `${values.totalMatches} total scheduled`,
        color: 'var(--gold-leader)',
      },
      {
        icon: Shield,
        value: values.cleanSheets,
        label: 'Clean Sheets',
        subtitle: 'Tournament defensive record',
        color: 'var(--blue-ref)',
      },
      {
        icon: AlertCircle,
        value: values.redCards,
        label: 'Red Cards',
        subtitle: `${values.yellowCards} yellow cards`,
        color: 'var(--red-loss)',
      },
    ]
  }, [data])

  if (isLoading) {
    return (
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <KPIChipSkeleton key={idx} />
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((kpi) => (
          <KPIValueCard key={kpi.label} {...kpi} />
        ))}
      </div>
    </section>
  )
}
