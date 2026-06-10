import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('wc2026_matches').select('id, home_team_id').limit(1);
  if (data && data.length > 0) {
    console.log(data[0].id);
  } else {
    console.log("No matches found");
  }
}
run();
