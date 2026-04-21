import { Trophy, Users, Star } from 'lucide-react';
import type { TeamInfo } from '../../data/wc2026Static';
import { WC2026_FIXTURES } from '../../data/wc2026Static';

interface TeamProfileCardProps {
  teamName: string;
  info: TeamInfo;
  groupColor: string;
  onClose?: () => void;
}

const CONF_COLOR: Record<string, string> = {
  UEFA:     '#4FC3F7',
  CONMEBOL: '#81C784',
  CONCACAF: '#FFB74D',
  CAF:      '#F06292',
  AFC:      '#CE93D8',
  OFC:      '#80DEEA',
};

const POS_COLOR: Record<string, string> = {
  GK: '#FFA726', CB: '#42A5F5', RB: '#42A5F5', LB: '#42A5F5',
  CDM: '#66BB6A', CM: '#66BB6A', CAM: '#EC407A', AM: '#EC407A',
  LW: '#AB47BC', RW: '#AB47BC', ST: '#EF5350',
};

export function TeamProfileCard({ teamName, info, groupColor, onClose }: TeamProfileCardProps) {
  const fixtures = WC2026_FIXTURES.filter(f => f.home === teamName || f.away === teamName);
  const confColor = CONF_COLOR[info.confederation] || 'var(--white-ghost)';
  const hasRecord = info.wcRecord;
  const total = hasRecord ? (info.wcRecord!.w + info.wcRecord!.d + info.wcRecord!.l) : 0;

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>

      {/* ── HEADER BANNER ── */}
      <div className="relative px-6 pt-6 pb-4"
        style={{ background: `linear-gradient(135deg, ${groupColor}18 0%, ${groupColor}06 60%, transparent 100%)`, borderBottom: `3px solid ${groupColor}` }}>
        {onClose && (
          <button onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-surface-2"
            style={{ color: 'var(--white-ghost)', background: 'var(--surface-2)' }}>✕</button>
        )}
        <div className="flex items-center gap-5 flex-wrap">
          {/* Flag */}
          <span className="text-7xl leading-none drop-shadow-lg">{info.flag}</span>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-3xl font-extrabold uppercase"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)', letterSpacing: '-0.02em' }}>
                {teamName}
              </h2>
              {info.titles && info.titles > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(255,179,0,0.15)', border: '1px solid var(--gold-leader)', color: 'var(--gold-leader)' }}>
                  <Trophy className="w-3 h-3" /> {info.titles}× Champion
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs">
              {/* Confederation badge */}
              <span className="px-2 py-0.5 rounded font-bold"
                style={{ background: `${confColor}22`, color: confColor, border: `1px solid ${confColor}44` }}>
                {info.confederation}
              </span>
              {/* Group */}
              <span className="px-2 py-0.5 rounded font-bold"
                style={{ background: `${groupColor}22`, color: groupColor, border: `1px solid ${groupColor}44` }}>
                Group {info.group}
              </span>
              {/* FIFA Rank */}
              {info.fifaRank > 0 && (
                <span className="flex items-center gap-1" style={{ color: 'var(--white-muted)' }}>
                  <Star className="w-3 h-3" style={{ color: 'var(--gold-leader)' }} />
                  FIFA <strong style={{ color: 'var(--white-primary)' }}>#{info.fifaRank}</strong>
                </span>
              )}
            </div>
          </div>

          {/* FIFA Rank circle — big */}
          {info.fifaRank > 0 && (
            <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center flex-shrink-0"
              style={{ background: `${groupColor}22`, border: `2px solid ${groupColor}` }}>
              <div className="text-2xl font-extrabold leading-none" style={{ fontFamily: 'var(--font-display)', color: groupColor }}>#{info.fifaRank}</div>
              <div className="text-[9px] uppercase" style={{ color: 'var(--white-ghost)' }}>FIFA</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: 'var(--border)' }}>

        {/* ── LEFT COLUMN ── */}
        <div className="p-5 space-y-5">

          {/* Coach */}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--white-ghost)' }}>
              🧑‍💼 Head Coach
            </div>
            <div className="flex items-center justify-between rounded-lg p-3"
              style={{ background: 'var(--surface-2)' }}>
              <span className="font-semibold" style={{ color: 'var(--white-primary)' }}>
                {info.coach !== 'TBD' ? info.coach : 'To be confirmed'}
              </span>
              {info.coach === 'Mohamed Ouahbi' && (
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(0,230,118,0.1)', color: 'var(--green-live)', border: '1px solid rgba(0,230,118,0.2)' }}>
                  New · Mar 2026
                </span>
              )}
            </div>
          </div>

          {/* Best WC Result */}
          {info.bestResult && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--white-ghost)' }}>
                🏆 Best World Cup Result
              </div>
              <div className="flex items-center gap-2 rounded-lg p-3"
                style={{ background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)' }}>
                <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-leader)' }} />
                <span className="font-semibold" style={{ color: 'var(--gold-leader)' }}>{info.bestResult}</span>
              </div>
            </div>
          )}

          {/* WC Record */}
          {hasRecord && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>
                📊 World Cup Record
              </div>
              {/* W / D / L bars */}
              <div className="space-y-2">
                {[
                  { label: 'Wins',   val: info.wcRecord!.w, color: 'var(--green-live)' },
                  { label: 'Draws',  val: info.wcRecord!.d, color: 'var(--amber-draw, #FFB300)' },
                  { label: 'Losses', val: info.wcRecord!.l, color: 'var(--red-loss)' },
                ].map(({ label, val, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--white-muted)' }}>{label}</span>
                      <span className="font-bold" style={{ color }}>{val}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: total > 0 ? `${(val / total) * 100}%` : '0%', background: color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Goals stats */}
              {(info.wcRecord!.goals !== undefined) && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--surface-2)' }}>
                    <div className="text-lg font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--green-live)' }}>
                      {info.wcRecord!.goals}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>Goals Scored</div>
                  </div>
                  <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--surface-2)' }}>
                    <div className="text-lg font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-loss)' }}>
                      {info.wcRecord!.goalsConceded}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>Goals Conceded</div>
                  </div>
                </div>
              )}

              {/* Matches played */}
              <div className="mt-2 text-center">
                <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                  {total} total World Cup matches played
                </span>
              </div>
            </div>
          )}

          {/* No WC record */}
          {!hasRecord && (
            <div className="rounded-lg p-4 text-center text-sm" style={{ background: 'var(--surface-2)', color: 'var(--white-ghost)' }}>
              No previous World Cup record
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="p-5 space-y-5">

          {/* Key Players */}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: 'var(--white-ghost)' }}>
              <Users className="w-3 h-3" /> Key Players
            </div>
            {info.keyPlayers && info.keyPlayers.length > 0 ? (
              <div className="space-y-2">
                {info.keyPlayers.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg transition-all hover:-translate-y-px"
                    style={{ background: 'var(--surface-2)' }}>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold min-w-[34px] text-center flex-shrink-0"
                      style={{ background: `${POS_COLOR[p.pos] || '#666'}22`, color: POS_COLOR[p.pos] || 'var(--white-ghost)', border: `1px solid ${POS_COLOR[p.pos] || '#666'}44` }}>
                      {p.pos}
                    </span>
                    <span className="text-sm font-semibold flex-1" style={{ color: 'var(--white-primary)' }}>{p.name}</span>
                    <span className="text-xs truncate max-w-[110px]" style={{ color: 'var(--white-ghost)' }}>{p.club}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg p-4 text-center text-sm" style={{ background: 'var(--surface-2)', color: 'var(--white-ghost)' }}>
                Squad details TBC
              </div>
            )}
          </div>

          {/* Group Stage Fixtures */}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>
              📅 Group Stage Fixtures
            </div>
            <div className="space-y-2">
              {fixtures.map((m, i) => {
                const isHome = m.home === teamName;
                const opp = isHome ? m.away : m.home;
                const oppFlag = isHome ? m.awayFlag : m.homeFlag;
                const matchDate = new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg"
                    style={{ background: 'var(--surface-2)', border: `1px solid ${groupColor}22` }}>
                    <span className="text-xs font-bold flex-shrink-0 w-14 text-center tabular-nums"
                      style={{ color: 'var(--gold-leader)' }}>{matchDate}</span>
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--white-ghost)' }}>
                      {isHome ? 'vs' : '@'}
                    </span>
                    <span className="text-lg flex-shrink-0">{oppFlag}</span>
                    <span className="text-sm font-semibold flex-1" style={{ color: 'var(--white-primary)' }}>{opp}</span>
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--white-ghost)' }}>{m.time}</span>
                  </div>
                );
              })}
              {fixtures.length === 0 && (
                <div className="rounded-lg p-3 text-center text-sm" style={{ background: 'var(--surface-2)', color: 'var(--white-ghost)' }}>
                  Fixtures TBC
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
