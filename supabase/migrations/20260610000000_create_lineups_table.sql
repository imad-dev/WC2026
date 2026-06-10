-- Create table for match lineups
CREATE TABLE IF NOT EXISTS wc2026_lineups (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT REFERENCES wc2026_matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  position TEXT NOT NULL,
  x INTEGER NOT NULL, -- 0 to 100 representing percentage on pitch (x-axis)
  y INTEGER NOT NULL, -- 0 to 100 representing percentage on pitch (y-axis)
  team TEXT NOT NULL CHECK (team IN ('home', 'away')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wc2026_lineups ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on wc2026_lineups"
  ON wc2026_lineups FOR SELECT
  USING (true);

-- Allow service role to manage lineups
CREATE POLICY "Allow service role to manage wc2026_lineups"
  ON wc2026_lineups USING (true);
