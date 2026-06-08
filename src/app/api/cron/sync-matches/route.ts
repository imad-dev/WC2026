/**
 * Next.js Route Handler — /api/cron/sync-matches
 *
 * Runs every 5 minutes during tournament dates (June 11 – July 19).
 * Hits API-Football v3 for live WC2026 scores → updates Supabase.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const TOURNAMENT_START = new Date('2026-06-11T00:00:00Z');
const TOURNAMENT_END = new Date('2026-07-20T00:00:00Z');

const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

interface APIFootballFixture {
  fixture: {
    id: number;
    status: { short: string };
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

export async function GET(request: NextRequest) {
  // ── Auth ──
  const secret =
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Date guard ──
  const now = new Date();
  if (now < TOURNAMENT_START || now > TOURNAMENT_END) {
    return NextResponse.json({ skipped: true, reason: 'Outside tournament window' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const apiRes = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&live=all`,
      {
        headers: {
          'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    );

    if (!apiRes.ok) {
      throw new Error(`API-Football error: ${apiRes.status}`);
    }

    const apiData = await apiRes.json();
    const fixtures: APIFootballFixture[] = apiData.response || [];

    let updated = 0;

    for (const fix of fixtures) {
      const statusMap: Record<string, string> = {
        '1H': 'live', '2H': 'live', 'HT': 'live', 'ET': 'live', 'P': 'live', 'BT': 'live',
        'FT': 'finished', 'AET': 'finished', 'PEN': 'finished',
        'NS': 'upcoming', 'TBD': 'upcoming',
        'PST': 'postponed', 'CANC': 'postponed', 'ABD': 'postponed',
      };

      const status = statusMap[fix.fixture.status.short] || 'upcoming';

      const { data: matchRows } = await supabase
        .from('wc2026_matches')
        .select('id')
        .ilike('home_team', `%${fix.teams.home.name}%`)
        .ilike('away_team', `%${fix.teams.away.name}%`)
        .limit(1);

      if (matchRows && matchRows.length > 0) {
        const { error } = await supabase
          .from('wc2026_matches')
          .update({
            home_score: fix.goals.home,
            away_score: fix.goals.away,
            status,
          })
          .eq('id', matchRows[0].id);

        if (!error) updated++;
      }
    }

    // Also fetch recently finished matches
    const recentRes = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&date=${now.toISOString().split('T')[0]}`,
      {
        headers: {
          'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    );

    if (recentRes.ok) {
      const recentData = await recentRes.json();
      const recentFixtures: APIFootballFixture[] = recentData.response || [];

      for (const fix of recentFixtures) {
        if (!['FT', 'AET', 'PEN'].includes(fix.fixture.status.short)) continue;

        const { data: matchRows } = await supabase
          .from('wc2026_matches')
          .select('id, status')
          .ilike('home_team', `%${fix.teams.home.name}%`)
          .ilike('away_team', `%${fix.teams.away.name}%`)
          .limit(1);

        if (matchRows && matchRows.length > 0 && matchRows[0].status !== 'finished') {
          await supabase
            .from('wc2026_matches')
            .update({
              home_score: fix.goals.home,
              away_score: fix.goals.away,
              status: 'finished',
            })
            .eq('id', matchRows[0].id);
          updated++;
        }
      }
    }

    return NextResponse.json({ success: true, updated, liveFixtures: fixtures.length });
  } catch (err: any) {
    console.error('sync-matches error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
