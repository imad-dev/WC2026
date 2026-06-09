import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TEAMS = [
  // Group A
  { id: 'mex', name: 'Mexico', confederation: 'CONCACAF', fifa_ranking: 15, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/mx.png' },
  { id: 'rsa', name: 'South Africa', confederation: 'CAF', fifa_ranking: 58, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/za.png' },
  { id: 'kor', name: 'South Korea', confederation: 'AFC', fifa_ranking: 22, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/kr.png' },
  { id: 'cze', name: 'Czechia', confederation: 'UEFA', fifa_ranking: 36, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/cz.png' },
  // Group B
  { id: 'can', name: 'Canada', confederation: 'CONCACAF', fifa_ranking: 48, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/ca.png' },
  { id: 'sui', name: 'Switzerland', confederation: 'UEFA', fifa_ranking: 19, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/ch.png' },
  { id: 'qat', name: 'Qatar', confederation: 'AFC', fifa_ranking: 34, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/qa.png' },
  { id: 'bih', name: 'Bosnia and Herzegovina', confederation: 'UEFA', fifa_ranking: 71, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/ba.png' },
  // Group C
  { id: 'bra', name: 'Brazil', confederation: 'CONMEBOL', fifa_ranking: 5, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/br.png' },
  { id: 'mar', name: 'Morocco', confederation: 'CAF', fifa_ranking: 12, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/ma.png' },
  { id: 'hti', name: 'Haiti', confederation: 'CONCACAF', fifa_ranking: 90, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/ht.png' },
  { id: 'sco', name: 'Scotland', confederation: 'UEFA', fifa_ranking: 39, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/gb-sct.png' },
  // Group D
  { id: 'usa', name: 'United States', confederation: 'CONCACAF', fifa_ranking: 13, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/us.png' },
  { id: 'par', name: 'Paraguay', confederation: 'CONMEBOL', fifa_ranking: 56, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/py.png' },
  { id: 'aus', name: 'Australia', confederation: 'AFC', fifa_ranking: 23, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/au.png' },
  { id: 'tur', name: 'Türkiye', confederation: 'UEFA', fifa_ranking: 40, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/tr.png' },
  // Group E
  { id: 'ger', name: 'Germany', confederation: 'UEFA', fifa_ranking: 16, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/de.png' },
  { id: 'cuw', name: 'Curaçao', confederation: 'CONCACAF', fifa_ranking: 91, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/cw.png' },
  { id: 'civ', name: 'Côte d\'Ivoire', confederation: 'CAF', fifa_ranking: 38, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/ci.png' },
  { id: 'ecu', name: 'Ecuador', confederation: 'CONMEBOL', fifa_ranking: 31, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/ec.png' },
  // Group F
  { id: 'ned', name: 'Netherlands', confederation: 'UEFA', fifa_ranking: 7, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/nl.png' },
  { id: 'jpn', name: 'Japan', confederation: 'AFC', fifa_ranking: 18, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/jp.png' },
  { id: 'tun', name: 'Tunisia', confederation: 'CAF', fifa_ranking: 41, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/tn.png' },
  { id: 'swe', name: 'Sweden', confederation: 'UEFA', fifa_ranking: 26, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/se.png' },
  // Group G
  { id: 'bel', name: 'Belgium', confederation: 'UEFA', fifa_ranking: 3, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/be.png' },
  { id: 'egy', name: 'Egypt', confederation: 'CAF', fifa_ranking: 36, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/eg.png' },
  { id: 'irn', name: 'Iran', confederation: 'AFC', fifa_ranking: 20, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/ir.png' },
  { id: 'nzl', name: 'New Zealand', confederation: 'OFC', fifa_ranking: 104, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/nz.png' },
  // Group H
  { id: 'esp', name: 'Spain', confederation: 'UEFA', fifa_ranking: 8, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/es.png' },
  { id: 'cpv', name: 'Cabo Verde', confederation: 'CAF', fifa_ranking: 65, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/cv.png' },
  { id: 'ksa', name: 'Saudi Arabia', confederation: 'AFC', fifa_ranking: 53, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/sa.png' },
  { id: 'uru', name: 'Uruguay', confederation: 'CONMEBOL', fifa_ranking: 15, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/uy.png' },
  // Group I
  { id: 'fra', name: 'France', confederation: 'UEFA', fifa_ranking: 2, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/fr.png' },
  { id: 'sen', name: 'Senegal', confederation: 'CAF', fifa_ranking: 17, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/sn.png' },
  { id: 'nor', name: 'Norway', confederation: 'UEFA', fifa_ranking: 46, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/no.png' },
  { id: 'irq', name: 'Iraq', confederation: 'AFC', fifa_ranking: 59, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/iq.png' },
  // Group J
  { id: 'arg', name: 'Argentina', confederation: 'CONMEBOL', fifa_ranking: 1, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/ar.png' },
  { id: 'dza', name: 'Algeria', confederation: 'CAF', fifa_ranking: 43, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/dz.png' },
  { id: 'aut', name: 'Austria', confederation: 'UEFA', fifa_ranking: 25, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/at.png' },
  { id: 'jor', name: 'Jordan', confederation: 'AFC', fifa_ranking: 70, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/jo.png' },
  // Group K
  { id: 'por', name: 'Portugal', confederation: 'UEFA', fifa_ranking: 6, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/pt.png' },
  { id: 'uzb', name: 'Uzbekistan', confederation: 'AFC', fifa_ranking: 66, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/uz.png' },
  { id: 'col', name: 'Colombia', confederation: 'CONMEBOL', fifa_ranking: 14, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/co.png' },
  { id: 'cod', name: 'Congo DR', confederation: 'CAF', fifa_ranking: 63, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/cd.png' },
  // Group L
  { id: 'eng', name: 'England', confederation: 'UEFA', fifa_ranking: 4, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/gb-eng.png' },
  { id: 'cro', name: 'Croatia', confederation: 'UEFA', fifa_ranking: 10, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/hr.png' },
  { id: 'gha', name: 'Ghana', confederation: 'CAF', fifa_ranking: 67, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/gh.png' },
  { id: 'pan', name: 'Panama', confederation: 'CONCACAF', fifa_ranking: 44, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/pa.png' },
];

async function seed() {
  console.log('Seeding all 48 Teams...');
  const { error: teamsErr } = await supabase.from('wc2026_teams').upsert(TEAMS);
  if (teamsErr) console.error('Error teams:', teamsErr);
  else console.log('48 Teams seeded successfully!');
}

seed();
