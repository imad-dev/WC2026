import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: matches } = await supabase.from('wc2026_matches').select('*').limit(20);
  console.log("Sample match:", matches[0]);
  
  const { data: standings } = await supabase.from('wc_standings').select('*');
  console.log("Current standings count:", standings?.length);
}
check();
