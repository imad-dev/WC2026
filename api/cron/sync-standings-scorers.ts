/**
 * Vercel Serverless Cron — /api/cron/sync-standings-scorers
 *
 * Fetches WC2026 standings + top scorers from football-data.org
 * and writes them to Supabase (full refresh).
 *
 * Schedule: every 30 minutes (see vercel.json)
 *
 * Env vars required:
 *   - FOOTBALL_DATA_API_KEY   — from football-data.org (free tier)
 *   - CRON_SECRET             — shared secret to protect the endpoint
 *   - SUPABASE_URL            — service-role URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const FD_BASE = 'https://api.football-data.org/v4';
const WC_CODE = 'WC'; // football-data.org competition code for FIFA World Cup

// ── helpers ──────────────────────────────────────────────────
function fdFetch(path: string, key: string) {
  return fetch(`${FD_BASE}${path}`, {
    headers: { 'X-Auth-Token': key },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── Auth ──
  const secret =
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'FOOTBALL_DATA_API_KEY not set' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const results: Record<string, unknown> = {};

  // ─────────────────────────────────────────────────────────────
  // 1. Standings
  // ─────────────────────────────────────────────────────────────
  try {
    const standingsRes = await fdFetch(`/competitions/${WC_CODE}/standings`, apiKey);

    if (!standingsRes.ok) {
      throw new Error(`standings HTTP ${standingsRes.status}: ${await standingsRes.text()}`);
    }

    const standingsJson = await standingsRes.json();
    const rows: Record<string, unknown>[] = [];

    for (const group of (standingsJson.standings ?? [])) {
      for (const entry of (group.table ?? [])) {
        rows.push({
          group_name:    group.group ?? null,
          team:          entry.team?.name ?? 'Unknown',
          played:        entry.playedGames ?? 0,
          won:           entry.won ?? 0,
          drawn:         entry.draw ?? 0,
          lost:          entry.lost ?? 0,
          goals_for:     entry.goalsFor ?? 0,
          goals_against: entry.goalsAgainst ?? 0,
          points:        entry.points ?? 0,
          updated_at:    new Date().toISOString(),
        });
      }
    }

    // Full refresh: delete then insert
    await supabase.from('wc_standings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (rows.length > 0) {
      const { error } = await supabase.from('wc_standings').insert(rows);
      if (error) throw error;
    }

    results.standings = { synced: rows.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('standings sync error:', message);
    results.standingsError = message;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Top Scorers
  // ─────────────────────────────────────────────────────────────
  try {
    const scorersRes = await fdFetch(`/competitions/${WC_CODE}/scorers?limit=20`, apiKey);

    if (!scorersRes.ok) {
      throw new Error(`scorers HTTP ${scorersRes.status}: ${await scorersRes.text()}`);
    }

    const scorersJson = await scorersRes.json();
    const rows: Record<string, unknown>[] = (scorersJson.scorers ?? []).map((s: any) => ({
      player_name: s.player?.name ?? 'Unknown',
      team:        s.team?.name ?? 'Unknown',
      goals:       s.goals ?? 0,
      assists:     s.assists ?? 0,
      updated_at:  new Date().toISOString(),
    }));

    // Full refresh
    await supabase.from('wc_scorers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (rows.length > 0) {
      const { error } = await supabase.from('wc_scorers').insert(rows);
      if (error) throw error;
    }

    results.scorers = { synced: rows.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('scorers sync error:', message);
    results.scorersError = message;
  }

  return res.status(200).json({ success: true, ...results });
}
