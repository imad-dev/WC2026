const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) acc[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: matches } = await supabase.from('wc2026_matches').select('*').order('id', { ascending: true });
  console.log('Matches:', matches?.length);
  if (matches) {
    console.log(matches.slice(0, 5).map(m => m.venue));
  }
}
main();
