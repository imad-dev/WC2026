'use client';

import { useMemo, useState } from 'react';
import { useMatches, useWCStandings } from '../../hooks/useSupabase';
import type { WC2026Match } from '../../lib/supabaseClient';
import { getFlagCode } from '../../lib/countryCodes';
import { ChevronDown, Loader2 } from 'lucide-react';


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

function calculateGroupStandings(matches: WC2026Match[]): GroupData[] {
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

  const sortedGroupNames = Object.keys(groupTeams).sort();

  return sortedGroupNames.map((groupName) => {
    const teams = Array.from(groupTeams[groupName]);
    const stats: Record<string, TeamStanding> = {};

    teams.forEach((team) => {
      stats[team] = { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });

    (groupMatches[groupName] || []).forEach((m) => {
      if (m.status !== 'finished' || m.home_score === null || m.away_score === null) return;
      const home = stats[m.home_team];
      const away = stats[m.away_team];
      if (!home || !away) return;

      home.played++; away.played++;
      home.gf += m.home_score; home.ga += m.away_score;
      away.gf += m.away_score; away.ga += m.home_score;

      if (m.home_score > m.away_score) {
        home.won++; home.pts += 3; away.lost++;
      } else if (m.home_score < m.away_score) {
        away.won++; away.pts += 3; home.lost++;
      } else {
        home.drawn++; away.drawn++; home.pts += 1; away.pts += 1;
      }
    });

    Object.values(stats).forEach((s) => { s.gd = s.gf - s.ga; });

    const standings = Object.values(stats).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.localeCompare(b.team);
    });

    return { name: groupName, standings };
  });
}

function GroupTable({ group }: { group: GroupData }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if pre-tournament
  const allZero = group.standings.every(t => t.pts === 0 && t.played === 0);
  const isPreTournament = allZero && new Date().getTime() < new Date('2026-06-11T00:00:00Z').getTime();

  return (
    <div className="flex flex-col bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl overflow-hidden transition-all duration-300">
      
      {/* Group Header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-5 py-3 border-b border-[var(--wc-border)] bg-[var(--wc-surface-2)] hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[var(--wc-gold)] rounded-full" />
          <span className="text-2xl text-[var(--wc-text)] tracking-wider" style={{ fontFamily: 'var(--font-display)', transform: 'translateY(2px)' }}>
            GROUP {group.name}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[var(--wc-text-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* Expandable Content */}
      <div 
        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden`}
        style={{ maxHeight: isExpanded ? '600px' : '0px' }}
      >
        <div className="overflow-x-auto p-4 pt-0">
          {isPreTournament && (
            <div className="mt-3 mb-2 px-3 py-2 rounded-md" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', color: 'var(--wc-gold)', fontSize: '12px' }}>
              ⏳ Matches begin Jun 11 — standings will update live
            </div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--wc-border)] bg-[var(--wc-dark)]">
                <th className="py-2 pl-4 text-left font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)]">Team</th>
                <th className="py-2 px-1 text-right font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)]" title="Played">P</th>
                <th className="py-2 px-1 text-right font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)]" title="Won">W</th>
                <th className="py-2 px-1 text-right font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)]" title="Drawn">D</th>
                <th className="py-2 px-1 text-right font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)]" title="Lost">L</th>
                <th className="py-2 px-1 text-right font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)] hidden sm:table-cell" title="Goals For">GF</th>
                <th className="py-2 px-1 text-right font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)] hidden sm:table-cell" title="Goals Against">GA</th>
                <th className="py-2 px-1 text-right font-semibold text-[10px] uppercase tracking-widest text-[var(--wc-text-muted)]" title="Goal Difference">GD</th>
                <th className="py-2 pr-4 pl-1 text-right font-bold text-[10px] uppercase tracking-widest text-white" title="Points">PTS</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {group.standings.map((team, idx) => {
                const isTop2 = idx < 2;
                // Assuming group stage played max is 3. If played 3 and not top 2, eliminated.
                const isEliminated = team.played === 3 && !isTop2;
                
                return (
                  <tr
                    key={team.team}
                    className={`border-b border-[var(--wc-border)] last:border-0 hover:bg-[rgba(255,255,255,0.04)] transition-colors ${isEliminated ? 'opacity-45' : ''}`}
                  >
                    <td className="py-3 pl-4 flex items-center gap-3">
                      {isTop2 ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--wc-green)] shadow-[0_0_5px_var(--wc-green)] shrink-0" />
                      ) : (
                        <div className="w-1.5 h-1.5 shrink-0" />
                      )}
                      <span className="text-[10px] text-[var(--wc-text-muted)] font-bold">{idx + 1}</span>
                      <img src={`https://flagcdn.com/48x36/${getFlagCode(team.team)}.png`} alt={team.team} className="w-6 h-4 rounded shadow-sm shrink-0" loading="lazy" />
                      <span className={`font-semibold truncate max-w-[100px] sm:max-w-none ${isEliminated ? 'line-through' : ''}`}>
                        {team.team}
                      </span>
                    </td>
                    <td className="py-3 px-1 text-right text-[var(--wc-text-muted)]">{team.played}</td>
                    <td className="py-3 px-1 text-right text-[var(--wc-text-muted)]">{isPreTournament ? '—' : team.won}</td>
                    <td className="py-3 px-1 text-right text-[var(--wc-text-muted)]">{isPreTournament ? '—' : team.drawn}</td>
                    <td className="py-3 px-1 text-right text-[var(--wc-text-muted)]">{isPreTournament ? '—' : team.lost}</td>
                    <td className="py-3 px-1 text-right text-[var(--wc-text-muted)] hidden sm:table-cell">{isPreTournament ? '—' : team.gf}</td>
                    <td className="py-3 px-1 text-right text-[var(--wc-text-muted)] hidden sm:table-cell">{isPreTournament ? '—' : team.ga}</td>
                    <td className="py-3 px-1 text-right" style={{ color: isPreTournament ? 'var(--wc-text-muted)' : team.gd > 0 ? 'var(--wc-green)' : team.gd < 0 ? 'var(--wc-red)' : 'var(--wc-text-muted)' }}>
                      {isPreTournament ? '—' : team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>
                    <td className="py-3 pr-4 pl-1 text-right font-bold text-white text-base">
                      {team.pts}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const DRAW_ORDER = [
  'Mexico', 'South Africa', 'South Korea', 'Czechia',
  'Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland',
  'Brazil', 'Morocco', 'Haiti', 'Scotland',
  'United States', 'Paraguay', 'Australia', 'Türkiye',
  'Germany', 'Curaçao', "Côte d'Ivoire", 'Ecuador',
  'Netherlands', 'Japan', 'Sweden', 'Tunisia',
  'Belgium', 'Egypt', 'Iran', 'New Zealand',
  'Spain', 'Cabo Verde', 'Saudi Arabia', 'Uruguay',
  'France', 'Senegal', 'Iraq', 'Norway',
  'Argentina', 'Algeria', 'Austria', 'Jordan',
  'Portugal', 'Congo DR', 'Uzbekistan', 'Colombia',
  'England', 'Croatia', 'Ghana', 'Panama'
];

export function StandingsTable({ initialGroupedTeams }: { initialGroupedTeams?: Record<string, any[]> }) {
  const { matches, loading: matchesLoading } = useMatches();
  const { standings: liveStandings, loading: standingsLoading } = useWCStandings();

  const useLive = liveStandings.length > 0;

  const localGroups = useMemo(() => {
    if (useLive) return [];
    if (initialGroupedTeams && Object.keys(initialGroupedTeams).length > 0) {
      return Object.keys(initialGroupedTeams).sort().map(name => {
        const sortedTeams = [...initialGroupedTeams[name]].sort((a, b) => {
          return DRAW_ORDER.indexOf(a.name) - DRAW_ORDER.indexOf(b.name);
        });
        
        return {
          name,
          standings: sortedTeams.map(team => ({
            team: team.name,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            pts: 0,
          }))
        };
      });
    }
    return calculateGroupStandings(matches).map(group => {
      return {
        ...group,
        standings: [...group.standings].sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          if (b.gf !== a.gf) return b.gf - a.gf;
          return DRAW_ORDER.indexOf(a.team) - DRAW_ORDER.indexOf(b.team);
        })
      };
    });
  }, [matches, useLive, initialGroupedTeams]);

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
        b.pts - a.pts || 
        b.gd - a.gd || 
        b.gf - a.gf || 
        (DRAW_ORDER.indexOf(a.team) - DRAW_ORDER.indexOf(b.team))
      ),
    }));
  }, [liveStandings, useLive]);

  const groups = useLive ? liveGroups : localGroups;
  const loading = matchesLoading || standingsLoading;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--wc-green)]" />
        <p className="text-[var(--wc-text-muted)] font-mono tracking-widest uppercase text-sm">Loading Standings...</p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-3 font-semibold">
            Tournament Standings
          </p>
          <h1 className="text-4xl md:text-5xl text-[var(--wc-text)] mb-2 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Group Standings
          </h1>
          <p className="text-[var(--wc-text-muted)] text-sm md:text-base">
            Top two teams from each group advance to the Round of 32.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {groups.map((group) => (
          <GroupTable key={group.name} group={group} />
        ))}
      </div>
    </section>
  );
}
