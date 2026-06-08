import { MatchCard } from './MatchCard';

interface Match {
  id: string;
  teamA: string;
  flagA: string;
  teamB: string;
  flagB: string;
  time: string;
  stage: string;
  group: string;
  stadium: string;
}

interface MatchListProps {
  dateString: string;
  matches: Match[];
}

export function MatchList({ dateString, matches }: MatchListProps) {
  return (
    <div className="mb-8">
      {/* Date Header matching the reference UI */}
      <div className="flex items-center justify-between mb-4 border-b pb-2" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm md:text-base font-semibold" style={{ color: 'var(--white-primary)' }}>
          {dateString}
        </h3>
        <button className="text-xs hover:underline transition-all" style={{ color: 'var(--white-muted)' }}>
          View groups
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {matches.map(m => (
          <MatchCard key={m.id} {...m} />
        ))}
      </div>
    </div>
  );
}
