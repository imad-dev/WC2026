import { TOURNAMENT_INFO, MOROCCO_INFO } from '../../data/wc2026Static';

export function MoroccoFocusCard() {
  return (
    <div
      className="rounded-xl border p-4 relative overflow-hidden"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
    >
      {/* Moroccan red accent glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C1121F 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🇲🇦</span>
        <div>
          <h3 className="text-sm font-extrabold uppercase" style={{ color: 'var(--white-primary)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
            Morocco
          </h3>
          <div className="text-[10px] uppercase" style={{ color: 'var(--white-ghost)' }}>
            Group {MOROCCO_INFO.group} · #1 Africa
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs font-semibold" style={{ color: '#C1121F' }}>
            {MOROCCO_INFO.bestResult}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>Best WC result</div>
        </div>
      </div>

      {/* WC Record */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Wins', value: MOROCCO_INFO.wcRecord.w, color: 'var(--green-live)' },
          { label: 'Draws', value: MOROCCO_INFO.wcRecord.d, color: 'var(--amber-draw)' },
          { label: 'Losses', value: MOROCCO_INFO.wcRecord.l, color: 'var(--red-loss)' },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-2 rounded" style={{ background: 'var(--surface-2)' }}>
            <div className="text-lg font-extrabold" style={{ color: stat.color, fontFamily: 'var(--font-display)' }}>
              {stat.value}
            </div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--white-ghost)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Coach */}
      <div className="mb-3 text-xs flex items-center gap-2" style={{ color: 'var(--white-muted)' }}>
        <span style={{ color: 'var(--white-ghost)' }}>Coach:</span>
        <span className="font-semibold" style={{ color: 'var(--white-primary)' }}>{MOROCCO_INFO.coach}</span>
        <span className="ml-auto" style={{ color: 'var(--white-ghost)' }}>FIFA #{MOROCCO_INFO.fifaRanking}</span>
      </div>

      {/* Key Players */}
      <div>
        <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--white-ghost)' }}>Key Players</div>
        <div className="space-y-1.5">
          {MOROCCO_INFO.keyPlayers.map((player) => (
            <div key={player.name} className="flex items-center gap-2 text-xs">
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                style={{ background: 'var(--surface-3)', color: 'var(--white-ghost)' }}
              >
                {player.position}
              </span>
              <span className="font-semibold" style={{ color: 'var(--white-primary)' }}>{player.name}</span>
              <span className="ml-auto" style={{ color: 'var(--white-ghost)' }}>{player.club}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Opener info */}
      <div
        className="mt-4 pt-3 border-t text-xs flex items-center gap-2"
        style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}
      >
        <span>vs</span>
        <span className="font-semibold" style={{ color: 'var(--white-primary)' }}>First opponent TBD</span>
        <span className="ml-auto">Jun 2026</span>
      </div>
    </div>
  );
}
