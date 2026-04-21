import { useState, useMemo } from 'react';
import { WC2026_FIXTURES, WC2026_KNOCKOUT, WC2026_GROUPS, TEAM_INFO } from '../../data/wc2026Static';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

type View = 'schedule' | 'groups' | 'teams';

interface WC2026ScheduleProps {
  forcedView?: View;
}

// Group fixtures by date
function groupByDate(fixtures: typeof WC2026_FIXTURES) {
  const map: Record<string, typeof WC2026_FIXTURES> = {};
  for (const f of fixtures) {
    if (!map[f.date]) map[f.date] = [];
    map[f.date].push(f);
  }
  return map;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'long',
  });
}

const GROUP_COLORS: Record<string, string> = {
  A:'#00E676',B:'#FFB300',C:'#448AFF',D:'#FF3D57',
  E:'#AB47BC',F:'#26C6DA',G:'#FF7043',H:'#66BB6A',
  I:'#FFA726',J:'#EC407A',K:'#26A69A',L:'#5C6BC0',
};

export function WC2026Schedule({ forcedView }: WC2026ScheduleProps = {}) {
  const [internalView, setInternalView] = useState<View>('schedule');
  const view = forcedView ?? internalView;
  const [filterGroup, setFilterGroup] = useState<string>('ALL');
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const filtered = filterGroup === 'ALL'
      ? WC2026_FIXTURES
      : WC2026_FIXTURES.filter(f => f.group === filterGroup);
    return groupByDate(filtered);
  }, [filterGroup]);

  const dates = Object.keys(byDate).sort();
  const today = new Date().toISOString().split('T')[0];

  // Find next match date
  const nextDate = dates.find(d => d >= today) || dates[0];

  const groups = Object.keys(WC2026_GROUPS);
  const teamKeys = Object.keys(TEAM_INFO);

  return (
    <div>
      {/* Header + view switcher — only shown when not driven by parent nav */}
      {!forcedView && (
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-semibold uppercase"
            style={{ fontFamily:'var(--font-display)', letterSpacing:'-0.02em', color:'var(--white-primary)' }}>
            WC 2026
          </h2>
          <div className="flex gap-2">
            {(['schedule','groups','teams'] as View[]).map(v => (
              <button key={v} onClick={() => setInternalView(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all"
                style={{
                  background: internalView === v ? 'var(--green-live)' : 'var(--surface-2)',
                  color: internalView === v ? 'var(--void)' : 'var(--white-muted)',
                  border: internalView === v ? 'none' : '1px solid var(--border)',
                  letterSpacing:'0.05em',
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── SCHEDULE VIEW ── */}
      {view === 'schedule' && (
        <>
          {/* Group filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['ALL', ...groups].map(g => (
              <button key={g} onClick={() => setFilterGroup(g)}
                className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                style={{
                  background: filterGroup === g ? (GROUP_COLORS[g] || 'var(--green-live)') : 'var(--surface-2)',
                  color: filterGroup === g ? 'var(--void)' : 'var(--white-muted)',
                  border: filterGroup === g ? 'none' : '1px solid var(--border)',
                }}>
                {g === 'ALL' ? 'All Groups' : `Group ${g}`}
              </button>
            ))}
          </div>

          {/* Match days */}
          <div className="space-y-3">
            {dates.map(date => {
              const isExpanded = expandedDate === date || date === nextDate;
              const isPast = date < today;
              const matches = byDate[date];
              return (
                <div key={date} className="rounded-lg border overflow-hidden"
                  style={{ background:'var(--surface-1)', borderColor:'var(--border)' }}>
                  {/* Date header */}
                  <button
                    onClick={() => setExpandedDate(isExpanded ? null : date)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold" style={{ color: isPast ? 'var(--white-ghost)' : 'var(--white-primary)' }}>
                        {formatDate(date)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background:'var(--surface-3)', color:'var(--white-ghost)' }}>
                        {matches.length} match{matches.length > 1 ? 'es' : ''}
                      </span>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4" style={{ color:'var(--white-ghost)' }} />
                      : <ChevronDown className="w-4 h-4" style={{ color:'var(--white-ghost)' }} />}
                  </button>

                  {/* Matches */}
                  {isExpanded && (
                    <div className="divide-y" style={{ borderColor:'var(--border)' }}>
                      {matches.map((m, i) => (
                        <div key={i} className="px-4 py-3 flex items-center gap-3">
                          {/* Group badge */}
                          <div className="w-12 flex-shrink-0 text-center">
                            <div className="text-[10px] font-bold px-1.5 py-0.5 rounded inline-block"
                              style={{ background: GROUP_COLORS[m.group] + '22', color: GROUP_COLORS[m.group], border:`1px solid ${GROUP_COLORS[m.group]}44` }}>
                              Grp {m.group}
                            </div>
                            <div className="text-[10px] mt-0.5" style={{ color:'var(--gold-leader)' }}>{m.time}</div>
                          </div>

                          {/* Home team */}
                          <div className="flex-1 flex items-center gap-2 justify-end">
                            <span className="text-sm font-semibold text-right" style={{ color:'var(--white-primary)' }}>{m.home}</span>
                            <span className="text-xl">{m.homeFlag}</span>
                          </div>

                          {/* Score / VS */}
                          <div className="w-12 text-center flex-shrink-0">
                            {m.homeScore !== undefined ? (
                              <span className="text-lg font-extrabold" style={{ fontFamily:'var(--font-display)', color:'var(--green-live)' }}>
                                {m.homeScore}–{m.awayScore}
                              </span>
                            ) : (
                              <span className="text-sm font-semibold" style={{ color:'var(--white-ghost)' }}>vs</span>
                            )}
                          </div>

                          {/* Away team */}
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-xl">{m.awayFlag}</span>
                            <span className="text-sm font-semibold" style={{ color:'var(--white-primary)' }}>{m.away}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Knockout rounds */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold uppercase mb-4"
              style={{ fontFamily:'var(--font-display)', color:'var(--white-muted)', letterSpacing:'-0.01em' }}>
              Knockout Stage
            </h3>
            <div className="space-y-2">
              {WC2026_KNOCKOUT.map(round => (
                <div key={round.round} className="rounded-lg border px-4 py-3 flex items-center justify-between"
                  style={{ background:'var(--surface-1)', borderColor:'var(--border)' }}>
                  <span className="text-sm font-semibold" style={{ color:'var(--white-primary)' }}>{round.round}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color:'var(--white-ghost)' }}>
                      {round.matches.length} match{round.matches.length > 1 ? 'es' : ''}
                    </span>
                    <span className="text-xs" style={{ color:'var(--gold-leader)' }}>
                      {new Date(round.matches[0].date + 'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                      {round.matches.length > 1 && ` – ${new Date(round.matches[round.matches.length-1].date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}`}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background:'var(--surface-3)', color:'var(--white-ghost)' }}>TBD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── GROUPS VIEW ── */}
      {view === 'groups' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {groups.map(g => (
            <div key={g} className="rounded-lg border p-3 transition-all hover:-translate-y-0.5"
              style={{ background:'var(--surface-1)', borderColor:'var(--border)', borderTop:`3px solid ${GROUP_COLORS[g]}` }}>
              <div className="text-xs font-extrabold uppercase mb-3" style={{ color: GROUP_COLORS[g] }}>
                Group {g}
              </div>
              {WC2026_GROUPS[g].map((team, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b last:border-0"
                  style={{ borderColor:'var(--border)' }}>
                  <span className="text-lg leading-none">{team.flag}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color:'var(--white-primary)' }}>{team.name}</div>
                    <div className="text-[10px]" style={{ color:'var(--white-ghost)' }}>{team.confederation}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── TEAMS VIEW ── */}
      {view === 'teams' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {teamKeys.map(t => (
              <button key={t} onClick={() => setSelectedTeam(selectedTeam === t ? null : t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: selectedTeam === t ? 'var(--surface-3)' : 'var(--surface-2)',
                  color: 'var(--white-primary)',
                  border: selectedTeam === t ? '1px solid var(--green-live)' : '1px solid var(--border)',
                }}>
                <span>{TEAM_INFO[t].flag}</span> {t}
              </button>
            ))}
          </div>

          {selectedTeam && TEAM_INFO[selectedTeam] && (() => {
            const info = TEAM_INFO[selectedTeam];
            const teamFixtures = WC2026_FIXTURES.filter(f => f.home === selectedTeam || f.away === selectedTeam);
            return (
              <div className="rounded-xl border p-5" style={{ background:'var(--surface-1)', borderColor:'var(--border)' }}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-5xl">{info.flag}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold uppercase" style={{ fontFamily:'var(--font-display)', color:'var(--white-primary)' }}>
                      {selectedTeam}
                    </h3>
                    <div className="flex gap-4 text-xs mt-1" style={{ color:'var(--white-muted)' }}>
                      <span>Group {info.group}</span>
                      {info.fifaRank > 0 && <span>FIFA #{info.fifaRank}</span>}
                      {info.coach !== 'TBD' && <span>🧑‍💼 {info.coach}</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Key players */}
                  {info.keyPlayers && info.keyPlayers.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5"
                        style={{ color:'var(--white-ghost)' }}>
                        <Users className="w-3 h-3" /> Key Players
                      </div>
                      <div className="space-y-2">
                        {info.keyPlayers.map((p, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded"
                            style={{ background:'var(--surface-2)' }}>
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0"
                              style={{ background:'var(--surface-3)', color:'var(--white-ghost)' }}>{p.pos}</span>
                            <span className="text-sm font-semibold flex-1" style={{ color:'var(--white-primary)' }}>{p.name}</span>
                            <span className="text-xs" style={{ color:'var(--white-ghost)' }}>{p.club}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Group fixtures */}
                  <div className={(!info.keyPlayers || info.keyPlayers.length === 0) ? "md:col-span-2" : ""}>
                    <div className="text-xs uppercase tracking-wider mb-3" style={{ color:'var(--white-ghost)' }}>
                      Group Stage Fixtures
                    </div>
                    <div className="space-y-2">
                      {teamFixtures.map((m, i) => {
                        const isHome = m.home === selectedTeam;
                        const opp = isHome ? m.away : m.home;
                        const oppFlag = isHome ? m.awayFlag : m.homeFlag;
                        return (
                          <div key={i} className="flex items-center gap-3 p-2 rounded"
                            style={{ background:'var(--surface-2)' }}>
                            <span className="text-xs tabular-nums" style={{ color:'var(--gold-leader)' }}>
                              {new Date(m.date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                            </span>
                            <span className="text-xs" style={{ color:'var(--white-muted)' }}>{isHome ? 'vs' : '@'}</span>
                            <span className="text-lg">{oppFlag}</span>
                            <span className="text-sm font-semibold" style={{ color:'var(--white-primary)' }}>{opp}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {!selectedTeam && (
            <div className="text-center py-10 text-sm" style={{ color:'var(--white-ghost)' }}>
              ↑ Select a team to see coach, players &amp; fixtures
            </div>
          )}
        </div>
      )}
    </div>
  );
}
