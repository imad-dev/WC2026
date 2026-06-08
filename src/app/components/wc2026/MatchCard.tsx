import { PredictionWidget } from './PredictionWidget';

interface MatchCardProps {
  id: string;
  teamA: string;
  flagA: string;
  teamB: string;
  flagB: string;
  time: string;
  stage: string;
  group: string;
  stadium: string;
  broadcasters?: string[];
}

export function MatchCard({
  id,
  teamA,
  flagA,
  teamB,
  flagB,
  time,
  stage,
  group,
  stadium,
  broadcasters = ['FOX', 'FS1', 'Telemundo']
}: MatchCardProps) {
  return (
    <div 
      className="flex flex-col p-4 mb-2 rounded-lg border transition-all hover:border-[var(--border-active)]"
      style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border)' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        
        {/* Teams and Score/Time */}
        <div className="flex w-full items-center justify-center md:justify-between py-2">
          {/* Team A */}
          <div className="flex flex-1 items-center justify-end gap-3 text-right">
            <span className="font-semibold text-sm md:text-base text-[var(--white-primary)]">{teamA}</span>
            <span className="text-xl md:text-2xl">{flagA}</span>
          </div>

          {/* Time / Score */}
          <div className="flex flex-col items-center justify-center px-4 md:px-8 w-24">
            <span className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
              {time}
            </span>
          </div>

          {/* Team B */}
          <div className="flex flex-1 items-center justify-start gap-3 text-left">
            <span className="text-xl md:text-2xl">{flagB}</span>
            <span className="font-semibold text-sm md:text-base text-[var(--white-primary)]">{teamB}</span>
          </div>
        </div>
      </div>

      {/* Details Subtitle */}
      <div className="text-center mt-1 mb-3">
        <span className="text-[10px] md:text-xs" style={{ color: 'var(--white-muted)' }}>
          {stage} · {group} · {stadium}
        </span>
      </div>

      {/* Broadcasters */}
      <div className="flex justify-center items-center gap-3 border-t pt-3 mt-2" style={{ borderColor: 'var(--border)' }}>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--white-ghost)' }}>Watch on:</span>
        {broadcasters.map((b, i) => (
          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--white-muted)' }}>
            {b}
          </span>
        ))}
      </div>

      {/* Prediction Widget */}
      <PredictionWidget matchId={id} teamA={teamA} teamB={teamB} />
    </div>
  );
}
