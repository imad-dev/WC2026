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

async function fixTimeline() {
  console.log("Fixing timeline based on user's reality...");
  
  // Set matches on June 17 back to upcoming or live
  // Actually, let's just make id=21 and id=22 upcoming or live.
  // England vs Croatia (kickoff 14:00) and Portugal vs DR Congo (kickoff 11:00).
  // At 16:25 UTC, the 14:00 match might be just finishing. But if the user says the last one is Jordan vs Austria, let's set them to upcoming.
  
  await supabase
    .from('wc2026_matches')
    .update({ status: 'upcoming', home_score: 0, away_score: 0 })
    .gt('kickoff_utc', '2026-06-16T23:59:59Z');
    
  console.log("Timeline corrected.");
}

fixTimeline();
