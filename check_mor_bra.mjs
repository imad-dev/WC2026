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

async function checkMatch() {
  const { data, error } = await supabase
    .from('wc2026_matches')
    .select('home_team, away_team, home_score, away_score, status')
    .or('home_team.eq.Morocco,away_team.eq.Morocco')
    .or('home_team.eq.Brazil,away_team.eq.Brazil');

  if (error) {
    console.error(error);
  } else {
    const match = data.find(m => 
      (m.home_team === 'Morocco' && m.away_team === 'Brazil') || 
      (m.home_team === 'Brazil' && m.away_team === 'Morocco')
    );
    console.log(match);
  }
}
checkMatch();
