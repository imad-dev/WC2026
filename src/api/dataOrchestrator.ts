import { getFixtures, getLiveFixtures, getStandings, getTopScorers, WC_LEAGUE_ID } from '@/api/apiFootball'
import { MOCK_DASHBOARD_DATA } from '@/api/mockData'
import { getGroups, getMatchById, getMatches } from '@/api/wc2026Api'
import type { DashboardData, Group, Match, PlayerStats } from '@/types'

function logSource(source: 'wc2026api' | 'apiFootball' | 'mock') {
  console.info('[Data] Source:', source)
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const [matches, groups] = await Promise.all([getMatches(), getGroups()])
    const liveMatches = matches.filter((match) => match.status === 'LIVE')
    const upcomingMatches = matches.filter((match) => match.status === 'UPCOMING').slice(0, 6)
    const recentMatches = matches.filter((match) => match.status === 'FT').slice(0, 6)

    logSource('wc2026api')

    return {
      liveMatches,
      upcomingMatches,
      recentMatches,
      groups,
      topScorers: MOCK_DASHBOARD_DATA.topScorers,
      kpis: MOCK_DASHBOARD_DATA.kpis,
    }
  } catch {
    try {
      const [fixtures, standings, topScorers] = await Promise.all([
        getFixtures(WC_LEAGUE_ID, 2026),
        getStandings(WC_LEAGUE_ID),
        getTopScorers(WC_LEAGUE_ID),
      ])
      const liveMatches = fixtures.filter((match) => match.status === 'LIVE')
      const upcomingMatches = fixtures.filter((match) => match.status === 'UPCOMING').slice(0, 6)
      const recentMatches = fixtures.filter((match) => match.status === 'FT').slice(0, 6)

      logSource('apiFootball')

      return {
        liveMatches,
        upcomingMatches,
        recentMatches,
        groups: standings,
        topScorers,
        kpis: MOCK_DASHBOARD_DATA.kpis,
      }
    } catch {
      logSource('mock')
      return MOCK_DASHBOARD_DATA
    }
  }
}

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const matches = await getMatches()
    logSource('wc2026api')
    return matches.filter((match) => match.status === 'LIVE')
  } catch {
    try {
      const liveFixtures = await getLiveFixtures()
      logSource('apiFootball')
      return liveFixtures
    } catch {
      logSource('mock')
      return MOCK_DASHBOARD_DATA.liveMatches
    }
  }
}

export async function fetchGroupStandings(group: string): Promise<Group> {
  try {
    const groups = await getGroups()
    const selectedGroup = groups.find((item) => item.name === group)

    if (!selectedGroup) throw new Error('Group not found')

    logSource('wc2026api')
    return selectedGroup
  } catch {
    try {
      const groups = await getStandings(WC_LEAGUE_ID)
      const selectedGroup = groups.find((item) => item.name === group)

      if (!selectedGroup) throw new Error('Group not found')

      logSource('apiFootball')
      return selectedGroup
    } catch {
      const selectedGroup = MOCK_DASHBOARD_DATA.groups.find((item) => item.name === group)
      logSource('mock')
      return selectedGroup ?? MOCK_DASHBOARD_DATA.groups[0]
    }
  }
}

export async function fetchTopScorers(): Promise<PlayerStats[]> {
  try {
    const topScorers = await getTopScorers(WC_LEAGUE_ID)
    logSource('apiFootball')
    return topScorers
  } catch {
    logSource('mock')
    return MOCK_DASHBOARD_DATA.topScorers
  }
}

export async function fetchMatchDetail(id: string): Promise<Match> {
  try {
    const match = await getMatchById(id)
    logSource('wc2026api')
    return match
  } catch {
    const fromFallback = MOCK_DASHBOARD_DATA.liveMatches.find((match) => match.id === id)
      ?? MOCK_DASHBOARD_DATA.recentMatches.find((match) => match.id === id)
      ?? MOCK_DASHBOARD_DATA.upcomingMatches.find((match) => match.id === id)

    logSource('mock')

    if (fromFallback) {
      return fromFallback
    }

    return MOCK_DASHBOARD_DATA.recentMatches[0]
  }
}
