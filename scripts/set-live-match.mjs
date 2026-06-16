import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching teams: Norway and Iraq...');
  
  // 1. Get or Create Teams
  let { data: norway } = await supabase.from('wc2026_teams').select('*').eq('name', 'Norway').single();
  let { data: iraq } = await supabase.from('wc2026_teams').select('*').eq('name', 'Iraq').single();

  if (!norway) {
    console.log('Norway not found. Inserting...');
    const res = await supabase.from('wc2026_teams').insert({ name: 'Norway', short_name: 'NOR', continent: 'Europe' }).select().single();
    norway = res.data;
  }
  if (!iraq) {
    console.log('Iraq not found. Inserting...');
    const res = await supabase.from('wc2026_teams').insert({ name: 'Iraq', short_name: 'IRQ', continent: 'Asia' }).select().single();
    iraq = res.data;
  }

  // 2. Clear old live matches
  console.log('Resetting all currently live matches...');
  await supabase.from('wc2026_matches').update({ status: 'finished' }).eq('status', 'live');

  // 3. Create Live Match
  console.log(`Setting Norway vs Iraq as LIVE match...`);
  const matchData = {
    home_team: 'Norway',
    away_team: 'Iraq',
    status: 'live',
    home_score: 0,
    away_score: 0,
    kickoff_utc: new Date().toISOString(),
    match_number: 999, // Arbitrary
    venue: "King Fahd Stadium",
    group_name: "A"
  };

  const { data: match, error: matchError } = await supabase
    .from('wc2026_matches')
    .insert(matchData)
    .select()
    .single();

  if (matchError) {
    console.error('Error inserting match:', matchError);
  } else {
    console.log('Successfully inserted live match!', match.id);
  }

}

run();
