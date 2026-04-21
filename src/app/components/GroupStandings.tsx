import { useGroupStandings } from '@/hooks/useGroupStandings'
import { useUIStore } from '@/store/uiStore'
import { ErrorState } from './ui/ErrorState'
import { StandingsSkeleton } from './ui/skeletons'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export function GroupStandings() {
  const activeGroup = useUIStore((state) => state.activeGroup)
  const setActiveGroup = useUIStore((state) => state.setActiveGroup)
  const { data, isLoading, isError, error, refetch } = useGroupStandings(activeGroup)

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
            Group Stage Standings
          </h2>
        </div>
        <StandingsSkeleton />
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
          Group Stage Standings
        </h2>
      </div>

      {/* Group Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {GROUPS.map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase transition-all duration-200"
            style={{
              background: activeGroup === group ? 'var(--green-live)' : 'transparent',
              color: activeGroup === group ? 'var(--void)' : 'var(--white-muted)',
              border: activeGroup === group ? 'none' : `1px solid var(--border)`,
              letterSpacing: '0.06em',
            }}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded overflow-hidden border overflow-x-auto" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr
              className="border-b text-left"
              style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}
            >
              <th className="px-4 py-3 text-xs uppercase font-medium" style={{ letterSpacing: '0.08em' }}>#</th>
              <th className="px-4 py-3 text-xs uppercase font-medium" style={{ letterSpacing: '0.08em' }}>Team</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>MP</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>W</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>D</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>L</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>GF</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>GA</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>GD</th>
              <th className="px-4 py-3 text-xs uppercase font-medium text-center" style={{ letterSpacing: '0.08em' }}>PTS</th>
              <th className="px-4 py-3 text-xs uppercase font-medium" style={{ letterSpacing: '0.08em' }}>Form</th>
            </tr>
          </thead>
          <tbody>
            {data.standings.map((team, index) => (
              <tr
                key={team.team.id}
                className="border-b transition-all duration-200 hover:bg-surface-3"
                style={{
                  borderColor: 'var(--border)',
                  background: team.position <= 2 ? 'rgba(0, 230, 118, 0.03)' : 'transparent',
                  borderLeft: team.position <= 2 ? '2px solid var(--green-live)' : 'none',
                  animation: 'standingsEnter 300ms ease both',
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--white-muted)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.position}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--white-muted)' }}>
                        {team.team.code}
                      </span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                      {team.team.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.played}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.won}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.drawn}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.lost}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.goalsFor}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.goalsAgainst}
                </td>
                <td className="px-4 py-3 text-center text-sm font-semibold" style={{ color: team.goalDifference > 0 ? 'var(--green-live)' : team.goalDifference < 0 ? 'var(--red-loss)' : 'var(--white-muted)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                </td>
                <td className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.points}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {team.form.map((result, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-semibold"
                        style={{
                          background: result === 'W' ? 'var(--green-live)' : result === 'D' ? 'var(--amber-draw)' : 'var(--red-loss)',
                          color: 'var(--void)',
                        }}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes standingsEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
