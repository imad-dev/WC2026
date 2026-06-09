import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TEAMS = [
  { id: 'arg', name: 'Argentina', confederation: 'CONMEBOL', fifa_ranking: 1, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/ar.png' },
  { id: 'fra', name: 'France', confederation: 'UEFA', fifa_ranking: 2, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/fr.png' },
  { id: 'usa', name: 'United States', confederation: 'CONCACAF', fifa_ranking: 11, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/us.png' },
  { id: 'mex', name: 'Mexico', confederation: 'CONCACAF', fifa_ranking: 12, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/mx.png' },
  { id: 'can', name: 'Canada', confederation: 'CONCACAF', fifa_ranking: 45, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/ca.png' },
  { id: 'bra', name: 'Brazil', confederation: 'CONMEBOL', fifa_ranking: 3, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/br.png' },
  { id: 'eng', name: 'England', confederation: 'UEFA', fifa_ranking: 4, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/gb-eng.png' },
  { id: 'bel', name: 'Belgium', confederation: 'UEFA', fifa_ranking: 5, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/be.png' },
];

const VENUES = [
  { id: 'metlife', name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA', capacity: 82500, is_final_host: true, is_opening_host: false, image_url: '/venues/metlife.jpg' },
  { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 83264, is_final_host: false, is_opening_host: true, image_url: '/venues/azteca.jpg' },
  { id: 'bmo', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 30000, is_final_host: false, is_opening_host: false, image_url: '/venues/bmo.jpg' }
];

async function seed() {
  console.log('Seeding Teams...');
  const { error: teamsErr } = await supabase.from('wc2026_teams').upsert(TEAMS);
  if (teamsErr) console.error('Error teams:', teamsErr);
  else console.log('Teams seeded successfully!');

  console.log('Seeding Venues...');
  const { error: venuesErr } = await supabase.from('wc2026_venues').upsert(VENUES);
  if (venuesErr) console.error('Error venues:', venuesErr);
  else console.log('Venues seeded successfully!');

  console.log('Seeding complete!');
}

seed();
