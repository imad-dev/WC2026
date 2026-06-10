import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', { query: `
    SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'wc2026_teams';
  `});
  if (error) console.log("RPC Error:", error);
  else console.log(data);
}
run();
