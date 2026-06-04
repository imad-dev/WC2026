import { useState, useEffect, useCallback } from 'react';
import { supabase, type WC2026Match, type WC2026Config } from '../lib/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ── useMatches ─────────────────────────────────────────────────

export function useMatches() {
  const [matches, setMatches] = useState<WC2026Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    const { data, error } = await supabase
      .from('wc2026_matches')
      .select('*')
      .order('kickoff_utc', { ascending: true });

    if (!error && data) {
      setMatches(data as WC2026Match[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMatches();

    // Realtime subscription
    const channel: RealtimeChannel = supabase
      .channel('wc2026_matches_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wc2026_matches' },
        (payload) => {
          setMatches((prev) => {
            const updated = payload.new as WC2026Match;
            if (payload.eventType === 'INSERT') {
              return [...prev, updated].sort(
                (a, b) => new Date(a.kickoff_utc).getTime() - new Date(b.kickoff_utc).getTime()
              );
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((m) => (m.id === updated.id ? updated : m));
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter((m) => m.id !== (payload.old as any).id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMatches]);

  return { matches, loading, refetch: fetchMatches };
}

// ── useConfig ──────────────────────────────────────────────────

export function useConfig(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    supabase
      .from('wc2026_config')
      .select('value')
      .eq('key', key)
      .single()
      .then(({ data }) => {
        if (data) setValue(data.value);
        setLoading(false);
      });

    // Realtime subscription
    const channel: RealtimeChannel = supabase
      .channel(`wc2026_config_${key}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wc2026_config',
          filter: `key=eq.${key}`,
        },
        (payload) => {
          const updated = payload.new as WC2026Config;
          setValue(updated.value);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [key]);

  return { value, loading };
}

// ── useGeo ─────────────────────────────────────────────────────

export function useGeo() {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/geo')
      .then((r) => r.json())
      .then((data) => setCountry(data.country || null))
      .catch(() => setCountry(null));
  }, []);

  return country;
}

// ── Types for football-data.org synced tables ───────────────

export interface WCStanding {
  id: string;
  group_name: string | null;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
  updated_at: string;
}

export interface WCScorer {
  id: string;
  player_name: string;
  team: string;
  goals: number;
  assists: number;
  updated_at: string;
}

// ── useWCStandings ─────────────────────────────────────────

export function useWCStandings(group?: string) {
  const [standings, setStandings] = useState<WCStanding[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStandings = useCallback(async () => {
    let query = supabase
      .from('wc_standings')
      .select('*')
      .order('points', { ascending: false });

    if (group) {
      query = query.eq('group_name', group);
    }

    const { data, error } = await query;
    if (!error && data) setStandings(data as WCStanding[]);
    setLoading(false);
  }, [group]);

  useEffect(() => {
    fetchStandings();

    const channel: RealtimeChannel = supabase
      .channel('wc_standings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wc_standings' },
        () => { fetchStandings(); } // full refresh on any change
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchStandings]);

  return { standings, loading, refetch: fetchStandings };
}

// ── useWCScorers ───────────────────────────────────────────

export function useWCScorers(limit = 20) {
  const [scorers, setScorers] = useState<WCScorer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScorers = useCallback(async () => {
    const { data, error } = await supabase
      .from('wc_scorers')
      .select('*')
      .order('goals', { ascending: false })
      .limit(limit);

    if (!error && data) setScorers(data as WCScorer[]);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchScorers();

    const channel: RealtimeChannel = supabase
      .channel('wc_scorers_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wc_scorers' },
        () => { fetchScorers(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchScorers]);

  return { scorers, loading, refetch: fetchScorers };
}
