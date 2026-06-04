import { useMemo } from 'react';
import { useMatches, useWCStandings } from '../../../hooks/useSupabase';
import type { WC2026Match } from '../../../lib/supabaseClient';
import { BarChart3, Loader2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────

interface TeamStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

interface GroupData {
  name: string;
  standings: TeamStanding[];
}

// ── Calculations ───────────────────────────────────────────────

function calculateGroupStandings(matches: WC2026Match[]): GroupData[] {
  // Collect all groups
  const groupTeams: Record<string, Set<string>> = {};
  const groupMatches: Record<string, WC2026Match[]> = {};

  matches.forEach((m) => {
    if (!m.group_name) return;
    if (!groupTeams[m.group_name]) {
      groupTeams[m.group_name] = new Set();
      groupMatches[m.group_name] = [];
    }
    groupTeams[m.group_name].add(m.home_team);
    groupTeams[m.group_name].add(m.away_team);
    groupMatches[m.group_name].push(m);
  });

  // Sort groups alphabetically
  const sortedGroupNames = Object.keys(groupTeams).sort();

  return sortedGroupNames.map((groupName) => {
    const teams = Array.from(groupTeams[groupName]);
    const stats: Record<string, TeamStanding> = {};

    teams.forEach((team) => {
      stats[team] = { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });

    // Process finished matches
    (groupMatches[groupName] || []).forEach((m) => {
      if (m.status !== 'finished' || m.home_score === null || m.away_score === null) return;

      const home = stats[m.home_team];
      const away = stats[m.away_team];
      if (!home || !away) return;

      home.played++;
      away.played++;
      home.gf += m.home_score;
      home.ga += m.away_score;
      away.gf += m.away_score;
      away.ga += m.home_score;

      if (m.home_score > m.away_score) {
        home.won++;
        home.pts += 3;
        away.lost++;
      } else if (m.home_score < m.away_score) {
        away.won++;
        away.pts += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.pts += 1;
        away.pts += 1;
      }
    });

    // Update GD and sort
    Object.values(stats).forEach((s) => {
      s.gd = s.gf - s.ga;
    });

    const standings = Object.values(stats).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.localeCompare(b.team);
    });

    return { name: groupName, standings };
  });
}

// ── Component ──────────────────────────────────────────────────

export function GroupStandings() {
  const { matches, loading: matchesLoading } = useMatches();
  const { standings: liveStandings, loading: standingsLoading } = useWCStandings();

  // Prefer live standings from football-data.org (via wc_standings table),
  // fall back to locally computed standings from match results seed data.
  const useLive = liveStandings.length > 0;

  const localGroups = useMemo(() =>
    useLive ? [] : calculateGroupStandings(matches),
    [matches, useLive]
  );

  // Build GroupData from live Supabase data
  const liveGroups: GroupData[] = useMemo(() => {
    if (!useLive) return [];
    const map: Record<string, TeamStanding[]> = {};
    for (const row of liveStandings) {
      const g = row.group_name ?? 'KO';
      if (!map[g]) map[g] = [];
      map[g].push({
        team: row.team,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        gf: row.goals_for,
        ga: row.goals_against,
        gd: row.goal_diff,
        pts: row.points,
      });
    }
    return Object.keys(map).sort().map(name => ({
      name,
      standings: map[name].sort((a, b) =>
        b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
      ),
    }));
  }, [liveStandings, useLive]);

  const groups = useLive ? liveGroups : localGroups;
  const loading = matchesLoading || standingsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--green-live)' }} />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--white-muted)' }}>No group data available yet</p>
      </div>
    );
  }

  return (
    <section id="group-standings">
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5" style={{ color: 'var(--green-live)' }} />
        <h2 className="text-xl font-bold uppercase" style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--white-primary)',
          letterSpacing: '-0.01em',
        }}>
          Group Standings
        </h2>
        {useLive && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{
            background: 'rgba(0,230,118,0.15)',
            color: 'var(--green-live)',
            border: '1px solid rgba(0,230,118,0.3)',
          }}>
            Live
          </span>
        )}
      </div>

      {/* ── Groups Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((group) => (
          <GroupTable key={group.name} group={group} />
        ))}
      </div>

      {/* ── Legend ── */}
      <div className="mt-6 flex flex-wrap gap-4 text-[11px]" style={{ color: 'var(--white-ghost)' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(0,230,118,0.25)' }} />
          Qualify automatically (top 2)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(255,179,0,0.25)' }} />
          Potential 3rd-place qualifier
        </div>
      </div>
    </section>
  );
}

// ── GroupTable ──────────────────────────────────────────────────

function GroupTable({ group }: { group: GroupData }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{
      background: 'var(--surface-1)',
      borderColor: 'var(--border)',
    }}>
      {/* Group header */}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{
        background: 'var(--surface-2)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span className="text-sm font-bold uppercase" style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--green-live)',
          letterSpacing: '0.04em',
        }}>
          Group {group.name}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th className="text-left py-2 pl-4 pr-2 font-semibold" style={{ color: 'var(--white-ghost)', width: '40%' }}>
                Team
              </th>
              <th className="text-center py-2 px-1 font-semibold" style={{ color: 'var(--white-ghost)' }}>P</th>
              <th className="text-center py-2 px-1 font-semibold" style={{ color: 'var(--white-ghost)' }}>W</th>
              <th className="text-center py-2 px-1 font-semibold" style={{ color: 'var(--white-ghost)' }}>D</th>
              <th className="text-center py-2 px-1 font-semibold" style={{ color: 'var(--white-ghost)' }}>L</th>
              <th className="text-center py-2 px-1 font-semibold hidden sm:table-cell" style={{ color: 'var(--white-ghost)' }}>GF</th>
              <th className="text-center py-2 px-1 font-semibold hidden sm:table-cell" style={{ color: 'var(--white-ghost)' }}>GA</th>
              <th className="text-center py-2 px-1 font-semibold" style={{ color: 'var(--white-ghost)' }}>GD</th>
              <th className="text-center py-2 px-1 pr-4 font-bold" style={{ color: 'var(--white-muted)' }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {group.standings.map((team, idx) => {
              // Top 2 qualify, 3rd has a chance
              const qualifyBg = idx < 2
                ? 'rgba(0,230,118,0.06)'
                : idx === 2
                  ? 'rgba(255,179,0,0.06)'
                  : 'transparent';
              const borderLeft = idx < 2
                ? '3px solid var(--green-live)'
                : idx === 2
                  ? '3px solid var(--gold-leader)'
                  : '3px solid transparent';

              return (
                <tr
                  key={team.team}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{
                    background: qualifyBg,
                    borderBottom: idx < group.standings.length - 1
                      ? '1px solid var(--border)'
                      : 'none',
                  }}
                >
                  <td className="py-2 pl-4 pr-2 font-semibold truncate" style={{
                    color: 'var(--white-primary)',
                    borderLeft,
                    maxWidth: '140px',
                  }}>
                    {team.team}
                  </td>
                  <td className="text-center py-2 px-1" style={{ color: 'var(--white-muted)' }}>{team.played}</td>
                  <td className="text-center py-2 px-1" style={{ color: 'var(--green-live)' }}>{team.won}</td>
                  <td className="text-center py-2 px-1" style={{ color: 'var(--amber-draw)' }}>{team.drawn}</td>
                  <td className="text-center py-2 px-1" style={{ color: 'var(--red-loss)' }}>{team.lost}</td>
                  <td className="text-center py-2 px-1 hidden sm:table-cell" style={{ color: 'var(--white-muted)' }}>{team.gf}</td>
                  <td className="text-center py-2 px-1 hidden sm:table-cell" style={{ color: 'var(--white-muted)' }}>{team.ga}</td>
                  <td className="text-center py-2 px-1 font-semibold" style={{
                    color: team.gd > 0 ? 'var(--green-live)' : team.gd < 0 ? 'var(--red-loss)' : 'var(--white-muted)',
                  }}>
                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                  </td>
                  <td className="text-center py-2 px-1 pr-4 font-bold" style={{
                    color: 'var(--white-primary)',
                    fontSize: '13px',
                  }}>
                    {team.pts}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
