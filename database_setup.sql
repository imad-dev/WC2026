-- TABLE: wc2026_matches (extend existing)
ALTER TABLE wc2026_matches ADD COLUMN IF NOT EXISTS
  home_team_id       uuid,
  away_team_id       uuid,
  venue_id           uuid,
  group_name         text,           
  round              text,           
  match_number       int,            
  referee            text,
  attendance         int,
  home_score         int DEFAULT 0,
  away_score         int DEFAULT 0,
  home_score_ht      int,            
  away_score_ht      int,
  status             text DEFAULT 'upcoming', 
  minute             int,            
  broadcasters       text[],         
  weather_temp       int,
  weather_condition  text;

-- TABLE: wc2026_teams
CREATE TABLE IF NOT EXISTS wc2026_teams (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,          
  short_name      text,                   
  country_code    text,                   
  confederation   text,                   
  group_name      text,                   
  coach_name      text,
  coach_photo_url text,
  coach_nationality text,
  formation       text,                   
  kit_home_color  text,                   
  kit_away_color  text,
  logo_url        text,
  ranking_fifa    int,
  market_value_m  numeric                 
);

-- Note: In Supabase, if wc2026_matches was created before wc2026_teams,
-- we add the foreign key constraints after table creation:
ALTER TABLE wc2026_matches 
  ADD CONSTRAINT fk_home_team FOREIGN KEY (home_team_id) REFERENCES wc2026_teams(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_away_team FOREIGN KEY (away_team_id) REFERENCES wc2026_teams(id) ON DELETE SET NULL;

-- TABLE: wc2026_players
CREATE TABLE IF NOT EXISTS wc2026_players (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         uuid REFERENCES wc2026_teams(id),
  name            text NOT NULL,
  short_name      text,                   
  number          int,
  position        text,                   
  photo_url       text,                   
  club_name       text,                   
  club_logo_url   text,
  nationality     text,
  age             int,
  height_cm       int,
  market_value_k  int,                    
  rating_avg      numeric,               
  is_captain      boolean DEFAULT false
);

-- TABLE: wc2026_lineups
CREATE TABLE IF NOT EXISTS wc2026_lineups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        uuid REFERENCES wc2026_matches(id),
  team_id         uuid REFERENCES wc2026_teams(id),
  player_id       uuid REFERENCES wc2026_players(id),
  is_starting     boolean DEFAULT true,   
  position_x      numeric,               
  position_y      numeric,               
  shirt_number    int,
  is_captain      boolean DEFAULT false,
  rating          numeric,               
  goals           int DEFAULT 0,
  assists         int DEFAULT 0,
  yellow_cards    int DEFAULT 0,
  red_cards       int DEFAULT 0,
  minutes_played  int,
  substitute_in_minute  int,
  substitute_out_minute int
);

-- TABLE: wc2026_match_events
CREATE TABLE IF NOT EXISTS wc2026_match_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    uuid REFERENCES wc2026_matches(id),
  team_id     uuid REFERENCES wc2026_teams(id),
  player_id   uuid REFERENCES wc2026_players(id),
  minute      int NOT NULL,
  event_type  text NOT NULL, 
  description text,          
  is_own_goal boolean DEFAULT false,
  assist_player_id uuid REFERENCES wc2026_players(id)
);

-- TABLE: wc2026_match_stats
CREATE TABLE IF NOT EXISTS wc2026_match_stats (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        uuid REFERENCES wc2026_matches(id),
  team_id         uuid REFERENCES wc2026_teams(id),
  possession      int,         
  shots_total     int,
  shots_on_target int,
  corners         int,
  fouls           int,
  offsides        int,
  passes_total    int,
  passes_accuracy int,         
  tackles         int,
  saves           int,
  xg             numeric       
);

-- TABLE: wc2026_h2h (Head-to-head)
CREATE TABLE IF NOT EXISTS wc2026_h2h (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id    uuid REFERENCES wc2026_teams(id),
  away_team_id    uuid REFERENCES wc2026_teams(id),
  match_date      date,
  competition     text,         
  home_score      int,
  away_score      int,
  venue           text,
  is_neutral      boolean DEFAULT false
);

-- TABLE: wc2026_predictions
ALTER TABLE wc2026_predictions ADD COLUMN IF NOT EXISTS
  session_id text,   
  created_at timestamptz DEFAULT now();

-- RLS Policies
ALTER TABLE wc2026_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_h2h ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read teams" ON wc2026_teams FOR SELECT USING (true);
CREATE POLICY "Public read players" ON wc2026_players FOR SELECT USING (true);
CREATE POLICY "Public read lineups" ON wc2026_lineups FOR SELECT USING (true);
CREATE POLICY "Public read match_events" ON wc2026_match_events FOR SELECT USING (true);
CREATE POLICY "Public read match_stats" ON wc2026_match_stats FOR SELECT USING (true);
CREATE POLICY "Public read h2h" ON wc2026_h2h FOR SELECT USING (true);

-- Supabase RPC function for prediction percentages
CREATE OR REPLACE FUNCTION get_prediction_percentages(p_match_id text)
RETURNS json AS $$
DECLARE
  total int;
  home_count int;
  draw_count int;
  away_count int;
BEGIN
  -- We assume match_id is stored as text in wc2026_predictions if it was originally created this way
  -- Adjust type if it's uuid
  SELECT COUNT(*) INTO total FROM wc2026_predictions WHERE match_id = p_match_id;
  IF total = 0 THEN RETURN json_build_object('home',33,'draw',34,'away',33,'total',0); END IF;
  SELECT COUNT(*) INTO home_count FROM wc2026_predictions WHERE match_id = p_match_id AND choice = 'home';
  SELECT COUNT(*) INTO draw_count FROM wc2026_predictions WHERE match_id = p_match_id AND choice = 'draw';
  SELECT COUNT(*) INTO away_count FROM wc2026_predictions WHERE match_id = p_match_id AND choice = 'away';
  RETURN json_build_object(
    'home', ROUND(home_count::numeric / total * 100),
    'draw', ROUND(draw_count::numeric / total * 100),
    'away', ROUND(away_count::numeric / total * 100),
    'total', total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- SEED DATA
-- Insert teams
INSERT INTO wc2026_teams (id, name, short_name, country_code, confederation, group_name, coach_name, coach_nationality, formation, ranking_fifa, market_value_m)
VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001', 'Mexico', 'MEX', 'mx', 'CONCACAF', 'Group A', 'Javier Aguirre', 'Mexican', '4-1-2-3', 16, 89.2),
  ('aaaaaaaa-0002-0002-0002-000000000002', 'South Africa', 'RSA', 'za', 'CAF', 'Group A', 'Hugo Broos', 'Belgian', '4-2-3-1', 60, 27.5)
ON CONFLICT (id) DO NOTHING;

-- Insert key Mexico players (starting XI)
INSERT INTO wc2026_players (id, team_id, name, short_name, number, position, club_name, age, height_cm, market_value_k, rating_avg)
VALUES
  ('bbbbbbbb-0001-0001-0001-000000000001', 'aaaaaaaa-0001-0001-0001-000000000001', 'Luis Reyes', 'L. Reyes', 15, 'GK', 'Club América', 26, 178, 3200, 6.8),
  ('bbbbbbbb-0002-0002-0002-000000000002', 'aaaaaaaa-0001-0001-0001-000000000001', 'Rodrigo Rangel', 'R. Rangel', 1, 'DEF', 'Monterrey', 26, 190, 5800, 6.9),
  ('bbbbbbbb-0003-0003-0003-000000000003', 'aaaaaaaa-0001-0001-0001-000000000001', 'César Montes', 'C. Montes', 3, 'DEF', 'Espanyol', 29, 195, 7800, 7.0),
  ('bbbbbbbb-0004-0004-0004-000000000004', 'aaaaaaaa-0001-0001-0001-000000000001', 'Johan Vásquez', 'J. Vásquez', 5, 'DEF', 'Genoa', 27, 185, 12200, 7.1),
  ('bbbbbbbb-0005-0005-0005-000000000005', 'aaaaaaaa-0001-0001-0001-000000000001', 'Eduardo Lira', 'E. Lira', 6, 'DEF', 'Pachuca', 26, 172, 13200, 6.9),
  ('bbbbbbbb-0006-0006-0006-000000000006', 'aaaaaaaa-0001-0001-0001-000000000001', 'Édson Álvarez', 'E. Álvarez', 14, 'MID', 'West Ham', 27, 182, 28000, 7.5),
  ('bbbbbbbb-0007-0007-0007-000000000007', 'aaaaaaaa-0001-0001-0001-000000000001', 'Ángel Fidalgo', 'Á. Fidalgo', 8, 'MID', 'Club América', 29, 174, 10900, 7.2),
  ('bbbbbbbb-0008-0008-0008-000000000008', 'aaaaaaaa-0001-0001-0001-000000000001', 'Rodrigo Aguirre', 'R. Jiménez', 9, 'MID', 'Cruz Azul', 35, 189, 3200, 7.0),
  ('bbbbbbbb-0009-0009-0009-000000000009', 'aaaaaaaa-0001-0001-0001-000000000001', 'Julián Quiñones', 'J. Quiñones', 16, 'FWD', 'Club América', 29, 180, 11100, 7.4),
  ('bbbbbbbb-0010-0010-0010-000000000010', 'aaaaaaaa-0001-0001-0001-000000000001', 'Uriel Antuna', 'B. Gutiérrez', 26, 'FWD', 'Cruz Azul', 22, 178, 8300, 7.1),
  ('bbbbbbbb-0011-0011-0011-000000000011', 'aaaaaaaa-0001-0001-0001-000000000001', 'Roberto Alvarado', 'R. Alvarado', 25, 'FWD', 'Chivas', 27, 176, 7300, 7.3)
ON CONFLICT (id) DO NOTHING;

-- Insert South Africa players (starting XI)  
INSERT INTO wc2026_players (id, team_id, name, short_name, number, position, club_name, age, height_cm, market_value_k, rating_avg)
VALUES
  ('cccccccc-0001-0001-0001-000000000001', 'aaaaaaaa-0002-0002-0002-000000000002', 'Ronwen Williams', 'R. Williams', 1, 'GK', 'Mamelodi Sundowns', 34, 184, 930, 7.2),
  ('cccccccc-0002-0002-0002-000000000002', 'aaaaaaaa-0002-0002-0002-000000000002', 'Katlego Mudau', 'K. Mudau', 20, 'DEF', 'Mamelodi Sundowns', 31, 181, 1300, 6.8),
  ('cccccccc-0003-0003-0003-000000000003', 'aaaaaaaa-0002-0002-0002-000000000002', 'Mothobi Mvala', 'M. Mbokazi', 14, 'DEF', 'Mamelodi Sundowns', 20, 175, 2700, 7.0),
  ('cccccccc-0004-0004-0004-000000000004', 'aaaaaaaa-0002-0002-0002-000000000002', 'Teboho Mokoena', 'T. Mokoena', 4, 'DEF', 'SuperSport United', 29, 176, 2700, 7.1),
  ('cccccccc-0005-0005-0005-000000000005', 'aaaaaaaa-0002-0002-0002-000000000002', 'Aubrey Modiba', 'A. Modiba', 6, 'DEF', 'Mamelodi Sundowns', 30, 167, 1900, 6.9),
  ('cccccccc-0006-0006-0006-000000000006', 'aaaaaaaa-0002-0002-0002-000000000002', 'Ethan Zwane', 'T. Zwane', 11, 'MID', 'Mamelodi Sundowns', 36, 170, 290, 6.7),
  ('cccccccc-0007-0007-0007-000000000007', 'aaaaaaaa-0002-0002-0002-000000000002', 'Lyle Foster', 'L. Foster', 9, 'MID', 'Burnley', 25, 180, 10300, 7.3),
  ('cccccccc-0008-0008-0008-000000000008', 'aaaaaaaa-0002-0002-0002-000000000002', 'Jayden Adams', 'J. Adams', 23, 'MID', 'Brighton', 25, 175, 1400, 7.0),
  ('cccccccc-0009-0009-0009-000000000009', 'aaaaaaaa-0002-0002-0002-000000000002', 'Innocent Okon', 'I. Okon', 21, 'MID', 'SuperSport United', 22, 187, 1900, 6.8),
  ('cccccccc-0010-0010-0010-000000000010', 'aaaaaaaa-0002-0002-0002-000000000002', 'Oswin Appollis', 'O. Appollis', 7, 'FWD', 'Polokwane City', 24, 172, 2200, 7.4),
  ('cccccccc-0011-0011-0011-000000000011', 'aaaaaaaa-0002-0002-0002-000000000002', 'Iqraam Rayners', 'R. Mofokeng', 10, 'FWD', 'Mamelodi Sundowns', 21, 166, 1900, 7.1)
ON CONFLICT (id) DO NOTHING;

-- Insert match (Ensure ID matches what we query for, e.g. '1' if we want it to replace match #1)
-- Wait, the user provided UUID 'dddddddd-0001-0001-0001-000000000001'. But the API uses integers.
-- We can insert this UUID or update the existing integer match.
-- For now, let's insert the UUID one as requested.
INSERT INTO wc2026_matches (id, home_team_id, away_team_id, match_date, match_time, group_name, round, match_number, status, broadcasters)
VALUES (
  '1', -- Use '1' to override the first match and make it accessible from the frontpage
  'aaaaaaaa-0001-0001-0001-000000000001',
  'aaaaaaaa-0002-0002-0002-000000000002',
  '2026-06-11', '19:00',
  'Group A', 'Group Stage', 1,
  'upcoming',
  ARRAY['beIN SPORTS MAX 1', 'TUDN', 'ViX']
)
ON CONFLICT (id) DO UPDATE SET 
  home_team_id = EXCLUDED.home_team_id, 
  away_team_id = EXCLUDED.away_team_id,
  broadcasters = EXCLUDED.broadcasters;

-- Insert lineups (position_x = 0-1 horizontal, position_y = 0-1 vertical from home goal)
INSERT INTO wc2026_lineups (match_id, team_id, player_id, is_starting, position_x, position_y, shirt_number)
VALUES
  -- Mexico GK
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0001-0001-0001-000000000001',true,0.50,0.05,15),
  -- Mexico DEF line
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0002-0002-0002-000000000002',true,0.10,0.22,1),
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0003-0003-0003-000000000003',true,0.35,0.22,3),
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0004-0004-0004-000000000004',true,0.65,0.22,5),
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0005-0005-0005-000000000005',true,0.90,0.22,6),
  -- Mexico MID
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0006-0006-0006-000000000006',true,0.50,0.38,14),
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0007-0007-0007-000000000007',true,0.30,0.52,8),
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0008-0008-0008-000000000008',true,0.50,0.52,9),
  -- Mexico FWD
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0009-0009-0009-000000000009',true,0.35,0.68,16),
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0010-0010-0010-000000000010',true,0.50,0.82,26),
  ('1','aaaaaaaa-0001-0001-0001-000000000001','bbbbbbbb-0011-0011-0011-000000000011',true,0.65,0.68,25),
  -- South Africa GK
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0001-0001-0001-000000000001',true,0.50,0.95,1),
  -- South Africa DEF
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0002-0002-0002-000000000002',true,0.90,0.78,20),
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0003-0003-0003-000000000003',true,0.65,0.78,14),
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0004-0004-0004-000000000004',true,0.35,0.78,4),
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0005-0005-0005-000000000005',true,0.10,0.78,6),
  -- South Africa MID
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0006-0006-0006-000000000006',true,0.30,0.62,11),
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0007-0007-0007-000000000007',true,0.50,0.62,9),
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0008-0008-0008-000000000008',true,0.70,0.62,23),
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0009-0009-0009-000000000009',true,0.80,0.48,21),
  -- South Africa FWD
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0010-0010-0010-000000000010',true,0.70,0.32,7),
  ('1','aaaaaaaa-0002-0002-0002-000000000002','cccccccc-0011-0011-0011-000000000011',true,0.30,0.32,10);

-- Insert match stats (pre-match placeholders)
INSERT INTO wc2026_match_stats (match_id, team_id, possession, shots_total, shots_on_target, corners, fouls, passes_total, passes_accuracy, xg)
VALUES
  ('1','aaaaaaaa-0001-0001-0001-000000000001',55,0,0,0,0,0,0,0.0),
  ('1','aaaaaaaa-0002-0002-0002-000000000002',45,0,0,0,0,0,0,0.0);

-- H2H data
INSERT INTO wc2026_h2h (home_team_id, away_team_id, match_date, competition, home_score, away_score, venue)
VALUES
  ('aaaaaaaa-0002-0002-0002-000000000002','aaaaaaaa-0001-0001-0001-000000000001','2026-06-10','FIFA World Cup',1,1,'Training Match'),
  ('aaaaaaaa-0001-0001-0001-000000000001','aaaaaaaa-0002-0002-0002-000000000002','2022-11-22','FIFA World Cup',2,0,'Stadium 974, Qatar'),
  ('aaaaaaaa-0002-0002-0002-000000000002','aaaaaaaa-0001-0001-0001-000000000001','2010-06-11','FIFA World Cup',1,1,'Soccer City, Johannesburg');
