import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
CREATE TABLE IF NOT EXISTS wc2026_predictions (
    id SERIAL PRIMARY KEY,
    match_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    choice TEXT NOT NULL CHECK (choice IN ('team_a', 'draw', 'team_b')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(match_id, user_id)
);

CREATE OR REPLACE FUNCTION get_prediction_percentages(p_match_id TEXT)
RETURNS TABLE (
    team_a_pct NUMERIC,
    draw_pct NUMERIC,
    team_b_pct NUMERIC,
    total_votes BIGINT
) AS $$
DECLARE
    v_total_votes BIGINT;
    v_team_a_votes BIGINT;
    v_draw_votes BIGINT;
    v_team_b_votes BIGINT;
BEGIN
    SELECT COUNT(*) INTO v_total_votes FROM wc2026_predictions WHERE match_id = p_match_id;
    
    IF v_total_votes = 0 THEN
        RETURN QUERY SELECT 0::NUMERIC, 0::NUMERIC, 0::NUMERIC, 0::BIGINT;
        RETURN;
    END IF;

    SELECT COUNT(*) INTO v_team_a_votes FROM wc2026_predictions WHERE match_id = p_match_id AND choice = 'team_a';
    SELECT COUNT(*) INTO v_draw_votes FROM wc2026_predictions WHERE match_id = p_match_id AND choice = 'draw';
    SELECT COUNT(*) INTO v_team_b_votes FROM wc2026_predictions WHERE match_id = p_match_id AND choice = 'team_b';

    RETURN QUERY SELECT 
        ROUND((v_team_a_votes::NUMERIC / v_total_votes::NUMERIC) * 100, 0),
        ROUND((v_draw_votes::NUMERIC / v_total_votes::NUMERIC) * 100, 0),
        ROUND((v_team_b_votes::NUMERIC / v_total_votes::NUMERIC) * 100, 0),
        v_total_votes;
END;
$$ LANGUAGE plpgsql;
`;

// we can't run raw sql via standard JS client easily unless we use rpc.
// But we can just instruct user to run it OR use REST api.
console.log(sql);
