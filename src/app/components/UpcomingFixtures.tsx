import { MapPin } from 'lucide-react';

export function UpcomingFixtures() {
  // TODO: API - replace upcoming fixtures with schedule endpoint data.
  const fixtures = [
    { date: 'TODAY', time: '20:00', teamA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', codeA: 'ENG', teamB: '🇪🇸', codeB: 'ESP', stadium: 'MetLife', countdown: '02h 14m' },
    { date: 'TODAY', time: '23:30', teamA: '🇳🇱', codeA: 'NED', teamB: '🇮🇹', codeB: 'ITA', stadium: 'SoFi' },
    { date: 'TUE APR 21', time: '14:00', teamA: '🇯🇵', codeA: 'JPN', teamB: '🇦🇺', codeB: 'AUS', stadium: 'BC Place' },
    { date: 'TUE APR 21', time: '18:00', teamA: '🇺🇸', codeA: 'USA', teamB: '🇨🇦', codeB: 'CAN', stadium: 'Azteca' },
    { date: 'WED APR 22', time: '16:00', teamA: '🇸🇪', codeA: 'SWE', teamB: '🇵🇱', codeB: 'POL', stadium: 'AT&T' },
  ];

  return (
    <div className="rounded border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <span
          className="text-xs uppercase font-semibold"
          style={{ color: 'var(--white-primary)', letterSpacing: '0.08em' }}
        >
          Next Matches
        </span>
      </div>

      {fixtures[0].countdown && (
        <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--white-muted)' }}>
            Next match in
          </div>
          <div
            className="text-3xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--green-live)',
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            {fixtures[0].countdown}
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {fixtures.map((fixture, idx) => (
          <div key={idx}>
            {(idx === 0 || fixtures[idx - 1].date !== fixture.date) && (
              <div
                className="text-xs uppercase font-semibold mb-2"
                style={{ color: 'var(--white-ghost)', letterSpacing: '0.08em' }}
              >
                {fixture.date}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--white-muted)', fontFeatureSettings: '"tnum" 1' }}>{fixture.time}</span>
                <div className="flex items-center gap-1" style={{ color: 'var(--white-ghost)' }}>
                  <MapPin className="w-3 h-3" />
                  <span>{fixture.stadium}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{fixture.teamA}</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--white-primary)' }}>
                    {fixture.codeA}
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                  VS
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--white-primary)' }}>
                    {fixture.codeB}
                  </span>
                  <span className="text-lg">{fixture.teamB}</span>
                </div>
              </div>
            </div>
            {idx < fixtures.length - 1 && <div className="h-px mt-4" style={{ background: 'var(--border)' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
