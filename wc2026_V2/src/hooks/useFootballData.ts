import { useState, useEffect } from 'react';
import {
  fetchFixtures,
  fetchLiveMatches,
  fetchStandings,
  fetchTopScorers,
  transformFixtureData,
  transformStandingsData,
  transformTopScorersData
} from '../services/api';
import { useTournamentPhase } from './useTournamentPhase';

export function useLiveMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLive } = useTournamentPhase();

  useEffect(() => {
    // Don't fetch live matches if tournament hasn't started
    if (!isLive) {
      setMatches([]);
      setLoading(false);
      return;
    }

    async function loadMatches() {
      try {
        console.log('🔄 Hook: Loading live matches...');
        setLoading(true);
        setError(null);

        const data = await fetchLiveMatches();
        console.log('🔄 Hook: Received data:', data.length, 'matches');

        if (data.length > 0) {
          const transformed = data.slice(0, 3).map(transformFixtureData);
          console.log('✅ Hook: Transformed matches:', transformed);
          setMatches(transformed);
        } else {
          console.log('⚠️ Hook: No live matches found, using empty array');
          setMatches([]);
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to load live matches';
        setError(errorMsg);
        console.error('❌ Hook error:', errorMsg);
        setMatches([]); // Clear matches on error
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
    // Refresh every 30 seconds during tournament
    const interval = setInterval(loadMatches, 30000);
    return () => clearInterval(interval);
  }, [isLive]);

  console.log('🎯 Hook state:', { matchCount: matches.length, loading, error, isLive });
  return { matches, loading, error };
}

// Default to World Cup 2026 - will auto-fallback to Premier League 2024 if WC2026 API unavailable
export function useFixtures(league: number = 1, season: number = 2026) {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFixtures() {
      try {
        console.log(`🔄 Hook: Loading fixtures for league ${league}, season ${season}...`);
        setLoading(true);
        setError(null);

        const data = await fetchFixtures(league, season);
        console.log('🔄 Hook: Received fixtures data:', data.length, 'fixtures');

        if (data.length > 0) {
          const transformed = data.map(transformFixtureData);
          console.log('✅ Hook: Transformed fixtures:', transformed.length);
          setFixtures(transformed);
        } else {
          console.log('⚠️ Hook: No fixtures found');
          setFixtures([]);
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to load fixtures';
        setError(errorMsg);
        console.error('❌ Hook error:', errorMsg);
        setFixtures([]);
      } finally {
        setLoading(false);
      }
    }

    loadFixtures();
  }, [league, season]);

  console.log('🎯 Hook state:', { fixturesCount: fixtures.length, loading, error });
  return { fixtures, loading, error };
}

// Default to World Cup 2026 - will auto-fallback to Premier League 2024 if WC2026 API unavailable
export function useStandings(league: number = 1, season: number = 2026) {
  const [standings, setStandings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLive } = useTournamentPhase();

  useEffect(() => {
    // Don't fetch standings if tournament hasn't started (no standings data yet)
    if (!isLive) {
      setStandings({});
      setLoading(false);
      return;
    }

    async function loadStandings() {
      try {
        console.log(`🔄 Hook: Loading standings for league ${league}, season ${season}...`);
        setLoading(true);
        const data = await fetchStandings(league, season);
        console.log('🔄 Hook: Received standings data:', data);

        // Group standings by group letter
        const grouped: any = {};
        data.forEach((leagueData: any) => {
          leagueData.league?.standings?.forEach((group: any[], groupIndex: number) => {
            const groupLetter = String.fromCharCode(65 + groupIndex); // A, B, C, etc.
            grouped[groupLetter] = transformStandingsData(group);
          });
        });

        console.log('✅ Hook: Grouped standings:', grouped);
        setStandings(grouped);
      } catch (err) {
        setError('Failed to load standings');
        console.error('❌ Hook error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStandings();
  }, [league, season, isLive]);

  console.log('🎯 Hook state:', { groupCount: Object.keys(standings).length, loading, error, isLive });
  return { standings, loading, error };
}

// Default to World Cup 2026 - will auto-fallback to Premier League 2024 if WC2026 API unavailable
export function useTopScorers(league: number = 1, season: number = 2026) {
  const [scorers, setScorers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLive } = useTournamentPhase();

  useEffect(() => {
    // Don't fetch scorers if tournament hasn't started (no goals scored yet)
    if (!isLive) {
      setScorers([]);
      setLoading(false);
      return;
    }

    async function loadScorers() {
      try {
        console.log(`🔄 Hook: Loading top scorers for league ${league}, season ${season}...`);
        setLoading(true);
        const data = await fetchTopScorers(league, season);
        console.log('🔄 Hook: Received scorers data:', data.length, 'players');

        if (data.length > 0) {
          const transformed = transformTopScorersData(data);
          console.log('✅ Hook: Transformed scorers:', transformed);
          setScorers(transformed);
        } else {
          console.log('⚠️ Hook: No scorers found');
          setScorers([]);
        }
      } catch (err) {
        setError('Failed to load top scorers');
        console.error('❌ Hook error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadScorers();
  }, [league, season, isLive]);

  console.log('🎯 Hook state:', { scorersCount: scorers.length, loading, error, isLive });
  return { scorers, loading, error };
}
