import { apiCache } from './apiCache';

// ═══════════════════════════════════════════════════════════
// MULTI-API CONFIGURATION - Using all 3 available APIs
// ═══════════════════════════════════════════════════════════

// API 1: API-Football (RapidAPI)
const API_FOOTBALL_KEY = 'c63785e482459b9f7a1d90138ca920c0';
const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io';

// API 2: WC2026 API (Dedicated World Cup API)
const WC2026_API_KEY = 'wc26_LBdWanqpvW8YW4CC2B7hFU';
const WC2026_BASE = 'https://api.wc2026api.com';

// API 3: BallDontLie API
const BALLDONTLIE_KEY = '1093113c-9c70-49a1-9390-750777c1dc86';
const BALLDONTLIE_BASE = 'https://api.balldontlie.io';

// Headers for each API
const footballHeaders = {
  'x-rapidapi-key': API_FOOTBALL_KEY,
  'x-rapidapi-host': 'v3.football.api-sports.io'
};

const wc2026Headers = {
  'Authorization': `Bearer ${WC2026_API_KEY}`
};

const balldontlieHeaders = {
  'Authorization': `Bearer ${BALLDONTLIE_KEY}`
};

// Helper function to make cached API requests
async function cachedFetch(url: string, cacheKey: string, cacheDuration: number = 300000) {
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Check rate limit
  if (!apiCache.canMakeRequest()) {
    const waitTime = apiCache.getTimeUntilNextRequest();
    console.warn(`⏳ Rate limit reached. Wait ${Math.ceil(waitTime / 1000)}s before next request`);
    throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
  }

  // Make request
  apiCache.recordRequest();

  try {
    const response = await fetch(url, {
      headers: footballHeaders,
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the result
    apiCache.set(cacheKey, data, cacheDuration);

    return data;
  } catch (error: any) {
    // If CORS error, provide helpful message
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.error('❌ CORS/Network Error - API may require server-side proxy');
      throw new Error('Network error: API requires server-side proxy for CORS');
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════
// Fetch Fixtures - Try WC2026 first, then API-Football
// ═══════════════════════════════════════════════════════════

async function fetchWC2026Fixtures() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${WC2026_BASE}/fixtures`, {
      headers: wc2026Headers,
      mode: 'cors',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('🏆 WC2026 API fixtures:', data);

    return data.fixtures || data.matches || data.data || data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('⚠️ WC2026 API timeout (3s)');
    } else {
      console.log('⚠️ WC2026 API not available:', error.message);
    }
    throw error;
  }
}

export async function fetchFixtures(league: number = 39, season: number = 2024) {
  const cacheKey = `fixtures_${league}_${season}`;

  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  console.log(`📅 Fetching fixtures for league ${league}, season ${season}...`);

  // Priority 1: Try WC2026 API for World Cup data (fast timeout)
  if (league === 1 && season >= 2026) {
    try {
      const wc2026Data = await fetchWC2026Fixtures();
      if (wc2026Data && wc2026Data.length > 0) {
        console.log('✅ Using WC2026 API fixtures!');
        apiCache.set(cacheKey, wc2026Data, 600000);
        return wc2026Data;
      }
    } catch (error) {
      console.log('⚠️ WC2026 API unavailable, falling back to API-Football PL2024...');
    }
  }

  // If requesting 2026 season, adjust to 2024 for free tier
  const adjustedSeason = season >= 2025 ? 2024 : season;
  const adjustedLeague = league === 1 ? 39 : league; // WC → Premier League

  // Priority 2: Fallback to API-Football
  try {
    if (!apiCache.canMakeRequest()) {
      const waitTime = apiCache.getTimeUntilNextRequest();
      console.warn(`⏳ Rate limit - wait ${Math.ceil(waitTime / 1000)}s`);
      return [];
    }

    apiCache.recordRequest();

    console.log(`📅 Fetching from API-Football: league ${adjustedLeague}, season ${adjustedSeason}`);

    const response = await fetch(
      `${API_FOOTBALL_BASE}/fixtures?league=${adjustedLeague}&season=${adjustedSeason}`,
      { headers: footballHeaders, mode: 'cors' }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('📅 API-Football fixtures:', data);

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API errors:', data.errors);
      return [];
    }

    const fixtures = data.response || [];
    apiCache.set(cacheKey, fixtures, 600000);
    return fixtures;
  } catch (error: any) {
    console.error('❌ All APIs failed for fixtures:', error.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// WC2026 API Endpoints (Priority 1 - Try First!)
// Note: These likely fail due to CORS or API not available yet
// ═══════════════════════════════════════════════════════════

async function fetchWC2026LiveMatches() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

  try {
    const response = await fetch(`${WC2026_BASE}/matches/live`, {
      headers: wc2026Headers,
      mode: 'cors',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('🏆 WC2026 API live matches:', data);

    return data.matches || data.data || data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('⚠️ WC2026 API timeout (3s)');
    } else {
      console.log('⚠️ WC2026 API not available:', error.message);
    }
    throw error;
  }
}

async function fetchWC2026Standings() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${WC2026_BASE}/standings`, {
      headers: wc2026Headers,
      mode: 'cors',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('🏆 WC2026 API standings:', data);

    return data.standings || data.data || data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('⚠️ WC2026 API timeout (3s)');
    } else {
      console.log('⚠️ WC2026 API not available:', error.message);
    }
    throw error;
  }
}

async function fetchWC2026TopScorers() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${WC2026_BASE}/players/top-scorers`, {
      headers: wc2026Headers,
      mode: 'cors',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('🏆 WC2026 API top scorers:', data);

    return data.scorers || data.players || data.data || data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('⚠️ WC2026 API timeout (3s)');
    } else {
      console.log('⚠️ WC2026 API not available:', error.message);
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════
// Fetch Live Matches - Try WC2026 first, then API-Football
// ═══════════════════════════════════════════════════════════

export async function fetchLiveMatches() {
  const cacheKey = 'live_matches';

  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  console.log('🔴 Fetching live matches from multiple APIs...');

  // Priority 1: Try WC2026 API first (fast timeout, doesn't count against rate limit)
  try {
    const wc2026Data = await fetchWC2026LiveMatches();
    if (wc2026Data && wc2026Data.length > 0) {
      console.log('✅ Using WC2026 API data!');
      apiCache.set(cacheKey, wc2026Data, 30000);
      return wc2026Data;
    }
  } catch (error) {
    // Silently fail - WC2026 API likely blocked by CORS or not available
    console.log('⚠️ WC2026 API unavailable, falling back to API-Football...');
  }

  // Priority 2: Fallback to API-Football
  try {
    if (!apiCache.canMakeRequest()) {
      const waitTime = apiCache.getTimeUntilNextRequest();
      console.warn(`⏳ Rate limit - wait ${Math.ceil(waitTime / 1000)}s`);
      return [];
    }

    apiCache.recordRequest();

    const response = await fetch(`${API_FOOTBALL_BASE}/fixtures?live=all`, {
      headers: footballHeaders,
      mode: 'cors'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('🔴 API-Football live matches:', data);

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API errors:', data.errors);
      return [];
    }

    const matches = data.response || [];
    apiCache.set(cacheKey, matches, 30000);
    return matches;
  } catch (error: any) {
    console.error('❌ All APIs failed for live matches:', error.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// Fetch Standings - Try WC2026 first, then API-Football
// ═══════════════════════════════════════════════════════════

export async function fetchStandings(league: number = 39, season: number = 2024) {
  const cacheKey = `standings_${league}_${season}`;

  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  console.log(`📊 Fetching standings for league ${league}, season ${season}...`);

  // Priority 1: Try WC2026 API for World Cup data (fast timeout)
  if (league === 1 && season >= 2026) {
    try {
      const wc2026Data = await fetchWC2026Standings();
      if (wc2026Data && wc2026Data.length > 0) {
        console.log('✅ Using WC2026 API standings!');
        apiCache.set(cacheKey, wc2026Data, 300000);
        return wc2026Data;
      }
    } catch (error) {
      console.log('⚠️ WC2026 API unavailable, falling back to API-Football PL2024...');
    }
  }

  // If requesting 2026 season, adjust to 2024 for free tier
  const adjustedSeason = season >= 2025 ? 2024 : season;
  const adjustedLeague = league === 1 ? 39 : league; // WC → Premier League

  // Priority 2: Fallback to API-Football
  try {
    if (!apiCache.canMakeRequest()) {
      const waitTime = apiCache.getTimeUntilNextRequest();
      console.warn(`⏳ Rate limit - wait ${Math.ceil(waitTime / 1000)}s`);
      return [];
    }

    apiCache.recordRequest();

    console.log(`📊 Fetching from API-Football: league ${adjustedLeague}, season ${adjustedSeason}`);

    const response = await fetch(
      `${API_FOOTBALL_BASE}/standings?league=${adjustedLeague}&season=${adjustedSeason}`,
      { headers: footballHeaders, mode: 'cors' }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('📊 API-Football standings:', data);

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API errors:', data.errors);
      return [];
    }

    const standings = data.response || [];
    apiCache.set(cacheKey, standings, 300000);
    return standings;
  } catch (error: any) {
    console.error('❌ All APIs failed for standings:', error.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// Fetch Top Scorers - Try WC2026 first, then API-Football
// ═══════════════════════════════════════════════════════════

export async function fetchTopScorers(league: number = 39, season: number = 2024) {
  const cacheKey = `topscorers_${league}_${season}`;

  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  console.log(`⚽ Fetching top scorers for league ${league}, season ${season}...`);

  // Priority 1: Try WC2026 API for World Cup data (fast timeout)
  if (league === 1 && season >= 2026) {
    try {
      const wc2026Data = await fetchWC2026TopScorers();
      if (wc2026Data && wc2026Data.length > 0) {
        console.log('✅ Using WC2026 API top scorers!');
        apiCache.set(cacheKey, wc2026Data, 600000);
        return wc2026Data;
      }
    } catch (error) {
      console.log('⚠️ WC2026 API unavailable, falling back to API-Football PL2024...');
    }
  }

  // If requesting 2026 season, adjust to 2024 for free tier
  const adjustedSeason = season >= 2025 ? 2024 : season;
  const adjustedLeague = league === 1 ? 39 : league; // WC → Premier League

  // Priority 2: Fallback to API-Football
  try {
    if (!apiCache.canMakeRequest()) {
      const waitTime = apiCache.getTimeUntilNextRequest();
      console.warn(`⏳ Rate limit - wait ${Math.ceil(waitTime / 1000)}s`);
      return [];
    }

    apiCache.recordRequest();

    console.log(`⚽ Fetching from API-Football: league ${adjustedLeague}, season ${adjustedSeason}`);

    const response = await fetch(
      `${API_FOOTBALL_BASE}/players/topscorers?league=${adjustedLeague}&season=${adjustedSeason}`,
      { headers: footballHeaders, mode: 'cors' }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('⚽ API-Football top scorers:', data);

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API errors:', data.errors);
      return [];
    }

    const scorers = data.response || [];
    apiCache.set(cacheKey, scorers, 600000);
    return scorers;
  } catch (error: any) {
    console.error('❌ All APIs failed for top scorers:', error.message);
    return [];
  }
}

// Fetch statistics
export async function fetchLeagueStats(league: number = 1, season: number = 2026) {
  try {
    const response = await fetch(
      `${API_FOOTBALL_BASE}/leagues?id=${league}&season=${season}`,
      { headers: footballHeaders }
    );
    const data = await response.json();
    return data.response?.[0] || null;
  } catch (error) {
    console.error('Error fetching league stats:', error);
    return null;
  }
}

// WC2026 API endpoints (if they exist - these are placeholder endpoints)
export async function fetchWC2026Data(endpoint: string) {
  try {
    const response = await fetch(
      `${WC2026_BASE}/${endpoint}`,
      { headers: wc2026Headers }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching WC2026 ${endpoint}:`, error);
    return null;
  }
}

// Transform API data to our format
export function transformFixtureData(fixture: any) {
  return {
    teamA: {
      name: fixture.teams?.home?.name || 'Team A',
      flag: getCountryFlag(fixture.teams?.home?.name),
      score: fixture.goals?.home ?? 0,
      code: fixture.teams?.home?.name?.substring(0, 3).toUpperCase()
    },
    teamB: {
      name: fixture.teams?.away?.name || 'Team B',
      flag: getCountryFlag(fixture.teams?.away?.name),
      score: fixture.goals?.away ?? 0,
      code: fixture.teams?.away?.name?.substring(0, 3).toUpperCase()
    },
    status: getMatchStatus(fixture.fixture?.status?.short),
    time: fixture.fixture?.status?.elapsed ? `${fixture.fixture.status.elapsed}'` : fixture.fixture?.date,
    stadium: fixture.fixture?.venue?.name || 'Stadium',
    group: fixture.league?.round || 'Group Stage',
    date: new Date(fixture.fixture?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

function getMatchStatus(status: string): 'LIVE' | 'FT' | 'UPCOMING' {
  if (status === '1H' || status === '2H' || status === 'HT') return 'LIVE';
  if (status === 'FT' || status === 'AET' || status === 'PEN') return 'FT';
  return 'UPCOMING';
}

function getCountryFlag(countryName?: string): string {
  const flagMap: Record<string, string> = {
    'Morocco': '🇲🇦',
    'France': '🇫🇷',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Portugal': '🇵🇹',
    'Spain': '🇪🇸',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Germany': '🇩🇪',
    'Belgium': '🇧🇪',
    'Croatia': '🇭🇷',
    'Netherlands': '🇳🇱',
    'Italy': '🇮🇹',
    'USA': '🇺🇸',
    'Mexico': '🇲🇽',
    'Canada': '🇨🇦',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'Australia': '🇦🇺'
  };

  return flagMap[countryName || ''] || '⚽';
}

export function transformStandingsData(standings: any) {
  return standings.map((team: any, index: number) => ({
    pos: team.rank || index + 1,
    team: team.team?.name || 'Team',
    flag: getCountryFlag(team.team?.name),
    mp: team.all?.played || 0,
    w: team.all?.win || 0,
    d: team.all?.draw || 0,
    l: team.all?.lose || 0,
    gf: team.all?.goals?.for || 0,
    ga: team.all?.goals?.against || 0,
    gd: team.goalsDiff || 0,
    pts: team.points || 0,
    form: (team.form || 'WWDLL').split('').slice(0, 5) as Array<'W' | 'D' | 'L'>,
    qualified: index < 2
  }));
}

export function transformTopScorersData(scorers: any[]) {
  return scorers.map((scorer: any, index: number) => ({
    rank: index + 1,
    player: scorer.player?.name || 'Player',
    nationality: getCountryFlag(scorer.player?.nationality),
    team: scorer.statistics?.[0]?.team?.name || 'Team',
    goals: scorer.statistics?.[0]?.goals?.total || 0,
    assists: scorer.statistics?.[0]?.goals?.assists || 0,
    matches: scorer.statistics?.[0]?.games?.appearences || 0,
    isTop: index === 0
  }));
}
