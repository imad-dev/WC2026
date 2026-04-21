import { useLeagueMatches } from '../../hooks/useFootballData';
import { type CompetitionCode, COMPETITIONS } from '../../services/api';
import { Calendar } from 'lucide-react';

interface UpcomingFixturesProps {
  competition: CompetitionCode;
}

export function UpcomingFixtures({ competition }: UpcomingFixturesProps) {
  const { matches, loading } = useLeagueMatches(competition, 'SCHEDULED', 5);
  const comp = COMPETITIONS[competition];

  return (
    <div className="rounded-xl border p-4" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4" style={{ color: 'var(--gold-leader)' }} />
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--white-primary)', letterSpacing: '0.06em' }}>
          Upcoming Fixtures
        </h3>
        <span className="ml-auto text-xs" style={{ color: 'var(--white-ghost)' }}>
          {comp?.flag} {comp?.name}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded animate-pulse" style={{ background: 'var(--surface-2)' }} />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-2">
          {matches.map(match => (
            <div key={match.id} className="p-3 rounded-lg border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="flex justify-between text-[10px] mb-2" style={{ color: 'var(--white-ghost)' }}>
                <span>{match.round}</span>
                <span className="font-semibold tabular-nums" style={{ color: 'var(--gold-leader)' }}>
                  {match.dateFormatted} · {match.timeFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold truncate" style={{ color: 'var(--white-primary)' }}>{match.homeTeam.name}</span>
                <span className="text-xs font-bold px-2" style={{ color: 'var(--white-ghost)' }}>vs</span>
                <span className="text-xs font-semibold truncate text-right" style={{ color: 'var(--white-primary)' }}>{match.awayTeam.name}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs" style={{ color: 'var(--white-ghost)' }}>
          No upcoming fixtures available
        </div>
      )}
    </div>
  );
}
