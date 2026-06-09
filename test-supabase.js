const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hmrupyzllyeyafqrparw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcnVweXpsbHlleWFmcXJwYXJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU2ODAzNCwiZXhwIjoyMDk2MTQ0MDM0fQ.u4-Pz-vb7UcuTxhLKziEexj1NNR2Zj_A7plIH00mIQY');
async function check() {
  const { data, error } = await supabase.from('wc2026_matches').select('*').limit(5);
  console.log("Matches error:", error);
  console.log("Matches data count:", data ? data.length : 0);
}
check();
