-- ============================================================
-- FIFA World Cup 2026 — FULL SCHEMA + SEED
-- Run this ONCE in Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/hmrupyzllyeyafqrparw/sql/new
-- ============================================================

-- ── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS wc2026_matches (
  id SERIAL PRIMARY KEY,
  match_number INT,
  group_name VARCHAR(2),
  home_team VARCHAR(60),
  away_team VARCHAR(60),
  kickoff_utc TIMESTAMPTZ,
  venue VARCHAR(100),
  home_score INT DEFAULT NULL,
  away_score INT DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'upcoming',
  youtube_video_id VARCHAR(30) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS wc2026_config (
  key VARCHAR(60) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO wc2026_config VALUES ('bein_live_video_id', NULL, NOW())
ON CONFLICT (key) DO NOTHING;

-- ── Group Standings (synced from football-data.org) ─────────

CREATE TABLE IF NOT EXISTS wc_standings (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name  text,
  team        text,
  played      int  DEFAULT 0,
  won         int  DEFAULT 0,
  drawn       int  DEFAULT 0,
  lost        int  DEFAULT 0,
  goals_for   int  DEFAULT 0,
  goals_against int DEFAULT 0,
  goal_diff   int GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points      int  DEFAULT 0,
  updated_at  timestamptz DEFAULT now()
);

-- ── Top Scorers (synced from football-data.org) ─────────────

CREATE TABLE IF NOT EXISTS wc_scorers (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name text,
  team        text,
  goals       int  DEFAULT 0,
  assists     int  DEFAULT 0,
  updated_at  timestamptz DEFAULT now()
);

-- ── Enable Realtime ─────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE wc2026_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE wc2026_config;
ALTER PUBLICATION supabase_realtime ADD TABLE wc_standings;
ALTER PUBLICATION supabase_realtime ADD TABLE wc_scorers;

-- ── Enable RLS ──────────────────────────────────────────────

ALTER TABLE wc2026_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_config  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc_standings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc_scorers     ENABLE ROW LEVEL SECURITY;

-- Public read access (anon + authenticated can SELECT)
CREATE POLICY "Public read matches"      ON wc2026_matches  FOR SELECT USING (true);
CREATE POLICY "Public read config"       ON wc2026_config   FOR SELECT USING (true);
CREATE POLICY "Public read wc_standings" ON wc_standings    FOR SELECT USING (true);
CREATE POLICY "Public read wc_scorers"   ON wc_scorers      FOR SELECT USING (true);

-- ============================================================
-- SEED DATA — All 104 FIFA World Cup 2026 Matches
-- ============================================================

-- ── GROUP A ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(1,  'A', 'Mexico',         'South Africa',    '2026-06-11T18:00:00Z', 'Estadio Azteca'),
(2,  'A', 'France',         'Colombia',        '2026-06-11T21:00:00Z', 'SoFi Stadium'),
(17, 'A', 'South Africa',   'Colombia',        '2026-06-15T18:00:00Z', 'Lumen Field'),
(18, 'A', 'Mexico',         'France',          '2026-06-15T21:00:00Z', 'Estadio Azteca'),
(33, 'A', 'Colombia',       'Mexico',          '2026-06-19T18:00:00Z', 'NRG Stadium'),
(34, 'A', 'France',         'South Africa',    '2026-06-19T18:00:00Z', 'Mercedes-Benz Stadium');

-- ── GROUP B ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(3,  'B', 'USA',            'Bolivia',         '2026-06-12T18:00:00Z', 'MetLife Stadium'),
(4,  'B', 'England',        'Japan',           '2026-06-12T21:00:00Z', 'AT&T Stadium'),
(19, 'B', 'Bolivia',        'Japan',           '2026-06-16T18:00:00Z', 'Hard Rock Stadium'),
(20, 'B', 'USA',            'England',         '2026-06-16T21:00:00Z', 'MetLife Stadium'),
(35, 'B', 'Japan',          'USA',             '2026-06-20T18:00:00Z', 'Levi''s Stadium'),
(36, 'B', 'England',        'Bolivia',         '2026-06-20T18:00:00Z', 'Gillette Stadium');

-- ── GROUP C ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(5,  'C', 'Brazil',         'Morocco',         '2026-06-13T18:00:00Z', 'AT&T Stadium'),
(6,  'C', 'Argentina',      'Cameroon',        '2026-06-13T21:00:00Z', 'Hard Rock Stadium'),
(21, 'C', 'Morocco',        'Cameroon',        '2026-06-17T18:00:00Z', 'NRG Stadium'),
(22, 'C', 'Brazil',         'Argentina',       '2026-06-17T21:00:00Z', 'MetLife Stadium'),
(37, 'C', 'Cameroon',       'Brazil',          '2026-06-21T18:00:00Z', 'Mercedes-Benz Stadium'),
(38, 'C', 'Argentina',      'Morocco',         '2026-06-21T18:00:00Z', 'SoFi Stadium');

-- ── GROUP D ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(7,  'D', 'Canada',         'Australia',       '2026-06-12T15:00:00Z', 'BMO Field'),
(8,  'D', 'Germany',        'Uruguay',         '2026-06-12T18:00:00Z', 'Lincoln Financial Field'),
(23, 'D', 'Australia',      'Uruguay',         '2026-06-16T15:00:00Z', 'BC Place'),
(24, 'D', 'Canada',         'Germany',         '2026-06-16T18:00:00Z', 'BMO Field'),
(39, 'D', 'Uruguay',        'Canada',          '2026-06-20T15:00:00Z', 'Estadio BBVA'),
(40, 'D', 'Germany',        'Australia',       '2026-06-20T15:00:00Z', 'Lincoln Financial Field');

-- ── GROUP E ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(9,  'E', 'Spain',          'Denmark',         '2026-06-13T15:00:00Z', 'Estadio Akron'),
(10, 'E', 'Netherlands',    'Nigeria',         '2026-06-13T18:00:00Z', 'Lumen Field'),
(25, 'E', 'Denmark',        'Nigeria',         '2026-06-17T15:00:00Z', 'Estadio Akron'),
(26, 'E', 'Spain',          'Netherlands',     '2026-06-17T18:00:00Z', 'Arrowhead Stadium'),
(41, 'E', 'Nigeria',        'Spain',           '2026-06-21T15:00:00Z', 'NRG Stadium'),
(42, 'E', 'Netherlands',    'Denmark',         '2026-06-21T15:00:00Z', 'Lumen Field');

-- ── GROUP F ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(11, 'F', 'Portugal',       'Ecuador',         '2026-06-14T18:00:00Z', 'Gillette Stadium'),
(12, 'F', 'Belgium',        'South Korea',     '2026-06-14T21:00:00Z', 'Arrowhead Stadium'),
(27, 'F', 'Ecuador',        'South Korea',     '2026-06-18T18:00:00Z', 'Estadio BBVA'),
(28, 'F', 'Portugal',       'Belgium',         '2026-06-18T21:00:00Z', 'MetLife Stadium'),
(43, 'F', 'South Korea',    'Portugal',        '2026-06-22T18:00:00Z', 'SoFi Stadium'),
(44, 'F', 'Belgium',        'Ecuador',         '2026-06-22T18:00:00Z', 'Hard Rock Stadium');

-- ── GROUP G ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(13, 'G', 'Croatia',        'Ghana',           '2026-06-14T15:00:00Z', 'Levi''s Stadium'),
(14, 'G', 'Italy',          'Senegal',         '2026-06-14T18:00:00Z', 'Mercedes-Benz Stadium'),
(29, 'G', 'Ghana',          'Senegal',         '2026-06-18T15:00:00Z', 'BMO Field'),
(30, 'G', 'Croatia',        'Italy',           '2026-06-18T18:00:00Z', 'AT&T Stadium'),
(45, 'G', 'Senegal',        'Croatia',         '2026-06-22T15:00:00Z', 'Estadio Akron'),
(46, 'G', 'Italy',          'Ghana',           '2026-06-22T15:00:00Z', 'Lincoln Financial Field');

-- ── GROUP H ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(15, 'H', 'Serbia',         'Peru',            '2026-06-15T15:00:00Z', 'Estadio BBVA'),
(16, 'H', 'Switzerland',    'Iran',            '2026-06-15T18:00:00Z', 'BC Place'),
(31, 'H', 'Peru',           'Iran',            '2026-06-19T15:00:00Z', 'Estadio Akron'),
(32, 'H', 'Serbia',         'Switzerland',     '2026-06-19T18:00:00Z', 'Levi''s Stadium'),
(47, 'H', 'Iran',           'Serbia',          '2026-06-23T15:00:00Z', 'BMO Field'),
(48, 'H', 'Switzerland',    'Peru',            '2026-06-23T15:00:00Z', 'BC Place');

-- ── GROUP I ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(49, 'I', 'Poland',         'Tunisia',         '2026-06-13T12:00:00Z', 'Gillette Stadium'),
(50, 'I', 'Chile',          'Saudi Arabia',    '2026-06-13T15:00:00Z', 'Estadio BBVA'),
(51, 'I', 'Tunisia',        'Saudi Arabia',    '2026-06-17T12:00:00Z', 'Hard Rock Stadium'),
(52, 'I', 'Poland',         'Chile',           '2026-06-17T15:00:00Z', 'Lincoln Financial Field'),
(53, 'I', 'Saudi Arabia',   'Poland',          '2026-06-21T12:00:00Z', 'Arrowhead Stadium'),
(54, 'I', 'Chile',          'Tunisia',         '2026-06-21T12:00:00Z', 'Estadio BBVA');

-- ── GROUP J ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(55, 'J', 'Algeria',        'Paraguay',        '2026-06-14T12:00:00Z', 'NRG Stadium'),
(56, 'J', 'Wales',          'Qatar',           '2026-06-14T15:00:00Z', 'BC Place'),
(57, 'J', 'Paraguay',       'Qatar',           '2026-06-18T12:00:00Z', 'Lumen Field'),
(58, 'J', 'Algeria',        'Wales',           '2026-06-18T15:00:00Z', 'Gillette Stadium'),
(59, 'J', 'Qatar',          'Algeria',         '2026-06-22T12:00:00Z', 'NRG Stadium'),
(60, 'J', 'Wales',          'Paraguay',        '2026-06-22T12:00:00Z', 'BMO Field');

-- ── GROUP K ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(61, 'K', 'Egypt',          'Costa Rica',      '2026-06-15T12:00:00Z', 'SoFi Stadium'),
(62, 'K', 'Sweden',         'Ukraine',         '2026-06-15T15:00:00Z', 'Arrowhead Stadium'),
(63, 'K', 'Costa Rica',     'Ukraine',         '2026-06-19T12:00:00Z', 'Estadio Akron'),
(64, 'K', 'Egypt',          'Sweden',          '2026-06-19T15:00:00Z', 'AT&T Stadium'),
(65, 'K', 'Ukraine',        'Egypt',           '2026-06-23T12:00:00Z', 'Mercedes-Benz Stadium'),
(66, 'K', 'Sweden',         'Costa Rica',      '2026-06-23T12:00:00Z', 'Levi''s Stadium');

-- ── GROUP L ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(67, 'L', 'Turkey',         'China PR',        '2026-06-16T12:00:00Z', 'Hard Rock Stadium'),
(68, 'L', 'Austria',        'Congo DR',        '2026-06-16T15:00:00Z', 'Gillette Stadium'),
(69, 'L', 'China PR',       'Congo DR',        '2026-06-20T12:00:00Z', 'Estadio BBVA'),
(70, 'L', 'Turkey',         'Austria',         '2026-06-20T15:00:00Z', 'NRG Stadium'),
(71, 'L', 'Congo DR',       'Turkey',          '2026-06-24T12:00:00Z', 'SoFi Stadium'),
(72, 'L', 'Austria',        'China PR',        '2026-06-24T12:00:00Z', 'Lincoln Financial Field');

-- ── Round of 32 ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(73, NULL, '1A',  '3C/D',  '2026-06-25T18:00:00Z', 'MetLife Stadium'),
(74, NULL, '2A',  '2C',    '2026-06-25T21:00:00Z', 'AT&T Stadium'),
(75, NULL, '1B',  '3E/F',  '2026-06-25T15:00:00Z', 'SoFi Stadium'),
(76, NULL, '2B',  '2D',    '2026-06-26T18:00:00Z', 'NRG Stadium'),
(77, NULL, '1C',  '3A/B',  '2026-06-26T21:00:00Z', 'Estadio Azteca'),
(78, NULL, '2C',  '2E',    '2026-06-26T15:00:00Z', 'Lumen Field'),
(79, NULL, '1D',  '3G/H',  '2026-06-27T18:00:00Z', 'Hard Rock Stadium'),
(80, NULL, '2D',  '2F',    '2026-06-27T21:00:00Z', 'Lincoln Financial Field'),
(81, NULL, '1E',  '3I/J',  '2026-06-27T15:00:00Z', 'Arrowhead Stadium'),
(82, NULL, '2E',  '2G',    '2026-06-28T18:00:00Z', 'Mercedes-Benz Stadium'),
(83, NULL, '1F',  '3K/L',  '2026-06-28T21:00:00Z', 'Gillette Stadium'),
(84, NULL, '2F',  '2H',    '2026-06-28T15:00:00Z', 'BMO Field'),
(85, NULL, '1G',  '2L',    '2026-06-29T18:00:00Z', 'Estadio Akron'),
(86, NULL, '1H',  '2K',    '2026-06-29T21:00:00Z', 'BC Place'),
(87, NULL, '1I',  '2J',    '2026-06-29T15:00:00Z', 'Levi''s Stadium'),
(88, NULL, '1J',  '2I',    '2026-06-30T18:00:00Z', 'Estadio BBVA');

-- ── Round of 16 ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(89, NULL, 'W73', 'W74', '2026-07-01T18:00:00Z', 'MetLife Stadium'),
(90, NULL, 'W75', 'W76', '2026-07-01T21:00:00Z', 'AT&T Stadium'),
(91, NULL, 'W77', 'W78', '2026-07-02T18:00:00Z', 'SoFi Stadium'),
(92, NULL, 'W79', 'W80', '2026-07-02T21:00:00Z', 'NRG Stadium'),
(93, NULL, 'W81', 'W82', '2026-07-03T18:00:00Z', 'Hard Rock Stadium'),
(94, NULL, 'W83', 'W84', '2026-07-03T21:00:00Z', 'Arrowhead Stadium'),
(95, NULL, 'W85', 'W86', '2026-07-04T18:00:00Z', 'Estadio Azteca'),
(96, NULL, 'W87', 'W88', '2026-07-04T21:00:00Z', 'Lincoln Financial Field');

-- ── Quarterfinals ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(97,  NULL, 'W89', 'W90', '2026-07-08T18:00:00Z', 'MetLife Stadium'),
(98,  NULL, 'W91', 'W92', '2026-07-08T21:00:00Z', 'AT&T Stadium'),
(99,  NULL, 'W93', 'W94', '2026-07-09T18:00:00Z', 'SoFi Stadium'),
(100, NULL, 'W95', 'W96', '2026-07-09T21:00:00Z', 'Arrowhead Stadium');

-- ── Semifinals ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(101, NULL, 'W97',  'W98',  '2026-07-14T21:00:00Z', 'AT&T Stadium'),
(102, NULL, 'W99',  'W100', '2026-07-15T21:00:00Z', 'MetLife Stadium');

-- ── Third-place ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(103, NULL, 'L101', 'L102', '2026-07-18T21:00:00Z', 'Hard Rock Stadium');

-- ── FINAL ──
INSERT INTO wc2026_matches (match_number, group_name, home_team, away_team, kickoff_utc, venue) VALUES
(104, NULL, 'W101', 'W102', '2026-07-19T21:00:00Z', 'MetLife Stadium');
