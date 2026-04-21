import { useCountdown } from '../../hooks/useCountdown';
import { TOURNAMENT_START_DATE } from '../../utils/tournamentState';

export function CountdownBanner() {
  const { days, hours, minutes } = useCountdown(TOURNAMENT_START_DATE);

  return (
    <div
      className="sticky top-0 z-50 h-10 flex items-center justify-center gap-3"
      style={{
        background: 'var(--green-live)',
        color: 'var(--void)',
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span>⚽ World Cup Kicks Off In</span>
      <span
        style={{
          fontWeight: 800,
          fontSize: '18px',
        }}
      >
        {days}
      </span>
      <span>Days</span>
      <span
        style={{
          fontWeight: 800,
          fontSize: '18px',
        }}
      >
        {hours}
      </span>
      <span>Hrs</span>
      <span
        style={{
          fontWeight: 800,
          fontSize: '18px',
        }}
      >
        {minutes}
      </span>
      <span>Min</span>
    </div>
  );
}
