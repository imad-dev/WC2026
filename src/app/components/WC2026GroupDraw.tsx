import { useState } from 'react';
import { WC2026_GROUPS } from '../../data/wc2026Static';

const CONF_COLORS: Record<string, string> = {
  UEFA: '#003399',
  CONMEBOL: '#006B3F',
  CAF: '#C8102E',
  CONCACAF: '#003DA5',
  AFC: '#E4002B',
  OFC: '#00843D',
};

export function WC2026GroupDraw() {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const groupKeys = Object.keys(WC2026_GROUPS);

  return (
    <section id="wc2026-groups">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-semibold uppercase"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--white-primary)' }}
        >
          WC 2026 Group Draw
        </h2>
        <span
          className="text-xs px-3 py-1.5 rounded-full font-semibold uppercase"
          style={{ background: 'var(--surface-2)', color: 'var(--gold-leader)', border: '1px solid var(--border)', letterSpacing: '0.08em' }}
        >
          12 Groups · 48 Teams
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {groupKeys.map((groupKey) => {
          const teams = WC2026_GROUPS[groupKey];
          const isHovered = hoveredGroup === groupKey;
          return (
            <div
              key={groupKey}
              onMouseEnter={() => setHoveredGroup(groupKey)}
              onMouseLeave={() => setHoveredGroup(null)}
              className="rounded-lg p-3 border transition-all duration-200 cursor-default"
              style={{
                background: isHovered ? 'var(--surface-2)' : 'var(--surface-1)',
                borderColor: isHovered ? 'var(--border-active)' : 'var(--border)',
                transform: isHovered ? 'translateY(-2px)' : 'none',
                boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {/* Group Label */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded flex items-center justify-center text-sm font-extrabold"
                  style={{ background: 'var(--green-live)', color: 'var(--void)', fontFamily: 'var(--font-display)' }}
                >
                  {groupKey}
                </div>
                <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>Group {groupKey}</span>
              </div>

              {/* Teams */}
              <div className="space-y-2">
                {teams.map((team, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-base leading-none">{team.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-semibold truncate"
                        style={{ color: 'var(--white-primary)' }}
                      >
                        {team.name}
                      </div>
                      <div
                        className="text-[10px]"
                        style={{ color: CONF_COLORS[team.confederation] || 'var(--white-ghost)' }}
                      >
                        {team.confederation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
