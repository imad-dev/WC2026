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
  { name: 'Mexico', group: 'A' }, { name: 'South Africa', group: 'A' }, { name: 'South Korea', group: 'A' }, { name: 'Czechia', group: 'A' },
  // Group B
  { name: 'Canada', group: 'B' }, { name: 'Bosnia and Herzegovina', group: 'B' }, { name: 'Qatar', group: 'B' }, { name: 'Switzerland', group: 'B' },
  // Group C
  { name: 'Brazil', group: 'C' }, { name: 'Morocco', group: 'C' }, { name: 'Haiti', group: 'C' }, { name: 'Scotland', group: 'C' },
  // Group D
  { name: 'United States', group: 'D' }, { name: 'Paraguay', group: 'D' }, { name: 'Australia', group: 'D' }, { name: 'Türkiye', group: 'D' },
  // Group E
  { name: 'Germany', group: 'E' }, { name: 'Curaçao', group: 'E' }, { name: "Côte d'Ivoire", group: 'E' }, { name: 'Ecuador', group: 'E' },
  // Group F
  { name: 'Netherlands', group: 'F' }, { name: 'Japan', group: 'F' }, { name: 'Sweden', group: 'F' }, { name: 'Tunisia', group: 'F' },
  // Group G
  { name: 'Belgium', group: 'G' }, { name: 'Egypt', group: 'G' }, { name: 'Iran', group: 'G' }, { name: 'New Zealand', group: 'G' },
  // Group H
  { name: 'Spain', group: 'H' }, { name: 'Cabo Verde', group: 'H' }, { name: 'Saudi Arabia', group: 'H' }, { name: 'Uruguay', group: 'H' },
  // Group I
  { name: 'France', group: 'I' }, { name: 'Senegal', group: 'I' }, { name: 'Iraq', group: 'I' }, { name: 'Norway', group: 'I' },
  // Group J
  { name: 'Argentina', group: 'J' }, { name: 'Algeria', group: 'J' }, { name: 'Austria', group: 'J' }, { name: 'Jordan', group: 'J' },
  // Group K
  { name: 'Portugal', group: 'K' }, { name: 'Congo DR', group: 'K' }, { name: 'Uzbekistan', group: 'K' }, { name: 'Colombia', group: 'K' },
  // Group L
  { name: 'England', group: 'L' }, { name: 'Croatia', group: 'L' }, { name: 'Ghana', group: 'L' }, { name: 'Panama', group: 'L' }
];

async function seedMatches() {
  console.log('Clearing old matches...');
  await supabase.from('wc2026_matches').delete().neq('id', 0); // Clear all existing

  const matches = [];
  let matchId = 1;

  // Generate Group Stage Matches (72 matches)
  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  
  let date = new Date('2026-06-11T12:00:00Z');

  for (const group of groups) {
    const groupTeams = TEAMS.filter(t => t.group === group);
    if (groupTeams.length === 4) {
      const [t1, t2, t3, t4] = groupTeams;
      
      matches.push({
        id: matchId, match_number: matchId++, group_name: group, home_team: t1.name, away_team: t2.name,
        kickoff_utc: new Date(date.getTime() + 1000 * 3600 * 24 * 0).toISOString(), venue: 'MetLife Stadium', status: 'upcoming'
      });
      matches.push({
        id: matchId, match_number: matchId++, group_name: group, home_team: t3.name, away_team: t4.name,
        kickoff_utc: new Date(date.getTime() + 1000 * 3600 * 24 * 1).toISOString(), venue: 'Estadio Azteca', status: 'upcoming'
      });
      matches.push({
        id: matchId, match_number: matchId++, group_name: group, home_team: t1.name, away_team: t3.name,
        kickoff_utc: new Date(date.getTime() + 1000 * 3600 * 24 * 5).toISOString(), venue: 'BMO Field', status: 'upcoming'
      });
      matches.push({
        id: matchId, match_number: matchId++, group_name: group, home_team: t4.name, away_team: t2.name,
        kickoff_utc: new Date(date.getTime() + 1000 * 3600 * 24 * 6).toISOString(), venue: 'MetLife Stadium', status: 'upcoming'
      });
      matches.push({
        id: matchId, match_number: matchId++, group_name: group, home_team: t4.name, away_team: t1.name,
        kickoff_utc: new Date(date.getTime() + 1000 * 3600 * 24 * 10).toISOString(), venue: 'Estadio Azteca', status: 'upcoming'
      });
      matches.push({
        id: matchId, match_number: matchId++, group_name: group, home_team: t2.name, away_team: t3.name,
        kickoff_utc: new Date(date.getTime() + 1000 * 3600 * 24 * 11).toISOString(), venue: 'BMO Field', status: 'upcoming'
      });
    }
  }

  // Generate 32 Knockout Matches mock
  for (let i = 0; i < 32; i++) {
    matches.push({
      id: matchId, match_number: matchId++, group_name: null, home_team: `TBD Home ${i+1}`, away_team: `TBD Away ${i+1}`,
      kickoff_utc: new Date(date.getTime() + 1000 * 3600 * 24 * (15 + i)).toISOString(), venue: 'TBD', status: 'upcoming'
    });
  }

  console.log(`Seeding ${matches.length} matches...`);
  
  // Insert in batches of 50
  for (let i = 0; i < matches.length; i += 50) {
    const batch = matches.slice(i, i + 50);
    const { error } = await supabase.from('wc2026_matches').insert(batch);
    if (error) console.error('Error inserting matches batch:', error);
  }

  console.log('Done!');
}

seedMatches();
