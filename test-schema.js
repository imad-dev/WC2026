import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase
    .from('wc2026_teams')
    .select('*')
    .limit(1);
    
  console.log("Columns:", data && data.length > 0 ? Object.keys(data[0]).join(', ') : "No data");
}

test();
