/**
 * MASTER UPDATE SCRIPT - WC2026 Database
 * Updates: Match results (ids 21-28 = June 17-18), Standings, Teams data
 * Run: node master_update.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import crypto from 'crypto';

const env = {};
fs.readFileSync('.env.local','utf-8').split('\n').forEach(l=>{
  if(l.includes('=')){const[k,...v]=l.split('=');env[k.trim()]=v.join('=').trim();}
});
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ─────────────────────────────────────────────
// 1. REAL MATCH RESULTS (based on Sofascore data June 17-18)
// IDs 21-28 are the ones that were "upcoming" but are now finished
// ─────────────────────────────────────────────
const finishedMatches = [
  // June 17 - Group K
  { id: 21, home_score: 1, away_score: 1 }, // Portugal vs DR Congo 1-1
  // June 17 - Group L  
  { id: 22, home_score: 4, away_score: 2 }, // England vs Croatia 4-2
  // June 17 - Group K
  { id: 23, home_score: 1, away_score: 3 }, // Uzbekistan vs Colombia 1-3
  // June 17 - Group L
  { id: 24, home_score: 1, away_score: 0 }, // Ghana vs Panama 1-0
  // June 18 - Group A (already started per Sofascore: Czechia 1-0 South Africa)
  { id: 28, home_score: 1, away_score: 0 }, // Czech Republic vs South Africa 1-0
];

// ─────────────────────────────────────────────
// 2. TEAMS DATA (48 teams with flags from flagcdn)
// ─────────────────────────────────────────────
const teamsData = [
  // Group A
  { name: 'Mexico', group_name: 'A', flag_url: 'https://flagcdn.com/w80/mx.png', fifa_code: 'MEX', confederation: 'CONCACAF', world_ranking: 15 },
  { name: 'South Korea', group_name: 'A', flag_url: 'https://flagcdn.com/w80/kr.png', fifa_code: 'KOR', confederation: 'AFC', world_ranking: 22 },
  { name: 'Czech Republic', group_name: 'A', flag_url: 'https://flagcdn.com/w80/cz.png', fifa_code: 'CZE', confederation: 'UEFA', world_ranking: 37 },
  { name: 'South Africa', group_name: 'A', flag_url: 'https://flagcdn.com/w80/za.png', fifa_code: 'RSA', confederation: 'CAF', world_ranking: 57 },
  // Group B
  { name: 'Canada', group_name: 'B', flag_url: 'https://flagcdn.com/w80/ca.png', fifa_code: 'CAN', confederation: 'CONCACAF', world_ranking: 43 },
  { name: 'Bosnia and Herzegovina', group_name: 'B', flag_url: 'https://flagcdn.com/w80/ba.png', fifa_code: 'BIH', confederation: 'UEFA', world_ranking: 59 },
  { name: 'Qatar', group_name: 'B', flag_url: 'https://flagcdn.com/w80/qa.png', fifa_code: 'QAT', confederation: 'AFC', world_ranking: 34 },
  { name: 'Switzerland', group_name: 'B', flag_url: 'https://flagcdn.com/w80/ch.png', fifa_code: 'SUI', confederation: 'UEFA', world_ranking: 19 },
  // Group C
  { name: 'Brazil', group_name: 'C', flag_url: 'https://flagcdn.com/w80/br.png', fifa_code: 'BRA', confederation: 'CONMEBOL', world_ranking: 5 },
  { name: 'Morocco', group_name: 'C', flag_url: 'https://flagcdn.com/w80/ma.png', fifa_code: 'MAR', confederation: 'CAF', world_ranking: 14 },
  { name: 'Haiti', group_name: 'C', flag_url: 'https://flagcdn.com/w80/ht.png', fifa_code: 'HAI', confederation: 'CONCACAF', world_ranking: 83 },
  { name: 'Scotland', group_name: 'C', flag_url: 'https://flagcdn.com/w80/gb-sct.png', fifa_code: 'SCO', confederation: 'UEFA', world_ranking: 39 },
  // Group D
  { name: 'United States', group_name: 'D', flag_url: 'https://flagcdn.com/w80/us.png', fifa_code: 'USA', confederation: 'CONCACAF', world_ranking: 11 },
  { name: 'Paraguay', group_name: 'D', flag_url: 'https://flagcdn.com/w80/py.png', fifa_code: 'PAR', confederation: 'CONMEBOL', world_ranking: 61 },
  { name: 'Australia', group_name: 'D', flag_url: 'https://flagcdn.com/w80/au.png', fifa_code: 'AUS', confederation: 'AFC', world_ranking: 23 },
  { name: 'Turkey', group_name: 'D', flag_url: 'https://flagcdn.com/w80/tr.png', fifa_code: 'TUR', confederation: 'UEFA', world_ranking: 40 },
  // Group E
  { name: 'Germany', group_name: 'E', flag_url: 'https://flagcdn.com/w80/de.png', fifa_code: 'GER', confederation: 'UEFA', world_ranking: 16 },
  { name: 'Ivory Coast', group_name: 'E', flag_url: 'https://flagcdn.com/w80/ci.png', fifa_code: 'CIV', confederation: 'CAF', world_ranking: 30 },
  { name: 'Ecuador', group_name: 'E', flag_url: 'https://flagcdn.com/w80/ec.png', fifa_code: 'ECU', confederation: 'CONMEBOL', world_ranking: 44 },
  { name: 'Curaçao', group_name: 'E', flag_url: 'https://flagcdn.com/w80/cw.png', fifa_code: 'CUW', confederation: 'CONCACAF', world_ranking: 77 },
  // Group F
  { name: 'Netherlands', group_name: 'F', flag_url: 'https://flagcdn.com/w80/nl.png', fifa_code: 'NED', confederation: 'UEFA', world_ranking: 7 },
  { name: 'Japan', group_name: 'F', flag_url: 'https://flagcdn.com/w80/jp.png', fifa_code: 'JPN', confederation: 'AFC', world_ranking: 18 },
  { name: 'Sweden', group_name: 'F', flag_url: 'https://flagcdn.com/w80/se.png', fifa_code: 'SWE', confederation: 'UEFA', world_ranking: 24 },
  { name: 'Tunisia', group_name: 'F', flag_url: 'https://flagcdn.com/w80/tn.png', fifa_code: 'TUN', confederation: 'CAF', world_ranking: 32 },
  // Group G
  { name: 'Belgium', group_name: 'G', flag_url: 'https://flagcdn.com/w80/be.png', fifa_code: 'BEL', confederation: 'UEFA', world_ranking: 4 },
  { name: 'Egypt', group_name: 'G', flag_url: 'https://flagcdn.com/w80/eg.png', fifa_code: 'EGY', confederation: 'CAF', world_ranking: 35 },
  { name: 'Iran', group_name: 'G', flag_url: 'https://flagcdn.com/w80/ir.png', fifa_code: 'IRN', confederation: 'AFC', world_ranking: 20 },
  { name: 'New Zealand', group_name: 'G', flag_url: 'https://flagcdn.com/w80/nz.png', fifa_code: 'NZL', confederation: 'OFC', world_ranking: 95 },
  // Group H
  { name: 'Spain', group_name: 'H', flag_url: 'https://flagcdn.com/w80/es.png', fifa_code: 'ESP', confederation: 'UEFA', world_ranking: 8 },
  { name: 'Cape Verde', group_name: 'H', flag_url: 'https://flagcdn.com/w80/cv.png', fifa_code: 'CPV', confederation: 'CAF', world_ranking: 47 },
  { name: 'Saudi Arabia', group_name: 'H', flag_url: 'https://flagcdn.com/w80/sa.png', fifa_code: 'KSA', confederation: 'AFC', world_ranking: 54 },
  { name: 'Uruguay', group_name: 'H', flag_url: 'https://flagcdn.com/w80/uy.png', fifa_code: 'URU', confederation: 'CONMEBOL', world_ranking: 17 },
  // Group I
  { name: 'France', group_name: 'I', flag_url: 'https://flagcdn.com/w80/fr.png', fifa_code: 'FRA', confederation: 'UEFA', world_ranking: 2 },
  { name: 'Senegal', group_name: 'I', flag_url: 'https://flagcdn.com/w80/sn.png', fifa_code: 'SEN', confederation: 'CAF', world_ranking: 21 },
  { name: 'Iraq', group_name: 'I', flag_url: 'https://flagcdn.com/w80/iq.png', fifa_code: 'IRQ', confederation: 'AFC', world_ranking: 68 },
  { name: 'Norway', group_name: 'I', flag_url: 'https://flagcdn.com/w80/no.png', fifa_code: 'NOR', confederation: 'UEFA', world_ranking: 28 },
  // Group J
  { name: 'Argentina', group_name: 'J', flag_url: 'https://flagcdn.com/w80/ar.png', fifa_code: 'ARG', confederation: 'CONMEBOL', world_ranking: 1 },
  { name: 'Algeria', group_name: 'J', flag_url: 'https://flagcdn.com/w80/dz.png', fifa_code: 'ALG', confederation: 'CAF', world_ranking: 52 },
  { name: 'Austria', group_name: 'J', flag_url: 'https://flagcdn.com/w80/at.png', fifa_code: 'AUT', confederation: 'UEFA', world_ranking: 25 },
  { name: 'Jordan', group_name: 'J', flag_url: 'https://flagcdn.com/w80/jo.png', fifa_code: 'JOR', confederation: 'AFC', world_ranking: 71 },
  // Group K
  { name: 'Portugal', group_name: 'K', flag_url: 'https://flagcdn.com/w80/pt.png', fifa_code: 'POR', confederation: 'UEFA', world_ranking: 6 },
  { name: 'Democratic Republic of the Congo', group_name: 'K', flag_url: 'https://flagcdn.com/w80/cd.png', fifa_code: 'COD', confederation: 'CAF', world_ranking: 60 },
  { name: 'Uzbekistan', group_name: 'K', flag_url: 'https://flagcdn.com/w80/uz.png', fifa_code: 'UZB', confederation: 'AFC', world_ranking: 63 },
  { name: 'Colombia', group_name: 'K', flag_url: 'https://flagcdn.com/w80/co.png', fifa_code: 'COL', confederation: 'CONMEBOL', world_ranking: 12 },
  // Group L
  { name: 'England', group_name: 'L', flag_url: 'https://flagcdn.com/w80/gb-eng.png', fifa_code: 'ENG', confederation: 'UEFA', world_ranking: 3 },
  { name: 'Croatia', group_name: 'L', flag_url: 'https://flagcdn.com/w80/hr.png', fifa_code: 'CRO', confederation: 'UEFA', world_ranking: 10 },
  { name: 'Ghana', group_name: 'L', flag_url: 'https://flagcdn.com/w80/gh.png', fifa_code: 'GHA', confederation: 'CAF', world_ranking: 65 },
  { name: 'Panama', group_name: 'L', flag_url: 'https://flagcdn.com/w80/pa.png', fifa_code: 'PAN', confederation: 'CONCACAF', world_ranking: 80 },
];

// ─────────────────────────────────────────────
// STEP 1: Update finished match results
// ─────────────────────────────────────────────
console.log('\n🔄 STEP 1: Updating match results...');
let matchesUpdated = 0;
for (const m of finishedMatches) {
  const { error } = await sb.from('wc2026_matches').update({
    home_score: m.home_score,
    away_score: m.away_score,
    status: 'finished'
  }).eq('id', m.id);
  if (error) {
    console.error(`  ❌ Match ${m.id}:`, error.message);
  } else {
    matchesUpdated++;
    console.log(`  ✅ Match ${m.id} updated: ${m.home_score}-${m.away_score}`);
  }
}
console.log(`  → Updated ${matchesUpdated} matches`);

// ─────────────────────────────────────────────
// STEP 2: Insert/upsert teams
// ─────────────────────────────────────────────
console.log('\n🔄 STEP 2: Upserting teams data...');
let teamsInserted = 0;
for (const team of teamsData) {
  // Try update first, then insert
  const { data: existing } = await sb.from('wc2026_teams').select('id').eq('name', team.name).maybeSingle();
  if (existing) {
    const { error } = await sb.from('wc2026_teams').update({
      group_name: team.group_name,
      flag_url: team.flag_url,
      fifa_code: team.fifa_code,
      confederation: team.confederation,
      world_ranking: team.world_ranking
    }).eq('id', existing.id);
    if (error) console.error(`  ❌ Update ${team.name}:`, error.message);
    else { teamsInserted++; console.log(`  ✅ Updated team: ${team.name}`); }
  } else {
    const { error } = await sb.from('wc2026_teams').insert({
      id: crypto.randomUUID(),
      ...team
    });
    if (error) console.error(`  ❌ Insert ${team.name}:`, error.message);
    else { teamsInserted++; console.log(`  ✅ Inserted team: ${team.name}`); }
  }
}
console.log(`  → Processed ${teamsInserted} teams`);

// ─────────────────────────────────────────────
// STEP 3: Recalculate ALL standings from finished matches
// ─────────────────────────────────────────────
console.log('\n🔄 STEP 3: Recalculating standings from all finished matches...');
const { data: allFinished, error: fetchErr } = await sb.from('wc2026_matches')
  .select('home_team, away_team, home_score, away_score, group_name')
  .eq('status', 'finished');

if (fetchErr) { console.error('Failed to fetch matches:', fetchErr); process.exit(1); }

const standings = {};
for (const m of allFinished) {
  const { home_team, away_team, home_score, away_score, group_name } = m;
  for (const [team, gn] of [[home_team, group_name], [away_team, group_name]]) {
    if (!standings[team]) standings[team] = { team, group_name: gn, played:0, won:0, drawn:0, lost:0, goals_for:0, goals_against:0, points:0 };
  }
  standings[home_team].played++; standings[away_team].played++;
  standings[home_team].goals_for += home_score; standings[home_team].goals_against += away_score;
  standings[away_team].goals_for += away_score; standings[away_team].goals_against += home_score;
  if (home_score > away_score) {
    standings[home_team].won++; standings[home_team].points += 3; standings[away_team].lost++;
  } else if (away_score > home_score) {
    standings[away_team].won++; standings[away_team].points += 3; standings[home_team].lost++;
  } else {
    standings[home_team].drawn++; standings[home_team].points++;
    standings[away_team].drawn++; standings[away_team].points++;
  }
}

let standingsUpdated = 0;
for (const s of Object.values(standings)) {
  s.updated_at = new Date().toISOString();
  const { data: existing } = await sb.from('wc_standings').select('id').eq('team', s.team).maybeSingle();
  let error;
  if (existing) {
    ({ error } = await sb.from('wc_standings').update(s).eq('id', existing.id));
  } else {
    s.id = crypto.randomUUID();
    ({ error } = await sb.from('wc_standings').insert(s));
  }
  if (error) console.error(`  ❌ Standings ${s.team}:`, error.message);
  else { standingsUpdated++; console.log(`  ✅ ${s.group_name} | ${s.team}: ${s.points}pts (${s.played}P ${s.won}W ${s.drawn}D ${s.lost}L)`); }
}
console.log(`  → Updated ${standingsUpdated} team standings`);

console.log('\n✅ ALL DONE! Database fully updated.');
