import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('wc2026_players').select('*').limit(1);
  console.log("wc2026_players:", error ? "MISSING" : "OK");
}
run();
