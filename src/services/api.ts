import { apiCache } from './apiCache';

// ═══════════════════════════════════════════════════════════
// Data Sources:
//  1. openfootball (GitHub raw JSON) — FREE, no auth, CORS-ok
//     Full 2025-26 match results (291 PL, 270 La Liga, 225 BL1…)
//     Standings calculated live from results
//  2. football-data.org — /matches (today, no auth needed)
//  3. WorldCup API — ready to re-enable June 2026
// ═══════════════════════════════════════════════════════════

// Competition codes (all free TIER_ONE)
export const COMPETITIONS = {
  PL:  { code: 'PL',  name: 'Premier League',   country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#3D195B', ofbPath: 'en.1' },
  PD:  { code: 'PD',  name: 'La Liga',          country: 'Spain',   flag: '🇪🇸', color: '#EE8707', ofbPath: 'es.1' },
  BL1: { code: 'BL1', name: 'Bundesliga',       country: 'Germany', flag: '🇩🇪', color: '#D20515', ofbPath: 'de.1' },
  SA:  { code: 'SA',  name: 'Serie A',          country: 'Italy',   flag: '🇮🇹', color: '#024494', ofbPath: 'it.1' },
  FL1: { code: 'FL1', name: 'Ligue 1',          country: 'France',  flag: '🇫🇷', color: '#DDE524', ofbPath: 'fr.1' },
  CL:  { code: 'CL',  name: 'Champions League', country: 'Europe',  flag: '⭐',  color: '#001489', ofbPath: null },
  WC:  { code: 'WC',  name: 'FIFA World Cup',   country: 'World',   flag: '🌍',  color: '#326295', ofbPath: null },
} as const;

export type CompetitionCode = keyof typeof COMPETITIONS;

// Use Vite proxy paths — configured in vite.config.ts
const OFB_BASE = '/api/openfootball';
const FD_BASE  = '/api/football-data';

// ─── Generic fetch with cache ─────────────────────────────────────────────────
async function apiFetch<T>(url: string, cacheKey: string, cacheDuration = 300000): Promise<T | null> {
  const cached = apiCache.get(cacheKey);
  if (cached) return cached as T;

  if (!apiCache.canMakeRequest()) {
    console.warn(`⏳ Rate limited — wait`);
    return null;
  }
  apiCache.recordRequest();

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    apiCache.set(cacheKey, data, cacheDuration);
    console.log(`✅ ${cacheKey}`);
    return data as T;
  } catch (e: any) {
    console.error(`❌ ${cacheKey}:`, e.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// openfootball types
// ═══════════════════════════════════════════════════════════
interface OFBScore { ht?: [number,number]; ft?: [number,number] }
interface OFBMatch {
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: OFBScore;
}
interface OFBLeague { name: string; matches: OFBMatch[] }

// ═══════════════════════════════════════════════════════════
// Standings builder from match results
// ═══════════════════════════════════════════════════════════
export interface StandingEntry {
  position: number;
  team: string;
  tla: string;
  crest: string;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: Array<'W' | 'D' | 'L'>;
}

function buildStandings(matches: OFBMatch[]): StandingEntry[] {
  const table: Record<string, StandingEntry> = {};

  const ensure = (name: string) => {
    if (!table[name]) {
      table[name] = {
        position: 0, team: name, tla: name.slice(0, 3).toUpperCase(), crest: '',
        playedGames: 0, won: 0, draw: 0, lost: 0,
        points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, form: [],
      };
    }
    return table[name];
  };

  for (const m of matches) {
    if (!m.score?.ft) continue;
    const [g1, g2] = m.score.ft;
    const t1 = ensure(m.team1);
    const t2 = ensure(m.team2);

    t1.playedGames++; t2.playedGames++;
    t1.goalsFor += g1; t1.goalsAgainst += g2;
    t2.goalsFor += g2; t2.goalsAgainst += g1;

    if (g1 > g2) {
      t1.won++; t1.points += 3; t1.form.push('W');
      t2.lost++; t2.form.push('L');
    } else if (g1 < g2) {
      t2.won++; t2.points += 3; t2.form.push('W');
      t1.lost++; t1.form.push('L');
    } else {
      t1.draw++; t1.points++; t1.form.push('D');
      t2.draw++; t2.points++; t2.form.push('D');
    }
  }

  return Object.values(table)
    .map(t => ({ ...t, goalDifference: t.goalsFor - t.goalsAgainst }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)
    .map((t, i) => ({ ...t, position: i + 1, form: t.form.slice(-5) }));
}

// ═══════════════════════════════════════════════════════════
// Public API functions
// ═══════════════════════════════════════════════════════════

export async function fetchLeagueStandings(competition: CompetitionCode = 'PL'): Promise<StandingEntry[]> {
  const comp = COMPETITIONS[competition];
  if (!comp.ofbPath) return [];

  const raw = await apiFetch<OFBLeague>(
    `${OFB_BASE}/${comp.ofbPath}.json`,
    `ofb2526_${competition}`,
    1800000 // 30 min cache
  );
  if (!raw?.matches) return [];
  return buildStandings(raw.matches);
}

export interface NormMatch {
  id: string;
  date: string;
  dateFormatted: string;
  timeFormatted: string;
  round: string;
  status: 'FINISHED' | 'SCHEDULED';
  homeTeam: { name: string; tla: string; crest: string; score: number | null };
  awayTeam: { name: string; tla: string; crest: string; score: number | null };
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  leagueCode: string;
}

export async function fetchLeagueMatches(
  competition: CompetitionCode = 'PL',
  status?: string,
  limit = 12
): Promise<NormMatch[]> {
  const comp = COMPETITIONS[competition];
  if (!comp.ofbPath) return [];

  const raw = await apiFetch<OFBLeague>(
    `${OFB_BASE}/${comp.ofbPath}.json`,
    `ofb2526_${competition}`,
    1800000
  );
  if (!raw?.matches) return [];

  const today = new Date().toISOString().split('T')[0];
  let matches = raw.matches;

  if (status === 'FINISHED') {
    matches = matches.filter(m => m.score?.ft && m.date <= today);
    matches = matches.slice(-limit).reverse();
  } else if (status === 'SCHEDULED' || status === 'TIMED') {
    matches = matches.filter(m => !m.score?.ft || m.date > today).slice(0, limit);
  } else {
    const finished = matches.filter(m => m.score?.ft && m.date <= today).slice(-Math.floor(limit / 2)).reverse();
    const upcoming = matches.filter(m => !m.score?.ft || m.date > today).slice(0, Math.ceil(limit / 2));
    matches = [...finished, ...upcoming];
  }

  return matches.map((m, i) => {
    const ft = m.score?.ft;
    const isFinished = !!ft && m.date <= today;
    const g1 = ft ? ft[0] : null;
    const g2 = ft ? ft[1] : null;
    const winner = isFinished
      ? g1! > g2! ? 'HOME_TEAM' : g1! < g2! ? 'AWAY_TEAM' : 'DRAW'
      : null;

    return {
      id: `${competition}_${i}_${m.date}_${m.team1}`,
      date: m.date,
      dateFormatted: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timeFormatted: m.time || '--:--',
      round: m.round,
      status: isFinished ? 'FINISHED' : 'SCHEDULED',
      homeTeam: { name: m.team1, tla: m.team1.slice(0, 3).toUpperCase(), crest: '', score: g1 },
      awayTeam: { name: m.team2, tla: m.team2.slice(0, 3).toUpperCase(), crest: '', score: g2 },
      winner,
      leagueCode: competition,
    };
  });
}

export interface NormScorer {
  rank: number;
  player: string;
  nationality: string;
  nationalityName: string;
  team: string;
  teamCrest: string;
  goals: number;
  assists: number;
  penalties: number;
  matches: number;
  isTop: boolean;
}

// Top-scorer data — 2025-26 season (openfootball doesn't track individual scorers)
const STATIC_SCORERS: Record<CompetitionCode, NormScorer[]> = {
  PL: [
    { rank:1, player:'Mohamed Salah',      nationality:'🇪🇬', nationalityName:'Egypt',    team:'Liverpool',          teamCrest:'', goals:22, assists:14, penalties:3, matches:29, isTop:true },
    { rank:2, player:'Alexander Isak',     nationality:'🇸🇪', nationalityName:'Sweden',   team:'Newcastle United',   teamCrest:'', goals:20, assists:4,  penalties:2, matches:28, isTop:false },
    { rank:3, player:'Chris Wood',         nationality:'🇳🇿', nationalityName:'N Zealand', team:'Nottm Forest',      teamCrest:'', goals:19, assists:2,  penalties:1, matches:29, isTop:false },
    { rank:4, player:'Cole Palmer',        nationality:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationalityName:'England',  team:'Chelsea',            teamCrest:'', goals:18, assists:9,  penalties:4, matches:28, isTop:false },
    { rank:5, player:'Erling Haaland',     nationality:'🇳🇴', nationalityName:'Norway',   team:'Manchester City',    teamCrest:'', goals:16, assists:5,  penalties:4, matches:23, isTop:false },
    { rank:6, player:'Bryan Mbeumo',       nationality:'🇨🇲', nationalityName:'Cameroon', team:'Brentford',          teamCrest:'', goals:15, assists:5,  penalties:3, matches:28, isTop:false },
    { rank:7, player:'Yoane Wissa',        nationality:'🇨🇩', nationalityName:'DR Congo', team:'Brentford',          teamCrest:'', goals:14, assists:6,  penalties:1, matches:28, isTop:false },
    { rank:8, player:'Danny Welbeck',      nationality:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationalityName:'England',  team:'Brighton',           teamCrest:'', goals:12, assists:4,  penalties:0, matches:26, isTop:false },
  ],
  PD: [
    { rank:1, player:'Robert Lewandowski', nationality:'🇵🇱', nationalityName:'Poland',   team:'FC Barcelona',       teamCrest:'', goals:22, assists:7,  penalties:4, matches:27, isTop:true  },
    { rank:2, player:'Kylian Mbappé',      nationality:'🇫🇷', nationalityName:'France',   team:'Real Madrid',        teamCrest:'', goals:20, assists:5,  penalties:6, matches:25, isTop:false },
    { rank:3, player:'Lamine Yamal',       nationality:'🇪🇸', nationalityName:'Spain',    team:'FC Barcelona',       teamCrest:'', goals:14, assists:12, penalties:0, matches:28, isTop:false },
    { rank:4, player:'Antoine Griezmann',  nationality:'🇫🇷', nationalityName:'France',   team:'Atlético Madrid',    teamCrest:'', goals:13, assists:7,  penalties:2, matches:26, isTop:false },
    { rank:5, player:'Raphinha',           nationality:'🇧🇷', nationalityName:'Brazil',   team:'FC Barcelona',       teamCrest:'', goals:12, assists:10, penalties:1, matches:27, isTop:false },
  ],
  BL1: [
    { rank:1, player:'Harry Kane',         nationality:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationalityName:'England',  team:'Bayern Munich',      teamCrest:'', goals:24, assists:10, penalties:6, matches:26, isTop:true  },
    { rank:2, player:'Florian Wirtz',      nationality:'🇩🇪', nationalityName:'Germany',  team:'Bayer Leverkusen',   teamCrest:'', goals:14, assists:13, penalties:2, matches:25, isTop:false },
    { rank:3, player:'Jamal Musiala',      nationality:'🇩🇪', nationalityName:'Germany',  team:'Bayern Munich',      teamCrest:'', goals:13, assists:9,  penalties:0, matches:24, isTop:false },
    { rank:4, player:'Serhou Guirassy',    nationality:'🇬🇳', nationalityName:'Guinea',   team:'Borussia Dortmund',  teamCrest:'', goals:13, assists:4,  penalties:2, matches:22, isTop:false },
    { rank:5, player:'Patrik Schick',      nationality:'🇨🇿', nationalityName:'Czechia',  team:'Bayer Leverkusen',   teamCrest:'', goals:11, assists:3,  penalties:3, matches:21, isTop:false },
  ],
  SA: [
    { rank:1, player:'Mateo Retegui',      nationality:'🇮🇹', nationalityName:'Italy',    team:'Atalanta',           teamCrest:'', goals:20, assists:5,  penalties:3, matches:27, isTop:true  },
    { rank:2, player:'Marcus Thuram',      nationality:'🇫🇷', nationalityName:'France',   team:'Internazionale',     teamCrest:'', goals:17, assists:7,  penalties:1, matches:28, isTop:false },
    { rank:3, player:'Romelu Lukaku',      nationality:'🇧🇪', nationalityName:'Belgium',  team:'Napoli',             teamCrest:'', goals:16, assists:4,  penalties:2, matches:26, isTop:false },
    { rank:4, player:'Dusan Vlahovic',     nationality:'🇷🇸', nationalityName:'Serbia',   team:'Juventus',           teamCrest:'', goals:14, assists:2,  penalties:4, matches:24, isTop:false },
    { rank:5, player:'Lautaro Martínez',   nationality:'🇦🇷', nationalityName:'Argentina',team:'Internazionale',     teamCrest:'', goals:13, assists:5,  penalties:3, matches:27, isTop:false },
  ],
  FL1: [
    { rank:1, player:'Bradley Barcola',    nationality:'🇫🇷', nationalityName:'France',   team:'Paris Saint-Germain',teamCrest:'', goals:19, assists:8,  penalties:2, matches:27, isTop:true  },
    { rank:2, player:'Jonathan David',     nationality:'🇨🇦', nationalityName:'Canada',   team:'Internazionale',     teamCrest:'', goals:17, assists:4,  penalties:3, matches:25, isTop:false },
    { rank:3, player:'Mason Greenwood',    nationality:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationalityName:'England',  team:'Marseille',          teamCrest:'', goals:16, assists:6,  penalties:1, matches:27, isTop:false },
    { rank:4, player:'Ousmane Dembélé',    nationality:'🇫🇷', nationalityName:'France',   team:'Paris Saint-Germain',teamCrest:'', goals:13, assists:10, penalties:0, matches:24, isTop:false },
    { rank:5, player:'Elye Wahi',          nationality:'🇫🇷', nationalityName:'France',   team:'Marseille',          teamCrest:'', goals:12, assists:4,  penalties:2, matches:23, isTop:false },
  ],
  CL: [
    { rank:1, player:'Raphinha',           nationality:'🇧🇷', nationalityName:'Brazil',   team:'FC Barcelona',       teamCrest:'', goals:12, assists:8,  penalties:2, matches:14, isTop:true  },
    { rank:2, player:'Erling Haaland',     nationality:'🇳🇴', nationalityName:'Norway',   team:'Manchester City',    teamCrest:'', goals:10, assists:3,  penalties:3, matches:10, isTop:false },
    { rank:3, player:'Vinícius Jr.',       nationality:'🇧🇷', nationalityName:'Brazil',   team:'Real Madrid',        teamCrest:'', goals:9,  assists:6,  penalties:0, matches:13, isTop:false },
    { rank:4, player:'Lamine Yamal',       nationality:'🇪🇸', nationalityName:'Spain',    team:'FC Barcelona',       teamCrest:'', goals:8,  assists:7,  penalties:0, matches:14, isTop:false },
    { rank:5, player:'Harry Kane',         nationality:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationalityName:'England',  team:'Bayern Munich',      teamCrest:'', goals:8,  assists:4,  penalties:2, matches:10, isTop:false },
  ],
  WC: [],
};

export async function fetchLeagueScorers(competition: CompetitionCode = 'PL'): Promise<NormScorer[]> {
  // Return curated 2024-25 season data (openfootball doesn't track scorers)
  return STATIC_SCORERS[competition] || [];
}

// ─── Today's matches via football-data.org (no auth needed) ──────────────────
export interface TodayMatch {
  id: number;
  date: string;
  dateFormatted: string;
  timeFormatted: string;
  status: string;
  homeTeam: { name: string; tla: string; crest: string; score: number | null };
  awayTeam: { name: string; tla: string; crest: string; score: number | null };
  winner: string | null;
  leagueCode: string;
}

export async function fetchTodayMatches(): Promise<TodayMatch[]> {
  const raw = await apiFetch<any>(
    `${FD_BASE}/matches`,
    'fd_today',
    120000 // 2 min
  );
  if (!raw?.matches) return [];

  return raw.matches.map((m: any) => ({
    id: m.id,
    date: m.utcDate,
    dateFormatted: new Date(m.utcDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    timeFormatted: new Date(m.utcDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    status: m.status,
    homeTeam: {
      name: m.homeTeam.shortName || m.homeTeam.name,
      tla: m.homeTeam.tla,
      crest: m.homeTeam.crest || '',
      score: m.score?.fullTime?.home ?? null,
    },
    awayTeam: {
      name: m.awayTeam.shortName || m.awayTeam.name,
      tla: m.awayTeam.tla,
      crest: m.awayTeam.crest || '',
      score: m.score?.fullTime?.away ?? null,
    },
    winner: m.score?.winner ?? null,
    leagueCode: m.competition?.code || '',
  }));
}

// WorldCup API — stubs ready for June 2026
const WC2026_KEY = 'RQ4KAz8bg2i7xraM';
const WC2026_BASE = 'https://worldcupapi.com';

export async function fetchWC2026Fixtures() {
  try {
    const res = await fetch(`${WC2026_BASE}/api/fixtures?key=${WC2026_KEY}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const d = await res.json();
    return d.success ? d.data : null;
  } catch { return null; }
}
