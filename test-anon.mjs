import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://hmrupyzllyeyafqrparw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcnVweXpsbHlleWFmcXJwYXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjgwMzQsImV4cCI6MjA5NjE0NDAzNH0.Ex_tgFT-873PouuaX8_MNxDQpY2CISCznVFJaRZ3DfE');
async function check() {
  const { data, error } = await supabase.from('wc2026_matches').select('*');
  console.log("Anon matches count:", data ? data.length : 0);
  console.log("Anon matches error:", error);
}
check();
