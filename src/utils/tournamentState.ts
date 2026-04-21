// Tournament State Management - Auto-transitions between PRE/LIVE/POST modes

const TOURNAMENT_START = new Date('2026-06-11T19:00:00Z'); // Mexico vs South Africa, Azteca
const TOURNAMENT_END = new Date('2026-07-19T19:00:00Z'); // Final at MetLife Stadium

export type TournamentPhase = 'PRE_TOURNAMENT' | 'LIVE' | 'POST_TOURNAMENT';

export interface Match {
  date: string;
  status: string;
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals?: {
    home: number | null;
    away: number | null;
  };
}

export function getTournamentPhase(): TournamentPhase {
  const now = new Date();
  if (now < TOURNAMENT_START) return 'PRE_TOURNAMENT';
  if (now > TOURNAMENT_END) return 'POST_TOURNAMENT';
  return 'LIVE';
}

export function getDaysUntilKickoff(): number {
  const diff = TOURNAMENT_START.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getNextMatch(fixtures: Match[]): Match | null {
  const now = new Date();
  return (
    fixtures
      .filter((m) => new Date(m.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null
  );
}

export function getRecentMatches(fixtures: Match[], count = 5): Match[] {
  const now = new Date();
  return fixtures
    .filter((m) => new Date(m.date) < now && m.status === 'FT')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export const isTournamentLive = () => getTournamentPhase() === 'LIVE';
export const isPreTournament = () => getTournamentPhase() === 'PRE_TOURNAMENT';

export const TOURNAMENT_START_DATE = TOURNAMENT_START;
export const TOURNAMENT_END_DATE = TOURNAMENT_END;
