/**
 * Upload all squad data from squads.json to Supabase.
 * Adds missing columns via ALTER TABLE if needed, then inserts all players.
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import crypto from 'crypto';

const env = {};
fs.readFileSync('.env.local','utf-8').split('\n').forEach(l=>{
  if(l.includes('=')){const[k,...v]=l.split('=');env[k.trim()]=v.join('=').trim();}
});
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const squads = JSON.parse(fs.readFileSync('squads.json','utf-8'));

// DB name normalization: PDF names → our DB names
const NAME_MAP = {
  'Algeria': 'Algeria', 'Argentina': 'Argentina', 'Australia': 'Australia',
  'Austria': 'Austria', 'Belgium': 'Belgium', 'Brazil': 'Brazil',
  'Canada': 'Canada', 'Colombia': 'Colombia', 'Croatia': 'Croatia',
  'Curaçao': 'Curaçao', 'Ecuador': 'Ecuador', 'Egypt': 'Egypt',
  'England': 'England', 'France': 'France', 'Germany': 'Germany',
  'Ghana': 'Ghana', 'Haiti': 'Haiti', 'Iraq': 'Iraq', 'Japan': 'Japan',
  'Jordan': 'Jordan', 'Korea Republic': 'South Korea', 'Mexico': 'Mexico',
  'Morocco': 'Morocco', 'Netherlands': 'Netherlands', 'New Zealand': 'New Zealand',
  'Norway': 'Norway', 'Panama': 'Panama', 'Paraguay': 'Paraguay',
  'Portugal': 'Portugal', 'Qatar': 'Qatar', 'Saudi Arabia': 'Saudi Arabia',
  'Scotland': 'Scotland', 'Senegal': 'Senegal', 'South Africa': 'South Africa',
  'Spain': 'Spain', 'Sweden': 'Sweden', 'Switzerland': 'Switzerland',
  'Tunisia': 'Tunisia', 'Türkiye': 'Turkey', 'Uruguay': 'Uruguay',
  'USA': 'United States', 'Uzbekistan': 'Uzbekistan',
};

// Step 1: Get all teams from DB
console.log('📥 Fetching teams from DB...');
const { data: teams, error: teamErr } = await sb.from('wc2026_teams').select('id,name');
if (teamErr) { console.error('Failed to fetch teams:', teamErr); process.exit(1); }
const teamMap = {};
for (const t of teams) teamMap[t.name] = t.id;
console.log(`  Found ${teams.length} teams in DB`);

// Step 2: Clear existing players to avoid duplicates
console.log('🗑️  Clearing existing players...');
const { error: delErr } = await sb.from('wc2026_players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
if (delErr) console.warn('  Delete warning:', delErr.message);
else console.log('  Players cleared');

// Step 3: Insert all players
console.log('\n🔄 Inserting players...');
let totalInserted = 0;
let notFound = [];

for (const [pdfName, squadData] of Object.entries(squads)) {
  const dbName = NAME_MAP[pdfName] || pdfName;
  const teamId = teamMap[dbName];
  
  if (!teamId) {
    notFound.push(pdfName);
    console.warn(`  ⚠️  Team not found in DB: ${pdfName} → ${dbName}`);
    continue;
  }
  
  // Deduplicate by jersey number (take first occurrence)
  const seen = new Set();
  const uniquePlayers = [];
  for (const p of squadData.players) {
    if (!seen.has(p.number)) {
      seen.add(p.number);
      uniquePlayers.push(p);
    }
  }
  
  // Keep only first 26 players (FIFA squad size)
  const players = uniquePlayers.slice(0, 26);
  
  const rows = players.map(p => ({
    id: crypto.randomUUID(),
    team_id: teamId,
    name: p.name,
    number: p.number,
    position: p.position,
    photo_url: null,
    api_player_id: null,
  }));
  
  const { error: insertErr } = await sb.from('wc2026_players').insert(rows);
  if (insertErr) {
    console.error(`  ❌ ${dbName}: ${insertErr.message}`);
  } else {
    totalInserted += rows.length;
    console.log(`  ✅ ${dbName}: ${rows.length} players`);
  }
}

console.log(`\n✅ Done! Inserted ${totalInserted} players total`);
if (notFound.length) console.log(`\n⚠️  Not found in DB: ${notFound.join(', ')}`);
