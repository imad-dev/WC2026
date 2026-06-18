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

const supabase = createClient(supabaseUrl, supabaseKey);

function getRandomScore() {
  const r = Math.random();
  if (r < 0.3) return 0;
  if (r < 0.6) return 1;
  if (r < 0.85) return 2;
  if (r < 0.95) return 3;
  return 4;
}

async function simulateMatches() {
  // First delete any dummy matches
  await supabase.from('wc2026_matches').delete().eq('match_number', 999);

  // Find past matches that are not finished
  const { data: matches, error } = await supabase
    .from('wc2026_matches')
    .select('id, home_team, away_team')
    .lt('kickoff_utc', new Date().toISOString())
    .neq('status', 'finished');

  if (error) {
    console.error("Error fetching matches:", error);
    process.exit(1);
  }

  console.log(`Found ${matches.length} matches to update.`);

  let updated = 0;
  for (const match of matches) {
    const homeScore = getRandomScore();
    const awayScore = getRandomScore();

    console.log(`Simulating: ${match.home_team} ${homeScore} - ${awayScore} ${match.away_team}`);

    const { error: updateError } = await supabase
      .from('wc2026_matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'finished'
      })
      .eq('id', match.id);

    if (updateError) {
      console.error(`Error updating match ${match.id}:`, updateError);
    } else {
      updated++;
    }
  }

  console.log(`Successfully updated ${updated} matches to 'finished' with simulated scores.`);
}

simulateMatches();
