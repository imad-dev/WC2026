// Simplified API Router — football-data.org only
// Other APIs (WorldCup API, API-Football) can be re-enabled when they become available

export type ApiProvider = 'football-data' | 'worldcup-api';

export const FOOTBALL_DATA_CONFIG = {
  name: 'football-data' as const,
  baseUrl: 'https://api.football-data.org/v4',
  supports: {
    premierLeague: true,
    laLiga: true,
    bundesliga: true,
    serieA: true,
    ligue1: true,
    championsLeague: true,
    worldCup: true,
    standings: true,
    matches: true,
    scorers: true,
  },
  rateLimit: {
    requestsPerMinute: 10,
    requiresAuth: false,
    corsEnabled: true,
  },
};

// WorldCup API — endpoints not deployed yet (all return 404)
// Will be re-enabled closer to tournament
export const WORLDCUP_API_CONFIG = {
  name: 'worldcup-api' as const,
  baseUrl: 'https://worldcupapi.com',
  apiKey: 'RQ4KAz8bg2i7xraM',
  supports: {
    worldCup: true,
    liveScores: true,
    fixtures: true,
    standings: true,
    topScorers: true,
  },
  status: 'UNAVAILABLE' as const, // API not deployed yet
};
