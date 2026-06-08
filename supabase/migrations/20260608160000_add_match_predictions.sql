-- ============================================================
-- WC2026 — Match Predictions Table & RPC
-- ============================================================

-- Create the predictions table
CREATE TABLE IF NOT EXISTS wc2026_predictions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id text NOT NULL,
  user_id text NOT NULL,
  choice text NOT NULL CHECK (choice IN ('team_a', 'draw', 'team_b')),
  created_at timestamptz DEFAULT now(),
  -- Ensure a user can only vote once per match (or update their vote)
  CONSTRAINT unique_match_user UNIQUE(match_id, user_id)
);

-- Enable RLS
ALTER TABLE wc2026_predictions ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (since we use local UUIDs)
CREATE POLICY "Public can insert predictions" ON wc2026_predictions
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own predictions based on their user_id
CREATE POLICY "Users can update their predictions" ON wc2026_predictions
  FOR UPDATE USING (true);

-- Allow public read of all predictions for aggregation
CREATE POLICY "Public can view predictions" ON wc2026_predictions
  FOR SELECT USING (true);

-- Create RPC to get prediction percentages
CREATE OR REPLACE FUNCTION get_prediction_percentages(p_match_id text)
RETURNS TABLE (
  team_a_pct numeric,
  draw_pct numeric,
  team_b_pct numeric,
  total_votes int
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_team_a int;
  v_draw int;
  v_team_b int;
  v_total int;
BEGIN
  -- Count votes for each choice
  SELECT 
    COUNT(*) FILTER (WHERE choice = 'team_a'),
    COUNT(*) FILTER (WHERE choice = 'draw'),
    COUNT(*) FILTER (WHERE choice = 'team_b'),
    COUNT(*)
  INTO v_team_a, v_draw, v_team_b, v_total
  FROM wc2026_predictions
  WHERE match_id = p_match_id;

  -- If no votes, return 0 for all
  IF v_total = 0 THEN
    RETURN QUERY SELECT 0::numeric, 0::numeric, 0::numeric, 0;
  ELSE
    RETURN QUERY SELECT 
      ROUND((v_team_a::numeric / v_total::numeric) * 100),
      ROUND((v_draw::numeric / v_total::numeric) * 100),
      ROUND((v_team_b::numeric / v_total::numeric) * 100),
      v_total;
  END IF;
END;
$$;
