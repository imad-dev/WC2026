import { useState, useEffect } from 'react';
import { getTournamentPhase, getDaysUntilKickoff, TournamentPhase } from '../utils/tournamentState';

export function useTournamentPhase() {
  const [phase, setPhase] = useState<TournamentPhase>(getTournamentPhase);
  const [daysUntil, setDaysUntil] = useState(getDaysUntilKickoff);

  useEffect(() => {
    // Re-check every hour (tournament transitions happen at specific dates, not seconds)
    const interval = setInterval(() => {
      setPhase(getTournamentPhase());
      setDaysUntil(getDaysUntilKickoff());
    }, 3_600_000);

    return () => clearInterval(interval);
  }, []);

  return {
    phase,
    isPreTournament: phase === 'PRE_TOURNAMENT',
    isLive: phase === 'LIVE',
    isPost: phase === 'POST_TOURNAMENT',
    daysUntilKickoff: daysUntil,
  };
}
