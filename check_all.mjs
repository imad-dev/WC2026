import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const tables = ['wc2026_matches', 'wc2026_teams', 'wc2026_lineups', 'wc2026_match_stats', 'wc2026_match_events', 'wc2026_predictions'];
  for (const t of tables) {
    const { error } = await supabase.from(t).select('*').limit(1);
    console.log(t, error ? "MISSING" : "OK");
  }
}
run();
