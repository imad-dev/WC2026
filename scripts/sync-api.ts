import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const REPO_BASE_URL = 'https://raw.githubusercontent.com/rezarahiminia/worldcup2026/main';

interface ApiTeam {
  id: string;
  name_en: string;
  fifa_code: string;
}

interface ApiStadium {
  id: string;
  name_en: string;
  city_en: string;
}

interface ApiMatch {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  group: string;
  matchday: string;
  local_date: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: string;
}

async function syncApi() {
  console.log('Fetching live API data from rezarahiminia/worldcup2026...');

  try {
    const [teamsRes, stadiumsRes, matchesRes] = await Promise.all([
      fetch(`${REPO_BASE_URL}/football.teams.json`),
      fetch(`${REPO_BASE_URL}/football.stadiums.json`),
      fetch(`${REPO_BASE_URL}/football.matches.json`),
    ]);

    const apiTeams: ApiTeam[] = await teamsRes.json() as ApiTeam[];
    const apiStadiums: ApiStadium[] = await stadiumsRes.json() as ApiStadium[];
    const apiMatches: ApiMatch[] = await matchesRes.json() as ApiMatch[];

    const teamMap = new Map(apiTeams.map(t => [t.id, t]));
    const stadiumMap = new Map(apiStadiums.map(s => [s.id, s]));

    console.log(`Fetched ${apiMatches.length} matches. Syncing with Supabase...`);

    const formattedMatches = apiMatches.map((m) => {
      const homeTeam = teamMap.get(m.home_team_id)?.name_en || 'TBD';
      const awayTeam = teamMap.get(m.away_team_id)?.name_en || 'TBD';
      const stadium = stadiumMap.get(m.stadium_id);
      const venue = stadium ? `${stadium.name_en}, ${stadium.city_en}` : 'TBA';
      
      // Parse dates safely (assume standard format from API)
      let kickoff = new Date(m.local_date).toISOString();
      if (isNaN(new Date(m.local_date).getTime())) {
          // fallback if API format changes
          kickoff = new Date("2026-06-11T12:00:00Z").toISOString();
      }

      let status = 'upcoming';
      if (m.finished === 'TRUE') status = 'finished';
      else if (m.time_elapsed !== 'notstarted') status = 'live';

      return {
        id: parseInt(m.id),
        match_number: parseInt(m.id),
        home_team: homeTeam,
        away_team: awayTeam,
        home_score: m.home_score !== 'null' ? parseInt(m.home_score) : null,
        away_score: m.away_score !== 'null' ? parseInt(m.away_score) : null,
        kickoff_utc: kickoff,
        venue: venue,
        group_name: m.type === 'group' ? m.group : null,
        status: status,
      };
    });

    const { error } = await supabase.from('wc2026_matches').upsert(formattedMatches);

    if (error) {
      console.error('Error upserting matches:', error);
    } else {
      console.log('✅ Successfully synced live matches from API!');
    }

  } catch (err) {
    console.error('Failed to sync API:', err);
  }
}

syncApi();
