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
  { id: 'mex', name: 'Mexico', confederation: 'CONCACAF', fifa_ranking: 12, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/mx.png' },
  { id: 'arg', name: 'Argentina', confederation: 'CONMEBOL', fifa_ranking: 1, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/ar.png' },
  { id: 'cmr', name: 'Cameroon', confederation: 'CAF', fifa_ranking: 43, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/cm.png' },
  { id: 'kor', name: 'South Korea', confederation: 'AFC', fifa_ranking: 28, group_letter: 'A', flag_url: 'https://flagcdn.com/120x90/kr.png' },
  // Group B
  { id: 'can', name: 'Canada', confederation: 'CONCACAF', fifa_ranking: 45, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/ca.png' },
  { id: 'fra', name: 'France', confederation: 'UEFA', fifa_ranking: 2, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/fr.png' },
  { id: 'col', name: 'Colombia', confederation: 'CONMEBOL', fifa_ranking: 17, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/co.png' },
  { id: 'aus', name: 'Australia', confederation: 'AFC', fifa_ranking: 27, group_letter: 'B', flag_url: 'https://flagcdn.com/120x90/au.png' },
  // Group C
  { id: 'usa', name: 'United States', confederation: 'CONCACAF', fifa_ranking: 11, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/us.png' },
  { id: 'eng', name: 'England', confederation: 'UEFA', fifa_ranking: 4, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/gb-eng.png' },
  { id: 'sen', name: 'Senegal', confederation: 'CAF', fifa_ranking: 18, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/sn.png' },
  { id: 'jpn', name: 'Japan', confederation: 'AFC', fifa_ranking: 20, group_letter: 'C', flag_url: 'https://flagcdn.com/120x90/jp.png' },
  // Group D
  { id: 'bra', name: 'Brazil', confederation: 'CONMEBOL', fifa_ranking: 3, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/br.png' },
  { id: 'ned', name: 'Netherlands', confederation: 'UEFA', fifa_ranking: 6, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/nl.png' },
  { id: 'mar', name: 'Morocco', confederation: 'CAF', fifa_ranking: 13, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/ma.png' },
  { id: 'ecu', name: 'Ecuador', confederation: 'CONMEBOL', fifa_ranking: 40, group_letter: 'D', flag_url: 'https://flagcdn.com/120x90/ec.png' },
  // Group E
  { id: 'bel', name: 'Belgium', confederation: 'UEFA', fifa_ranking: 5, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/be.png' },
  { id: 'por', name: 'Portugal', confederation: 'UEFA', fifa_ranking: 9, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/pt.png' },
  { id: 'gha', name: 'Ghana', confederation: 'CAF', fifa_ranking: 59, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/gh.png' },
  { id: 'irn', name: 'Iran', confederation: 'AFC', fifa_ranking: 24, group_letter: 'E', flag_url: 'https://flagcdn.com/120x90/ir.png' },
  // Group F
  { id: 'esp', name: 'Spain', confederation: 'UEFA', fifa_ranking: 10, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/es.png' },
  { id: 'uru', name: 'Uruguay', confederation: 'CONMEBOL', fifa_ranking: 16, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/uy.png' },
  { id: 'nga', name: 'Nigeria', confederation: 'CAF', fifa_ranking: 39, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/ng.png' },
  { id: 'crc', name: 'Costa Rica', confederation: 'CONCACAF', fifa_ranking: 46, group_letter: 'F', flag_url: 'https://flagcdn.com/120x90/cr.png' },
  // Group G
  { id: 'ita', name: 'Italy', confederation: 'UEFA', fifa_ranking: 8, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/it.png' },
  { id: 'cro', name: 'Croatia', confederation: 'UEFA', fifa_ranking: 7, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/hr.png' },
  { id: 'civ', name: 'Ivory Coast', confederation: 'CAF', fifa_ranking: 47, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/ci.png' },
  { id: 'qat', name: 'Qatar', confederation: 'AFC', fifa_ranking: 61, group_letter: 'G', flag_url: 'https://flagcdn.com/120x90/qa.png' },
  // Group H
  { id: 'ger', name: 'Germany', confederation: 'UEFA', fifa_ranking: 14, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/de.png' },
  { id: 'sui', name: 'Switzerland', confederation: 'UEFA', fifa_ranking: 15, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/ch.png' },
  { id: 'dza', name: 'Algeria', confederation: 'CAF', fifa_ranking: 33, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/dz.png' },
  { id: 'pan', name: 'Panama', confederation: 'CONCACAF', fifa_ranking: 58, group_letter: 'H', flag_url: 'https://flagcdn.com/120x90/pa.png' },
  // Group I
  { id: 'den', name: 'Denmark', confederation: 'UEFA', fifa_ranking: 19, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/dk.png' },
  { id: 'per', name: 'Peru', confederation: 'CONMEBOL', fifa_ranking: 21, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/pe.png' },
  { id: 'mli', name: 'Mali', confederation: 'CAF', fifa_ranking: 50, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/ml.png' },
  { id: 'nzl', name: 'New Zealand', confederation: 'OFC', fifa_ranking: 105, group_letter: 'I', flag_url: 'https://flagcdn.com/120x90/nz.png' },
  // Group J
  { id: 'pol', name: 'Poland', confederation: 'UEFA', fifa_ranking: 23, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/pl.png' },
  { id: 'chi', name: 'Chile', confederation: 'CONMEBOL', fifa_ranking: 31, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/cl.png' },
  { id: 'egy', name: 'Egypt', confederation: 'CAF', fifa_ranking: 35, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/eg.png' },
  { id: 'ksa', name: 'Saudi Arabia', confederation: 'AFC', fifa_ranking: 54, group_letter: 'J', flag_url: 'https://flagcdn.com/120x90/sa.png' },
  // Group K
  { id: 'swe', name: 'Sweden', confederation: 'UEFA', fifa_ranking: 22, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/se.png' },
  { id: 'wal', name: 'Wales', confederation: 'UEFA', fifa_ranking: 26, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/gb-wls.png' },
  { id: 'tun', name: 'Tunisia', confederation: 'CAF', fifa_ranking: 29, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/tn.png' },
  { id: 'jam', name: 'Jamaica', confederation: 'CONCACAF', fifa_ranking: 63, group_letter: 'K', flag_url: 'https://flagcdn.com/120x90/jm.png' },
  // Group L
  { id: 'srb', name: 'Serbia', confederation: 'UEFA', fifa_ranking: 25, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/rs.png' },
  { id: 'hun', name: 'Hungary', confederation: 'UEFA', fifa_ranking: 36, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/hu.png' },
  { id: 'ven', name: 'Venezuela', confederation: 'CONMEBOL', fifa_ranking: 56, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/ve.png' },
  { id: 'irq', name: 'Iraq', confederation: 'AFC', fifa_ranking: 67, group_letter: 'L', flag_url: 'https://flagcdn.com/120x90/iq.png' },
];

async function seed() {
  console.log('Seeding all 48 Teams...');
  const { error: teamsErr } = await supabase.from('wc2026_teams').upsert(TEAMS);
  if (teamsErr) console.error('Error teams:', teamsErr);
  else console.log('48 Teams seeded successfully!');
}

seed();
