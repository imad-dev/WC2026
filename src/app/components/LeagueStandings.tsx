import { useLeagueStandings } from '../../hooks/useFootballData';
import { COMPETITIONS, type CompetitionCode } from '../../services/api';

interface LeagueStandingsProps {
  competition: CompetitionCode;
}

export function LeagueStandings({ competition }: LeagueStandingsProps) {
  const { standings, loading, error } = useLeagueStandings(competition);
  const comp = COMPETITIONS[competition];

  return (
    <section id={`standings-${competition.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-semibold uppercase flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', color: 'var(--white-primary)' }}
        >
          <span>{comp?.flag}</span>
          <span>{comp?.name} Standings</span>
        </h2>
        <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>2025/26</span>
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded animate-pulse" style={{ background: 'var(--surface-2)', opacity: 1 - i * 0.12 }} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-8 rounded-lg border text-sm" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', color: 'var(--white-muted)' }}>
          ⚠️ Could not load standings
        </div>
      )}

      {!loading && standings.length > 0 && (
        <div className="rounded-lg border overflow-hidden overflow-x-auto" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['#', 'Club', 'MP', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'PTS', 'Form'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-xs font-semibold uppercase text-left"
                    style={{ color: 'var(--white-ghost)', letterSpacing: '0.06em', textAlign: (h === '#' || h === 'Club') ? 'left' : 'center' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => {
                const isTop = team.position <= 4;
                const isRel = team.position > standings.length - 3;
                return (
                  <tr
                    key={team.team}
                    className="border-b transition-colors duration-150 hover:bg-surface-2"
                    style={{
                      borderColor: 'var(--border)',
                      borderLeft: isTop
                        ? `3px solid ${comp?.color || 'var(--green-live)'}`
                        : isRel ? '3px solid var(--red-loss)'
                        : '3px solid transparent',
                    }}
                  >
                    <td className="px-3 py-2.5 text-sm tabular-nums" style={{ color: 'var(--white-muted)' }}>{team.position}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>{team.team}</span>
                    </td>
                    {[team.playedGames, team.won, team.draw, team.lost, team.goalsFor, team.goalsAgainst].map((val, i) => (
                      <td key={i} className="px-3 py-2.5 text-center text-sm tabular-nums" style={{ color: 'var(--white-primary)' }}>{val}</td>
                    ))}
                    <td className="px-3 py-2.5 text-center text-sm font-semibold tabular-nums"
                      style={{ color: team.goalDifference > 0 ? 'var(--green-live)' : team.goalDifference < 0 ? 'var(--red-loss)' : 'var(--white-muted)' }}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm font-bold tabular-nums" style={{ color: 'var(--white-primary)' }}>{team.points}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-0.5 justify-end">
                        {team.form.slice(0, 5).map((r, i) => (
                          <div key={i} className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold"
                            style={{
                              background: r === 'W' ? 'var(--green-live)' : r === 'D' ? 'var(--amber-draw)' : 'var(--red-loss)',
                              color: 'var(--void)',
                            }}>
                            {r}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
