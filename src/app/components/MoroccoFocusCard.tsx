export function MoroccoFocusCard() {
  // TODO: API - replace Morocco focus values with team/profile endpoint data.
  return (
    <div
      className="rounded border-l-2 overflow-hidden"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--border)',
        borderLeftColor: 'var(--morocco-red)',
      }}
    >
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🇲🇦</span>
          <div>
            <div className="text-base font-semibold" style={{ color: 'var(--white-primary)' }}>
              MOROCCO
            </div>
            <div className="text-xs" style={{ color: 'var(--white-muted)' }}>
              Group F · 2nd
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div
              className="text-xs mb-1"
              style={{ color: 'var(--white-ghost)', fontFeatureSettings: '"tnum" 1' }}
            >
              P3 W2 D1 L0
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--white-ghost)' }}>
              GF
            </div>
            <div
              className="text-lg font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--green-live)',
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              9
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--white-ghost)' }}>
              GA
            </div>
            <div
              className="text-lg font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--white-muted)',
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              4
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          <div className="text-xs mb-2" style={{ color: 'var(--white-muted)' }}>
            Form
          </div>
          <div className="flex items-center gap-1">
            {['W', 'W', 'D', 'W', 'W', 'L'].map((result, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-sm flex items-center justify-center text-xs font-semibold"
                style={{
                  background:
                    result === 'W'
                      ? 'var(--green-live)'
                      : result === 'D'
                      ? 'var(--amber-draw)'
                      : 'var(--red-loss)',
                  color: 'var(--void)',
                }}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Next Match */}
        <div>
          <div className="text-xs mb-2" style={{ color: 'var(--white-muted)' }}>
            Next Match
          </div>
          <div
            className="text-sm font-semibold"
            style={{ color: 'var(--white-primary)' }}
          >
            vs Belgium
          </div>
          <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>
            Apr 22, 18:00
          </div>
        </div>

        {/* Key Player */}
        <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--white-muted)' }}>
            Key Player
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
            >
              🇲🇦
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                EN-NESYRI
              </div>
              <div className="text-xs" style={{ color: 'var(--white-muted)' }}>
                5 goals
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
