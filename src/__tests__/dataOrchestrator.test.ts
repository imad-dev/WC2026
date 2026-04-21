import { fetchDashboardData, fetchLiveMatches } from '@/api/dataOrchestrator'
import { MOCK_DASHBOARD_DATA } from '@/api/mockData'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/api/wc2026Api', () => ({
  getMatches: vi.fn().mockRejectedValue(new Error('wc failed')),
  getGroups: vi.fn().mockRejectedValue(new Error('wc failed')),
  getMatchById: vi.fn().mockRejectedValue(new Error('wc failed')),
}))

vi.mock('@/api/apiFootball', () => ({
  WC_LEAGUE_ID: 1,
  getFixtures: vi.fn().mockRejectedValue(new Error('api football failed')),
  getLiveFixtures: vi.fn().mockRejectedValue(new Error('api football failed')),
  getStandings: vi.fn().mockRejectedValue(new Error('api football failed')),
  getTopScorers: vi.fn().mockRejectedValue(new Error('api football failed')),
}))

describe('dataOrchestrator', () => {
  it('fetchDashboardData falls back to mock data when APIs fail', async () => {
    const data = await fetchDashboardData()

    expect(data.kpis.totalGoals).toBe(MOCK_DASHBOARD_DATA.kpis.totalGoals)
    expect(data.groups.length).toBeGreaterThan(0)
  })

  it('fetchLiveMatches returns fallback list instead of crashing', async () => {
    const data = await fetchLiveMatches()

    expect(Array.isArray(data)).toBe(true)
  })
})
