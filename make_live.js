const supabaseUrl = process.env.SUPABASE_URL || 'https://hmrupyzllyeyafqrparw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcnVweXpsbHlleWFmcXJwYXJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU2ODAzNCwiZXhwIjoyMDk2MTQ0MDM0fQ.u4-Pz-vb7UcuTxhLKziEexj1NNR2Zj_A7plIH00mIQY';

async function updateScore() {
  const res = await fetch(`${supabaseUrl}/rest/v1/wc2026_matches?id=eq.1`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      home_score: 1,
      away_score: 0
    })
  });
  
  const data = await res.json();
  console.log('Match Score Updated:', JSON.stringify(data, null, 2));
}

updateScore();
