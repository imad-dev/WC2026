import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase
    .from('wc2026_teams')
    .select('id, name, country_code, kit_primary_color, kit_secondary_color, is_host_country, group_name, world_ranking, participations, flag_url')
    .order('name', { ascending: true })
    .limit(1);
    
  console.log("Error:", JSON.stringify(error, null, 2));
  console.log("Data:", data);
}

test();
