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

const correctResults = [
  { id: 1, home: 2, away: 0 },
  { id: 2, home: 2, away: 1 },
  { id: 3, home: 1, away: 1 },
  { id: 4, home: 4, away: 1 },
  { id: 5, home: 0, away: 1 },
  { id: 6, home: 2, away: 0 },
  { id: 7, home: 1, away: 1 },
  { id: 8, home: 1, away: 1 },
  { id: 9, home: 1, away: 0 },
  { id: 10, home: 7, away: 1 },
  { id: 11, home: 2, away: 2 },
  { id: 12, home: 5, away: 1 },
  { id: 13, home: 2, away: 2 },
  { id: 14, home: 0, away: 0 },
  { id: 15, home: 1, away: 1 },
  { id: 16, home: 1, away: 1 },
  { id: 17, home: 3, away: 1 },
  { id: 18, home: 1, away: 4 },
  { id: 19, home: 3, away: 0 },
  { id: 20, home: 3, away: 1 }
];

async function updateCorrectResults() {
  console.log("Updating database with real fictional World Cup 2026 results...");
  
  let updated = 0;
  for (const res of correctResults) {
    const { error } = await supabase
      .from('wc2026_matches')
      .update({
        home_score: res.home,
        away_score: res.away,
        status: 'finished'
      })
      .eq('id', res.id);
      
    if (error) {
      console.error(`Error updating match ${res.id}:`, error);
    } else {
      updated++;
    }
  }
  
  console.log(`Successfully updated ${updated} matches to their correct historical results!`);
}

updateCorrectResults();
