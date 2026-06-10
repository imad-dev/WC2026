-- Supabase SQL Editor script for WC2026 Teams and Players update

-- 1. Create the wc2026_players table if it doesn't exist
CREATE TABLE IF NOT EXISTS wc2026_players (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id text REFERENCES wc2026_teams(id),
  name text,
  number int,
  position text,
  photo_url text,
  api_player_id int
);

-- 2. Add new columns to wc2026_teams
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

-- 3. Apply kit colors and stats for the 48 teams
UPDATE wc2026_teams SET kit_primary_color = '#CE1126', is_host_country = true, world_ranking = 30, participations = 2 WHERE name = 'Canada';
UPDATE wc2026_teams SET kit_primary_color = '#006847', is_host_country = true, world_ranking = 15, participations = 17 WHERE name = 'Mexico';
UPDATE wc2026_teams SET kit_primary_color = '#002868', is_host_country = true, world_ranking = 16, participations = 11 WHERE name = 'USA';
UPDATE wc2026_teams SET kit_primary_color = '#007A3D', world_ranking = 28, participations = 4 WHERE name = 'Algeria';
UPDATE wc2026_teams SET kit_primary_color = '#74ACDF', world_ranking = 3, participations = 18 WHERE name = 'Argentina';
UPDATE wc2026_teams SET kit_primary_color = '#FFCD00', world_ranking = 27, participations = 6 WHERE name = 'Australia';
UPDATE wc2026_teams SET kit_primary_color = '#ED2939', world_ranking = 26, participations = 2 WHERE name = 'Austria';
UPDATE wc2026_teams SET kit_primary_color = '#000000', world_ranking = 3, participations = 14 WHERE name = 'Belgium';
UPDATE wc2026_teams SET kit_primary_color = '#002395', world_ranking = 19, participations = 1 WHERE name = 'Bosnia and Herzegovina';
UPDATE wc2026_teams SET kit_primary_color = '#009C3B', world_ranking = 5, participations = 22 WHERE name = 'Brazil';
UPDATE wc2026_teams SET kit_primary_color = '#003DA5', world_ranking = 22, participations = 3 WHERE name = 'Chile';
UPDATE wc2026_teams SET kit_primary_color = '#D4002A', world_ranking = 25, participations = 9 WHERE name = 'Costa Rica';
UPDATE wc2026_teams SET kit_primary_color = '#D4003B', world_ranking = 41, participations = 3 WHERE name = 'Croatia';
UPDATE wc2026_teams SET kit_primary_color = '#0D52A0', world_ranking = 40, participations = 3 WHERE name = 'Curaçao';
UPDATE wc2026_teams SET kit_primary_color = '#D7141A', world_ranking = 38, participations = 1 WHERE name = 'Czech Republic';
UPDATE wc2026_teams SET kit_primary_color = '#C8102E', world_ranking = 21, participations = 6 WHERE name = 'Denmark';
UPDATE wc2026_teams SET kit_primary_color = '#003F87', world_ranking = 48, participations = 1 WHERE name = 'Ecuador';
UPDATE wc2026_teams SET kit_primary_color = '#003399', world_ranking = 2, participations = 15 WHERE name = 'England';
UPDATE wc2026_teams SET kit_primary_color = '#002395', world_ranking = 2, participations = 15 WHERE name = 'France';
UPDATE wc2026_teams SET kit_primary_color = '#000000', world_ranking = 13, participations = 20 WHERE name = 'Germany';
UPDATE wc2026_teams SET kit_primary_color = '#003476', world_ranking = 35, participations = 1 WHERE name = 'Greece';
UPDATE wc2026_teams SET kit_primary_color = '#D21034', world_ranking = 55, participations = 1 WHERE name = 'Haiti';
UPDATE wc2026_teams SET kit_primary_color = '#436F4D', world_ranking = 44, participations = 4 WHERE name = 'Ivory Coast';
UPDATE wc2026_teams SET kit_primary_color = '#003580', world_ranking = 15, participations = 7 WHERE name = 'Japan';
UPDATE wc2026_teams SET kit_primary_color = '#DC143C', world_ranking = 60, participations = 3 WHERE name = 'Morocco';
UPDATE wc2026_teams SET kit_primary_color = '#FF6600', world_ranking = 7, participations = 11 WHERE name = 'Netherlands';
UPDATE wc2026_teams SET kit_primary_color = '#006600', world_ranking = 31, participations = 7 WHERE name = 'Nigeria';
UPDATE wc2026_teams SET kit_primary_color = '#D52B1E', world_ranking = 55, participations = 3 WHERE name = 'Paraguay';
UPDATE wc2026_teams SET kit_primary_color = '#006600', world_ranking = 14, participations = 8 WHERE name = 'Portugal';
UPDATE wc2026_teams SET kit_primary_color = '#8B0000', world_ranking = 35, participations = 2 WHERE name = 'Qatar';
UPDATE wc2026_teams SET kit_primary_color = '#002B7F', world_ranking = 23, participations = 16 WHERE name = 'Scotland';
UPDATE wc2026_teams SET kit_primary_color = '#007A33', world_ranking = 60, participations = 1 WHERE name = 'South Africa';
UPDATE wc2026_teams SET kit_primary_color = '#C60C30', world_ranking = 24, participations = 11 WHERE name = 'South Korea';
UPDATE wc2026_teams SET kit_primary_color = '#AA151B', world_ranking = 8, participations = 16 WHERE name = 'Spain';
UPDATE wc2026_teams SET kit_primary_color = '#006AA7', world_ranking = 25, participations = 13 WHERE name = 'Sweden';
UPDATE wc2026_teams SET kit_primary_color = '#FF0000', world_ranking = 14, participations = 12 WHERE name = 'Switzerland';
UPDATE wc2026_teams SET kit_primary_color = '#E30A17', world_ranking = 37, participations = 3 WHERE name = 'Turkey';
UPDATE wc2026_teams SET kit_primary_color = '#006400', world_ranking = 58, participations = 1 WHERE name = 'Tunisia';
UPDATE wc2026_teams SET kit_primary_color = '#005BBB', world_ranking = 18, participations = 3 WHERE name = 'Ukraine';
UPDATE wc2026_teams SET kit_primary_color = '#0038A8', world_ranking = 20, participations = 14 WHERE name = 'Uruguay';

-- 4. Apply mock player data to Canada so the UI has players to show
INSERT INTO wc2026_players (team_id, name, number, position, api_player_id)
SELECT id, 'Alphonso Davies', 19, 'DEF', 2298 FROM wc2026_teams WHERE name = 'Canada'
ON CONFLICT DO NOTHING;

INSERT INTO wc2026_players (team_id, name, number, position, api_player_id)
SELECT id, 'Dayne St. Clair', 1, 'GK', 18098 FROM wc2026_teams WHERE name = 'Canada'
ON CONFLICT DO NOTHING;

-- 5. Auto generate photo_urls
UPDATE wc2026_players SET photo_url = 'https://media.api-sports.io/football/players/' || api_player_id || '.png' WHERE api_player_id IS NOT NULL AND photo_url IS NULL;
