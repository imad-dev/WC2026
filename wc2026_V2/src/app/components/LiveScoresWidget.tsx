import { mockLiveMatches } from '../../data/mockData';

interface LiveScoresWidgetProps {
  matches?: any[];
  loading?: boolean;
}

export function LiveScoresWidget({ matches: apiMatches, loading }: LiveScoresWidgetProps) {
  // Use API data if available, otherwise use mock data
  const liveMatches = apiMatches && apiMatches.length > 0
    ? apiMatches.slice(0, 3).map((m: any) => ({
        teamA: m.teamA.code || m.teamA.name.substring(0, 3),
        teamB: m.teamB.code || m.teamB.name.substring(0, 3),
        scoreA: m.teamA.score,
        scoreB: m.teamB.score,
        time: m.time
      }))
    : [
        { teamA: 'FRA', teamB: 'ARG', scoreA: 2, scoreB: 1, time: '67\'' },
        { teamA: 'BRA', teamB: 'GER', scoreA: 1, scoreB: 1, time: '82\'' },
        { teamA: 'ESP', teamB: 'POR', scoreA: 3, scoreB: 2, time: '45+2\'' }
      ];

  return (
    <div className="rounded border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />
          <span
            className="text-xs uppercase font-semibold"
            style={{ color: 'var(--white-primary)', letterSpacing: '0.08em' }}
          >
            Live
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--white-muted)' }}>
          3 Matches
        </span>
      </div>

      <div className="p-4 space-y-3">
        {liveMatches.map((match, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 border-l-2 pl-3"
            style={{ borderColor: 'var(--green-live)' }}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: 'var(--white-primary)' }}>{match.teamA}</span>
                <span
                  className="font-semibold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}
                >
                  {match.scoreA}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--white-primary)' }}>{match.teamB}</span>
                <span
                  className="font-semibold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)', fontFeatureSettings: '"tnum" 1' }}
                >
                  {match.scoreB}
                </span>
              </div>
            </div>
            <div className="ml-3 text-xs" style={{ color: 'var(--green-live)' }}>
              {match.time}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-3">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
          <div
            className="h-full animate-pulse"
            style={{ width: '60%', background: 'var(--green-live)' }}
          />
        </div>
        <div className="text-xs mt-1 text-center" style={{ color: 'var(--white-ghost)' }}>
          Refresh in 30s
        </div>
      </div>
    </div>
  );
}
