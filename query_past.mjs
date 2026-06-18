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

async function listMatches() {
  const { data, error } = await supabase
    .from('wc2026_matches')
    .select('id, home_team, away_team, kickoff_utc, status')
    .lte('id', 20)
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
  } else {
    data.forEach(m => {
      console.log(`Match ${m.id}: ${m.home_team} vs ${m.away_team} (${m.kickoff_utc})`);
    });
  }
}
listMatches();
