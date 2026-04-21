import { useState, useEffect, useCallback } from 'react';
import {
  fetchLeagueStandings,
  fetchLeagueMatches,
  fetchLeagueScorers,
  fetchTodayMatches,
  type StandingEntry,
  type NormMatch,
  type NormScorer,
  type TodayMatch,
  type CompetitionCode,
} from '../services/api';

// ─── Standings ────────────────────────────────────────────────────────────────
export function useLeagueStandings(competition: CompetitionCode = 'PL') {
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeagueStandings(competition);
      setStandings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load standings');
    } finally {
      setLoading(false);
    }
  }, [competition]);

  useEffect(() => { load(); }, [load]);
  return { standings, loading, error, refetch: load };
}

// ─── Matches ──────────────────────────────────────────────────────────────────
export function useLeagueMatches(
  competition: CompetitionCode = 'PL',
  status?: string,
  limit = 12
) {
  const [matches, setMatches] = useState<NormMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeagueMatches(competition, status, limit);
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, [competition, status, limit]);

  useEffect(() => { load(); }, [load]);
  return { matches, loading, error, refetch: load };
}

// ─── Today's Matches ──────────────────────────────────────────────────────────
export function useTodayMatches() {
  const [matches, setMatches] = useState<TodayMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodayMatches();
      setMatches(data);
    } catch (err: any) {
      setError(err.message || "Failed to load today's matches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 120000);
    return () => clearInterval(interval);
  }, [load]);

  return { matches, loading, error, refetch: load };
}

// ─── Scorers ──────────────────────────────────────────────────────────────────
export function useLeagueScorers(competition: CompetitionCode = 'PL', _limit = 10) {
  const [scorers, setScorers] = useState<NormScorer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeagueScorers(competition)
      .then(setScorers)
      .finally(() => setLoading(false));
  }, [competition]);

  return { scorers, loading };
}
