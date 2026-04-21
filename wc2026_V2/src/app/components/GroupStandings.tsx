import { useState } from 'react';
import { mockGroupStandings } from '../../data/mockData';

interface GroupStandingsProps {
  activeGroup: string;
  standings?: any;
  loading?: boolean;
}

export function GroupStandings({ activeGroup, standings: apiStandings, loading }: GroupStandingsProps) {
  const [selectedGroup, setSelectedGroup] = useState(activeGroup);
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Use API data if available, otherwise use mock data
  const standings = Object.keys(apiStandings || {}).length > 0 ? apiStandings : mockGroupStandings;
  const currentStandings = standings[selectedGroup] || standings.F || mockGroupStandings.F;

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
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase transition-all duration-200"
            style={{
              background: selectedGroup === group ? 'var(--green-live)' : 'transparent',
              color: selectedGroup === group ? 'var(--void)' : 'var(--white-muted)',
              border: selectedGroup === group ? 'none' : `1px solid var(--border)`,
              letterSpacing: '0.06em',
            }}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8" style={{ color: 'var(--white-muted)' }}>
          Loading standings...
        </div>
      )}

      {/* Table */}
      {!loading && (
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
            {currentStandings.map((team) => (
              <tr
                key={team.pos}
                className="border-b transition-all duration-200 hover:bg-surface-3"
                style={{
                  borderColor: 'var(--border)',
                  background: team.qualified ? 'rgba(0, 230, 118, 0.03)' : 'transparent',
                  borderLeft: team.qualified ? '2px solid var(--green-live)' : team.pos > 2 && team.pos <= 4 ? '2px solid var(--red-loss)' : 'none',
                }}
              >
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--white-muted)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.pos}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-lg">{team.flag}</span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                      {team.team}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.mp}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.w}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.d}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.l}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.gf}
                </td>
                <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.ga}
                </td>
                <td className="px-4 py-3 text-center text-sm font-semibold" style={{ color: team.gd > 0 ? 'var(--green-live)' : team.gd < 0 ? 'var(--red-loss)' : 'var(--white-muted)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.gd > 0 ? '+' : ''}{team.gd}
                </td>
                <td className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}>
                  {team.pts}
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
      )}
    </section>
  );
}
