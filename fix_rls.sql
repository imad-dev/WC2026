-- Enable RLS just in case it's not enabled, though usually we just add a policy
ALTER TABLE wc2026_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE wc2026_venues ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts (optional, but let's just create them safely)
DO $$ 
BEGIN
    -- Teams
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for teams' AND tablename = 'wc2026_teams') THEN
        CREATE POLICY "Public read access for teams" ON wc2026_teams FOR SELECT USING (true);
    END IF;
    
    -- Players
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for players' AND tablename = 'wc2026_players') THEN
        CREATE POLICY "Public read access for players" ON wc2026_players FOR SELECT USING (true);
    END IF;

    -- Matches
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for matches' AND tablename = 'wc2026_matches') THEN
        CREATE POLICY "Public read access for matches" ON wc2026_matches FOR SELECT USING (true);
    END IF;

    -- Venues
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for venues' AND tablename = 'wc2026_venues') THEN
        CREATE POLICY "Public read access for venues" ON wc2026_venues FOR SELECT USING (true);
    END IF;
END $$;
