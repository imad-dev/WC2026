import { mockRecentMatches } from '../../data/mockData';

interface MatchResultsGridProps {
  fixtures?: any[];
  loading?: boolean;
}

export function MatchResultsGrid({ fixtures: apiFixtures, loading }: MatchResultsGridProps) {
  // Use API data if available, otherwise use mock data
  const recentMatches = apiFixtures && apiFixtures.length > 0
    ? apiFixtures.filter((f: any) => f.status === 'FT').slice(0, 4)
    : mockRecentMatches;

  const matches = recentMatches.length > 0 ? recentMatches : [
    {
      group: 'Group F',
      date: 'Apr 18, 2026',
      teamA: { name: 'Morocco', flag: '🇲🇦', code: 'MAR', score: 2 },
      teamB: { name: 'Croatia', flag: '🇭🇷', code: 'CRO', score: 1 },
      scorers: { A: [{ name: 'Ziyech', time: '34' }, { name: 'En-Nesyri', time: '71' }], B: [{ name: 'Modrić', time: '89' }] },
      motm: 'Ziyech',
      stats: { possession: { a: 54, b: 46 }, shots: { a: 12, b: 8 }, corners: { a: 6, b: 4 } },
    },
    {
      group: 'Group F',
      date: 'Apr 18, 2026',
      teamA: { name: 'Portugal', flag: '🇵🇹', code: 'POR', score: 3 },
      teamB: { name: 'Belgium', flag: '🇧🇪', code: 'BEL', score: 2 },
      scorers: { A: [{ name: 'Ronaldo', time: '15' }, { name: 'Bruno Fernandes', time: '42' }, { name: 'Bernardo Silva', time: '88' }], B: [{ name: 'De Bruyne', time: '56' }, { name: 'Lukaku', time: '73' }] },
      motm: 'Bruno Fernandes',
      stats: { possession: { a: 58, b: 42 }, shots: { a: 15, b: 11 }, corners: { a: 7, b: 3 } },
    },
  ];

  return (
    <section>
      <h2
        className="text-2xl font-semibold uppercase mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
          color: 'var(--white-primary)',
        }}
      >
        Match Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match, idx) => (
          <div
            key={idx}
            className="rounded border transition-all duration-200 hover:border-border-active overflow-hidden"
            style={{
              background: 'var(--surface-1)',
              borderColor: 'var(--border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
            >
              <span className="text-xs" style={{ color: 'var(--white-muted)' }}>
                {match.group}
              </span>
              <span className="text-xs" style={{ color: 'var(--white-muted)' }}>
                {match.date}
              </span>
            </div>

            {/* Match Display */}
            <div className="p-4">
              {/* Team A */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border" style={{ borderColor: 'var(--border)' }}>
                    {match.teamA.flag}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                      {match.teamA.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--white-muted)' }}>
                      {match.teamA.code}
                    </div>
                  </div>
                </div>
                <div
                  className="text-5xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: match.teamA.score > match.teamB.score ? 'var(--green-live)' : 'var(--white-muted)',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {match.teamA.score}
                </div>
              </div>

              {/* Team B */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border" style={{ borderColor: 'var(--border)' }}>
                    {match.teamB.flag}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
                      {match.teamB.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--white-muted)' }}>
                      {match.teamB.code}
                    </div>
                  </div>
                </div>
                <div
                  className="text-5xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: match.teamB.score > match.teamA.score ? 'var(--green-live)' : 'var(--white-muted)',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {match.teamB.score}
                </div>
              </div>

              {/* Scorers */}
              {match.scorers && (
                <div className="space-y-2 mb-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  {match.scorers.A?.map((scorer, sidx) => (
                    <div key={sidx} className="flex items-center gap-2 text-xs" style={{ color: 'var(--white-muted)' }}>
                      <span>⚽</span>
                      <span>{scorer.name}</span>
                      <span style={{ fontFeatureSettings: '"tnum" 1' }}>{scorer.time}'</span>
                    </div>
                  ))}
                  {match.scorers.B?.map((scorer, sidx) => (
                    <div key={sidx} className="flex items-center gap-2 text-xs" style={{ color: 'var(--white-muted)' }}>
                      <span>⚽</span>
                      <span>{scorer.name}</span>
                      <span style={{ fontFeatureSettings: '"tnum" 1' }}>{scorer.time}'</span>
                    </div>
                  ))}
                </div>
              )}

              {/* MOTM */}
              {match.motm && (
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold uppercase"
                    style={{
                      background: 'var(--gold-leader)',
                      color: 'var(--void)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Man of the Match
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--white-primary)' }}>
                    {match.motm}
                  </span>
                </div>
              )}

              {/* Stats */}
              {match.stats && (
                <div className="space-y-2 text-xs">
                  {match.stats.possession && (
                    <div>
                      <div className="flex justify-between mb-1" style={{ color: 'var(--white-muted)' }}>
                        <span>Possession</span>
                        <span style={{ fontFeatureSettings: '"tnum" 1' }}>
                          {match.stats.possession.a}% - {match.stats.possession.b}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <div
                          className="h-full"
                          style={{ width: `${match.stats.possession.a}%`, background: 'var(--green-live)' }}
                        />
                      </div>
                    </div>
                  )}
                  {match.stats.shots && (
                    <div className="flex justify-between" style={{ color: 'var(--white-muted)' }}>
                      <span>Shots</span>
                      <span style={{ fontFeatureSettings: '"tnum" 1' }}>
                        {match.stats.shots.a} - {match.stats.shots.b}
                      </span>
                    </div>
                  )}
                  {match.stats.corners && (
                    <div className="flex justify-between" style={{ color: 'var(--white-muted)' }}>
                      <span>Corners</span>
                      <span style={{ fontFeatureSettings: '"tnum" 1' }}>
                        {match.stats.corners.a} - {match.stats.corners.b}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
