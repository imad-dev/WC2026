import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sql = `
CREATE TABLE IF NOT EXISTS wc2026_players (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES wc2026_teams(id),
  name text,
  number int,
  position text,
  photo_url text,
  api_player_id int
);

ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS kit_primary_color text;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS kit_secondary_color text;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS is_host_country boolean DEFAULT false;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS world_ranking int;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS participations int;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS founded_year int;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS confederation_full text;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS bio_short text;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS social_instagram text;
ALTER TABLE wc2026_teams ADD COLUMN IF NOT EXISTS social_twitter text;

UPDATE wc2026_teams SET kit_primary_color = '#CE1126', is_host_country = true, world_ranking = 30, participations = 2 WHERE short_name = 'CAN';
UPDATE wc2026_teams SET kit_primary_color = '#006847', is_host_country = true, world_ranking = 15, participations = 17 WHERE short_name = 'MEX';
UPDATE wc2026_teams SET kit_primary_color = '#002868', is_host_country = true, world_ranking = 16, participations = 11 WHERE short_name = 'USA';
UPDATE wc2026_teams SET kit_primary_color = '#007A3D', world_ranking = 28, participations = 4 WHERE short_name = 'ALG';
UPDATE wc2026_teams SET kit_primary_color = '#74ACDF', world_ranking = 3, participations = 18 WHERE short_name = 'ARG';
UPDATE wc2026_teams SET kit_primary_color = '#FFCD00', world_ranking = 27, participations = 6 WHERE short_name = 'AUS';
UPDATE wc2026_teams SET kit_primary_color = '#ED2939', world_ranking = 26, participations = 2 WHERE short_name = 'AUT';
UPDATE wc2026_teams SET kit_primary_color = '#000000', world_ranking = 3, participations = 14 WHERE short_name = 'BEL';
UPDATE wc2026_teams SET kit_primary_color = '#002395', world_ranking = 19, participations = 1 WHERE short_name = 'BIH';
UPDATE wc2026_teams SET kit_primary_color = '#009C3B', world_ranking = 5, participations = 22 WHERE short_name = 'BRA';
UPDATE wc2026_teams SET kit_primary_color = '#003DA5', world_ranking = 22, participations = 3 WHERE short_name = 'CHI';
UPDATE wc2026_teams SET kit_primary_color = '#D4002A', world_ranking = 25, participations = 9 WHERE short_name = 'CRC';
UPDATE wc2026_teams SET kit_primary_color = '#D4003B', world_ranking = 41, participations = 3 WHERE short_name = 'CRO';
UPDATE wc2026_teams SET kit_primary_color = '#0D52A0', world_ranking = 40, participations = 3 WHERE short_name = 'CUW';
UPDATE wc2026_teams SET kit_primary_color = '#D7141A', world_ranking = 38, participations = 1 WHERE short_name = 'CZE';
UPDATE wc2026_teams SET kit_primary_color = '#C8102E', world_ranking = 21, participations = 6 WHERE short_name = 'DEN';
UPDATE wc2026_teams SET kit_primary_color = '#003F87', world_ranking = 48, participations = 1 WHERE short_name = 'ECU';
UPDATE wc2026_teams SET kit_primary_color = '#003399', world_ranking = 2, participations = 15 WHERE short_name = 'ENG';
UPDATE wc2026_teams SET kit_primary_color = '#002395', world_ranking = 2, participations = 15 WHERE short_name = 'FRA';
UPDATE wc2026_teams SET kit_primary_color = '#000000', world_ranking = 13, participations = 20 WHERE short_name = 'GER';
UPDATE wc2026_teams SET kit_primary_color = '#003476', world_ranking = 35, participations = 1 WHERE short_name = 'GRE';
UPDATE wc2026_teams SET kit_primary_color = '#D21034', world_ranking = 55, participations = 1 WHERE short_name = 'HAI';
UPDATE wc2026_teams SET kit_primary_color = '#436F4D', world_ranking = 44, participations = 4 WHERE short_name = 'IVO';
UPDATE wc2026_teams SET kit_primary_color = '#003580', world_ranking = 15, participations = 7 WHERE short_name = 'JPN';
UPDATE wc2026_teams SET kit_primary_color = '#DC143C', world_ranking = 60, participations = 3 WHERE short_name = 'MAR';
UPDATE wc2026_teams SET kit_primary_color = '#FF6600', world_ranking = 7, participations = 11 WHERE short_name = 'NED';
UPDATE wc2026_teams SET kit_primary_color = '#006600', world_ranking = 31, participations = 7 WHERE short_name = 'NGA';
UPDATE wc2026_teams SET kit_primary_color = '#D52B1E', world_ranking = 55, participations = 3 WHERE short_name = 'PAR';
UPDATE wc2026_teams SET kit_primary_color = '#006600', world_ranking = 14, participations = 8 WHERE short_name = 'POR';
UPDATE wc2026_teams SET kit_primary_color = '#8B0000', world_ranking = 35, participations = 2 WHERE short_name = 'QAT';
UPDATE wc2026_teams SET kit_primary_color = '#002B7F', world_ranking = 23, participations = 16 WHERE short_name = 'SCO';
UPDATE wc2026_teams SET kit_primary_color = '#007A33', world_ranking = 60, participations = 1 WHERE short_name = 'RSA';
UPDATE wc2026_teams SET kit_primary_color = '#C60C30', world_ranking = 24, participations = 11 WHERE short_name = 'KOR';
UPDATE wc2026_teams SET kit_primary_color = '#AA151B', world_ranking = 8, participations = 16 WHERE short_name = 'ESP';
UPDATE wc2026_teams SET kit_primary_color = '#006AA7', world_ranking = 25, participations = 13 WHERE short_name = 'SWE';
UPDATE wc2026_teams SET kit_primary_color = '#FF0000', world_ranking = 14, participations = 12 WHERE short_name = 'SUI';
UPDATE wc2026_teams SET kit_primary_color = '#E30A17', world_ranking = 37, participations = 3 WHERE short_name = 'TUR';
UPDATE wc2026_teams SET kit_primary_color = '#006400', world_ranking = 58, participations = 1 WHERE short_name = 'TUN';
UPDATE wc2026_teams SET kit_primary_color = '#005BBB', world_ranking = 18, participations = 3 WHERE short_name = 'UKR';
UPDATE wc2026_teams SET kit_primary_color = '#0038A8', world_ranking = 20, participations = 14 WHERE short_name = 'URU';

ALTER TABLE wc2026_players ADD COLUMN IF NOT EXISTS api_player_id int;

UPDATE wc2026_players SET api_player_id = 18098 WHERE name LIKE '%Clair%';
UPDATE wc2026_players SET api_player_id = 2298 WHERE name LIKE '%Johnston%';
UPDATE wc2026_players SET photo_url = 'https://media.api-sports.io/football/players/' || api_player_id || '.png' WHERE api_player_id IS NOT NULL AND photo_url IS NULL;

-- Also let's insert a few mock players for Canada since they probably don't exist
INSERT INTO wc2026_players (team_id, name, number, position, api_player_id) 
SELECT id, 'Alphonso Davies', 19, 'DEF', 2298 FROM wc2026_teams WHERE short_name = 'CAN' 
ON CONFLICT DO NOTHING;

`;

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) console.log("RPC Error:", error);
  else console.log("Success:", data);
}
run();
