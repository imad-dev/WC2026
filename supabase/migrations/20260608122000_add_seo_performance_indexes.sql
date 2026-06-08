-- Migration: Add missing B-Tree and Trigram indexes for SEO and Sync-Match performance

-- Create extension for pg_trgm if it doesn't exist (needed for ILIKE queries)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. B-Tree Indexes for precise filtering and ordering
CREATE INDEX IF NOT EXISTS idx_wc2026_matches_status ON wc2026_matches(status);
CREATE INDEX IF NOT EXISTS idx_wc2026_matches_kickoff_utc ON wc2026_matches(kickoff_utc);
CREATE INDEX IF NOT EXISTS idx_wc2026_matches_group_name ON wc2026_matches(group_name);

-- 2. Trigram Indexes for ILIKE pattern matching (used heavily in the cron sync functions)
CREATE INDEX IF NOT EXISTS idx_wc2026_matches_home_team_trgm ON wc2026_matches USING gin (home_team gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wc2026_matches_away_team_trgm ON wc2026_matches USING gin (away_team gin_trgm_ops);
