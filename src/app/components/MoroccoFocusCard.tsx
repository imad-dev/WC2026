import { MOROCCO_INFO, TEAM_INFO } from '../../data/wc2026Static';
import { Trophy, Star } from 'lucide-react';

export function MoroccoFocusCard() {
  const info = TEAM_INFO['Morocco'];
  const morocco = MOROCCO_INFO;

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', borderTop: '3px solid #C1272D' }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, rgba(193,39,45,0.15) 0%, transparent 100%)' }}>
        <span className="text-4xl leading-none">🇲🇦</span>
        <div>
          <div className="text-base font-extrabold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
            Morocco
          </div>
          <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>Group C · Atlas Lions</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs font-bold" style={{ color: '#C1272D' }}>FIFA #{morocco.fifaRanking}</div>
          <div className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>Apr 2026</div>
        </div>
      </div>

      {/* Coach */}
      <div className="px-4 py-2 border-t border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--white-ghost)' }}>Head Coach</span>
          <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--white-primary)' }}>
            🧑‍💼 {info.coach}
          </span>
        </div>
        <div className="text-[10px] mt-0.5 text-right" style={{ color: 'var(--white-ghost)' }}>Appointed Mar 5, 2026</div>
      </div>

      {/* Group C fixtures */}
      <div className="px-4 py-3">
        <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--white-ghost)' }}>Group C Matches</div>
        {[
          { date:'Jun 13', opp:'Brazil 🇧🇷', time:'23:00' },
          { date:'Jun 19', opp:'Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿', time:'23:00' },
          { date:'Jun 24', opp:'Haiti 🇭🇹', time:'23:00' },
        ].map((m) => (
          <div key={m.date} className="flex items-center justify-between py-1.5 border-b last:border-0 text-xs"
            style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--gold-leader)' }}>{m.date}</span>
            <span className="font-semibold" style={{ color: 'var(--white-primary)' }}>vs {m.opp}</span>
            <span style={{ color: 'var(--white-ghost)' }}>{m.time}</span>
          </div>
        ))}
      </div>

      {/* Best result */}
      <div className="px-4 py-2 flex items-center gap-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <Trophy className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--gold-leader)' }} />
        <span className="text-xs font-semibold" style={{ color: '#C1272D' }}>{morocco.bestResult}</span>
      </div>

      {/* Key players */}
      <div className="px-4 pb-4">
        <div className="text-[10px] uppercase tracking-wider mb-2 mt-1" style={{ color: 'var(--white-ghost)' }}>
          <Star className="w-2.5 h-2.5 inline mr-1" />Key Players
        </div>
        <div className="space-y-1.5">
          {info.keyPlayers.map((p) => (
            <div key={p.name} className="flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0"
                style={{ background: 'var(--surface-3)', color: 'var(--white-ghost)', minWidth: '32px', textAlign:'center' }}>
                {p.pos}
              </span>
              <span className="font-semibold flex-1" style={{ color: 'var(--white-primary)' }}>{p.name}</span>
              <span className="truncate" style={{ color: 'var(--white-ghost)', maxWidth: '90px' }}>{p.club}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WC Record */}
      <div className="px-4 py-3 border-t grid grid-cols-3 gap-2 text-center" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
        <div>
          <div className="text-base font-extrabold" style={{ color: 'var(--green-live)', fontFamily: 'var(--font-display)' }}>{morocco.wcRecord.w}</div>
          <div className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>WINS</div>
        </div>
        <div>
          <div className="text-base font-extrabold" style={{ color: 'var(--amber-draw)', fontFamily: 'var(--font-display)' }}>{morocco.wcRecord.d}</div>
          <div className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>DRAWS</div>
        </div>
        <div>
          <div className="text-base font-extrabold" style={{ color: 'var(--red-loss)', fontFamily: 'var(--font-display)' }}>{morocco.wcRecord.l}</div>
          <div className="text-[10px]" style={{ color: 'var(--white-ghost)' }}>LOSSES</div>
        </div>
      </div>
    </div>
  );
}
