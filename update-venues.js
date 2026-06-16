require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: matches } = await supabase.from('wc2026_matches').select('*');
  console.log('Matches:', matches.length);
  // Just print the first 5 venues
  console.log(matches.slice(0, 5).map(m => m.venue));
}
main();
