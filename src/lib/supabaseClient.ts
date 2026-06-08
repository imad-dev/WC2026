import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — real-time features disabled.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  }
);

// ── Types ──────────────────────────────────────────────────────

export interface WC2026Match {
  id: number;
  match_number: number;
  group_name: string | null;
  home_team: string;
  away_team: string;
  kickoff_utc: string;
  venue: string;
  home_score: number | null;
  away_score: number | null;
  status: 'upcoming' | 'live' | 'finished' | 'postponed';
  youtube_video_id: string | null;
}

export interface WC2026Config {
  key: string;
  value: string | null;
  updated_at: string;
}
