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

const SUPABASE_URL = env['SUPABASE_URL'] || env['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];
const API_FOOTBALL_KEY = env['API_FOOTBALL_KEY'];

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !API_FOOTBALL_KEY) {
  console.error("Missing keys");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const WC_LEAGUE_ID = 1;
  const WC_SEASON = 2026;

  console.log("Fetching all fixtures from API-Football...");
  const apiRes = await fetch(
    `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
    {
      headers: {
        'x-rapidapi-key': API_FOOTBALL_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    }
  );

  if (!apiRes.ok) {
    console.error(`API-Football error: ${apiRes.status}`);
    process.exit(1);
  }

  const apiData = await apiRes.json();
  const fixtures = apiData.response || [];
  
  console.log(`Found ${fixtures.length} fixtures in total.`);

  let updatedCount = 0;

  for (const fix of fixtures) {
    const statusMap = {
      '1H': 'live', '2H': 'live', 'HT': 'live', 'ET': 'live', 'P': 'live', 'BT': 'live',
      'FT': 'finished', 'AET': 'finished', 'PEN': 'finished',
      'NS': 'upcoming', 'TBD': 'upcoming',
      'PST': 'postponed', 'CANC': 'postponed', 'ABD': 'postponed',
    };

    const shortStatus = fix.fixture.status.short;
    const status = statusMap[shortStatus] || 'upcoming';

    // Only update if finished or live
    if (status !== 'finished' && status !== 'live') {
      continue;
    }

    const { data: matchRows } = await supabase
      .from('wc2026_matches')
      .select('id, status')
      .ilike('home_team', `%${fix.teams.home.name}%`)
      .ilike('away_team', `%${fix.teams.away.name}%`)
      .limit(1);

    if (matchRows && matchRows.length > 0) {
      console.log(`Updating ${fix.teams.home.name} vs ${fix.teams.away.name} (Status: ${status}, Score: ${fix.goals.home}-${fix.goals.away})`);
      const { error } = await supabase
        .from('wc2026_matches')
        .update({
          home_score: fix.goals.home,
          away_score: fix.goals.away,
          status,
        })
        .eq('id', matchRows[0].id);

      if (error) {
         console.error("Error updating", error);
      } else {
         updatedCount++;
      }
    } else {
      console.log(`Warning: Match not found in DB: ${fix.teams.home.name} vs ${fix.teams.away.name}`);
    }
  }

  console.log(`Successfully updated ${updatedCount} matches.`);
}

run();
