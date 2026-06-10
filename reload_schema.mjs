import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('reload_schema_cache'); // Or we might have to just wait or trigger it
  console.log("RPC:", data, error);
}
run();
