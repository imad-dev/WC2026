import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = {};
const envStr = fs.readFileSync('.env.local', 'utf-8');
for (const line of envStr.split('\n')) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    env[k.trim()] = v.trim();
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: matches } = await supabase
    .from('wc2026_matches')
    .select('id, home_team, away_team, kickoff_utc, group_name, venue')
    .order('kickoff_utc', { ascending: true })
    .gte('kickoff_utc', '2026-06-17T00:00:00+00:00')
    .lte('kickoff_utc', '2026-06-18T23:59:59+00:00');
    
  console.log(matches.map(m => `${m.kickoff_utc} - Group ${m.group_name}: ${m.home_team} vs ${m.away_team} at ${m.venue}`).join('\n'));
}
check();
