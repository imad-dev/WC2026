import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#') && line.includes('=')) {
    const [k, ...rest] = line.split('=');
    env[k.trim()] = rest.join('=').trim();
  }
});

const supabaseUrl = env['SUPABASE_URL'] || env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const REPO_BASE_URL = 'https://raw.githubusercontent.com/rezarahiminia/worldcup2026/main';

async function syncApi() {
  console.log('Fetching live API data from rezarahiminia/worldcup2026...');

  try {
    const [teamsRes, stadiumsRes, matchesRes] = await Promise.all([
      fetch(`${REPO_BASE_URL}/football.teams.json`),
      fetch(`${REPO_BASE_URL}/football.stadiums.json`),
      fetch(`${REPO_BASE_URL}/football.matches.json`),
    ]);

    const apiTeams = await teamsRes.json();
    const apiStadiums = await stadiumsRes.json();
    const apiMatches = await matchesRes.json();

    const teamMap = new Map(apiTeams.map(t => [t.id, t]));
    const stadiumMap = new Map(apiStadiums.map(s => [s.id, s]));

    console.log(`Fetched ${apiMatches.length} matches. Syncing with Supabase...`);

    const formattedMatches = apiMatches.map((m) => {
      const homeTeam = teamMap.get(m.home_team_id)?.name_en || 'TBD';
      const awayTeam = teamMap.get(m.away_team_id)?.name_en || 'TBD';
      const stadium = stadiumMap.get(m.stadium_id);
      const venue = stadium ? `${stadium.name_en}, ${stadium.city_en}` : 'TBA';
      
      let kickoff = new Date(m.local_date).toISOString();
      if (isNaN(new Date(m.local_date).getTime())) {
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

    // Bulk upsert matches
    for (let i = 0; i < formattedMatches.length; i += 50) {
      const chunk = formattedMatches.slice(i, i + 50);
      const { error } = await supabase.from('wc2026_matches').upsert(chunk);
      if (error) {
        console.error('Error upserting chunk:', error);
      }
    }

    console.log('✅ Successfully synced live matches from API!');

  } catch (err) {
    console.error('Failed to sync API:', err);
  }
}

syncApi();
