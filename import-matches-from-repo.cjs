const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) acc[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const matchesRaw = JSON.parse(fs.readFileSync('/tmp/wc2026repo/football.matches.json', 'utf8'));
const teamsRaw = JSON.parse(fs.readFileSync('/tmp/wc2026repo/football.teams.json', 'utf8'));
const stadiumsRaw = JSON.parse(fs.readFileSync('/tmp/wc2026repo/football.stadiums.json', 'utf8'));

const teamMap = {};
teamsRaw.forEach(t => teamMap[t.id] = t.name_en);
// For Knockouts, there are placeholders like "Winner Group A". The DB should have generic names or TBD
// Wait, football.teams.json has 48 teams.

const stadiumMap = {};
stadiumsRaw.forEach(s => stadiumMap[s.id] = s.name_en);

async function main() {
  console.log('Fetching existing matches to map IDs...');
  const { data: existingMatches } = await supabase.from('wc2026_matches').select('id, match_number');
  
  if (!existingMatches || existingMatches.length === 0) {
    console.log('No existing matches found to update.');
    return;
  }

  const updates = [];
  for (const m of matchesRaw) {
    const matchNumber = parseInt(m.id);
    const homeTeam = teamMap[m.home_team_id] || "TBD";
    const awayTeam = teamMap[m.away_team_id] || "TBD";
    const venue = stadiumMap[m.stadium_id] || "TBD";
    const groupName = m.group && m.group.length <= 2 ? m.group : null;
    
    // Parse local_date (e.g. "06/11/2026 13:00")
    // Assuming EDT or just generic format
    const [datePart, timePart] = m.local_date.split(' ');
    const kickoff_utc = new Date(`${datePart} ${timePart} UTC`).toISOString();

    const existingMatch = existingMatches.find(em => em.match_number === matchNumber);
    if (existingMatch) {
      updates.push({
        id: existingMatch.id,
        match_number: matchNumber,
        group_name: groupName,
        home_team: homeTeam,
        away_team: awayTeam,
        venue: venue,
        kickoff_utc: kickoff_utc
      });
    }
  }

  console.log(`Updating ${updates.length} matches with accurate venues from the repo...`);
  
  // Supabase upsert
  const { error } = await supabase.from('wc2026_matches').upsert(updates);
  if (error) {
    console.error('Error updating matches:', error);
  } else {
    console.log('Successfully updated matches!');
  }
}

main();
