import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import crypto from 'crypto';

const env = {};
const envStr = fs.readFileSync('.env.local', 'utf-8');
for (const line of envStr.split('\n')) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    env[k.trim()] = v.trim();
  }
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function calculateStandings() {
  console.log("Fetching matches...");
  const { data: matches, error: matchError } = await supabase
    .from('wc2026_matches')
    .select('*')
    .eq('status', 'finished');
    
  if (matchError) {
    console.error("Error fetching matches:", matchError);
    return;
  }
  
  console.log(`Found ${matches.length} finished matches. Calculating standings...`);
  
  const standings = {};
  
  for (const match of matches) {
    const { home_team, away_team, home_score, away_score, group_name } = match;
    
    if (!standings[home_team]) {
      standings[home_team] = {
        team: home_team,
        group_name: group_name,
        played: 0, won: 0, drawn: 0, lost: 0,
        goals_for: 0, goals_against: 0, goal_diff: 0, points: 0
      };
    }
    if (!standings[away_team]) {
      standings[away_team] = {
        team: away_team,
        group_name: group_name,
        played: 0, won: 0, drawn: 0, lost: 0,
        goals_for: 0, goals_against: 0, goal_diff: 0, points: 0
      };
    }
    
    standings[home_team].played++;
    standings[away_team].played++;
    
    standings[home_team].goals_for += home_score;
    standings[home_team].goals_against += away_score;
    
    standings[away_team].goals_for += away_score;
    standings[away_team].goals_against += home_score;
    
    if (home_score > away_score) {
      standings[home_team].won++;
      standings[home_team].points += 3;
      standings[away_team].lost++;
    } else if (away_score > home_score) {
      standings[away_team].won++;
      standings[away_team].points += 3;
      standings[home_team].lost++;
    } else {
      standings[home_team].drawn++;
      standings[home_team].points += 1;
      standings[away_team].drawn++;
      standings[away_team].points += 1;
    }
  }
  
  // Calculate goal differences (actually, we should remove goal_diff because it's a generated column in Supabase)
  Object.values(standings).forEach(s => {
    delete s.goal_diff;
    s.updated_at = new Date().toISOString();
  });
  
  const standingsArray = Object.values(standings);
  console.log(`Calculated standings for ${standingsArray.length} teams.`);
  
  // Upsert into wc_standings
  // First, we need to clear or upsert. Upsert requires a unique key.
  // Assuming 'team' or 'id' is unique. Let's check if the table exists and structure.
  
  for (const s of standingsArray) {
    const { data: existing } = await supabase.from('wc_standings').select('id').eq('team', s.team).single();
    if (existing) {
      s.id = existing.id;
      const { error } = await supabase.from('wc_standings').update(s).eq('id', s.id);
      if (error) console.error("Error updating", s.team, error);
    } else {
      s.id = crypto.randomUUID();
      const { error } = await supabase.from('wc_standings').insert(s);
      if (error) console.error("Error inserting", s.team, error);
    }
  }
  
  console.log("Done updating standings!");
}

calculateStandings();
