-- ============================================================
-- WC2026 — Standings & Scorers tables (football-data.org sync)
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Group Standings ──────────────────────────────────────────
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

-- ── Top Scorers ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wc_scorers (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name text,
  team        text,
  goals       int  DEFAULT 0,
  assists     int  DEFAULT 0,
  updated_at  timestamptz DEFAULT now()
);

-- ── RLS: Public read ─────────────────────────────────────────
ALTER TABLE wc_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc_scorers   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read wc_standings" ON wc_standings FOR SELECT USING (true);
CREATE POLICY "Public read wc_scorers"   ON wc_scorers   FOR SELECT USING (true);

-- ── Realtime ─────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE wc_standings;
ALTER PUBLICATION supabase_realtime ADD TABLE wc_scorers;
