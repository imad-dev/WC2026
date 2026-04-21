import { AxiosError } from 'axios'
import { axiosInstance } from '@/lib/axiosInstance'
import type { ApiError, Group, Match, MatchPhase, MatchStatus, MatchStats, Team } from '@/types'

const WC2026_BASE_URL = 'https://api.wc2026api.com'

function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>
  const status = axiosError.response?.status
  const message =
    axiosError.response?.data?.message
    || axiosError.response?.data?.error
    || axiosError.message
    || 'Unknown API error'

  return {
    message,
    status,
    retryable: status ? status >= 500 || status === 429 : true,
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

function toString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function mapStatus(value: unknown): MatchStatus {
  const candidate = toString(value).toLowerCase()
  if (candidate === 'live') return 'LIVE'
  if (candidate === 'completed') return 'FT'
  if (candidate === 'scheduled') return 'UPCOMING'
  return 'UPCOMING'
}

function mapPhase(value: unknown): MatchPhase {
  const candidate = toString(value).toUpperCase()
  if (candidate === 'GROUP') return 'GROUP'
  if (candidate === 'R16') return 'R16'
  if (candidate === 'QF') return 'QF'
  if (candidate === 'SF') return 'SF'
  if (candidate === 'FINAL') return 'FINAL'
  return 'GROUP'
}

function normalizeTeam(rawTeam: unknown): Team {
  const record = asRecord(rawTeam)

  return {
    id: String(record.id ?? crypto.randomUUID()),
    name: toString(record.name, 'Unknown Team'),
    code: toString(record.code, 'UNK'),
    flagUrl: toString(record.flag_url, ''),
    group: toString(record.group_name, ''),
    country: toString(record.country, toString(record.name, 'Unknown')),
  }
}

function normalizeTeamFromMatch(record: Record<string, unknown>, side: 'home' | 'away'): Team {
  return {
    id: String(record[`${side}_team_id`] ?? crypto.randomUUID()),
    name: toString(record[`${side}_team`], 'Unknown Team'),
    code: toString(record[`${side}_team_code`], 'UNK'),
    flagUrl: toString(record[`${side}_team_flag`], ''),
    group: toString(record.group_name, ''),
    country: toString(record[`${side}_team`], 'Unknown'),
  }
}

function normalizeStats(rawStats: unknown): MatchStats | undefined {
  const record = asRecord(rawStats)
  if (Object.keys(record).length === 0) return undefined

  return {
    homePossession: toNumber(record.home_possession),
    awayPossession: toNumber(record.away_possession),
    homeShots: toNumber(record.home_shots),
    awayShots: toNumber(record.away_shots),
    homeShotsOnTarget: toNumber(record.home_shots_on_target),
    awayShotsOnTarget: toNumber(record.away_shots_on_target),
    homeCorners: toNumber(record.home_corners),
    awayCorners: toNumber(record.away_corners),
    homePassAccuracy: toNumber(record.home_pass_accuracy),
    awayPassAccuracy: toNumber(record.away_pass_accuracy),
  }
}

function normalizeMatch(rawMatch: unknown): Match {
  const record = asRecord(rawMatch)

  return {
    id: String(record.id ?? crypto.randomUUID()),
    homeTeam: normalizeTeamFromMatch(record, 'home'),
    awayTeam: normalizeTeamFromMatch(record, 'away'),
    homeScore: toNullableNumber(record.home_score),
    awayScore: toNullableNumber(record.away_score),
    status: mapStatus(record.status),
    phase: mapPhase(record.round),
    group: toString(record.group_name, ''),
    minute: typeof record.match_minute === 'number' ? record.match_minute : undefined,
    date: toString(record.kickoff_utc, new Date().toISOString()),
    stadium: toString(record.stadium, 'TBD Stadium'),
    city: toString(record.stadium_city, 'TBD City'),
    stats: normalizeStats(record.stats),
  }
}

function normalizeGroup(rawGroup: unknown): Group {
  const record = asRecord(rawGroup)

  const standingsSource = Array.isArray(record.standings)
    ? record.standings
    : Array.isArray(record.teams)
      ? record.teams
      : []

  return {
    name: toString(record.name, 'A'),
    standings: standingsSource.map((row, index) => {
      const rowRecord = asRecord(row)

      const team: Team = {
        id: String(rowRecord.team_id ?? rowRecord.id ?? crypto.randomUUID()),
        name: toString(rowRecord.team_name, toString(rowRecord.name, 'Unknown Team')),
        code: toString(rowRecord.team_code, toString(rowRecord.code, 'UNK')),
        flagUrl: toString(rowRecord.flag_url, ''),
        group: toString(rowRecord.group_name, toString(record.name, '')),
        country: toString(rowRecord.country, toString(rowRecord.team_name, toString(rowRecord.name, 'Unknown'))),
      }

      return {
        position: toNumber(rowRecord.position, index + 1),
        team,
        played: toNumber(rowRecord.played),
        won: toNumber(rowRecord.won),
        drawn: toNumber(rowRecord.drawn),
        lost: toNumber(rowRecord.lost),
        goalsFor: toNumber(rowRecord.goals_for),
        goalsAgainst: toNumber(rowRecord.goals_against),
        goalDifference: toNumber(rowRecord.goal_difference),
        points: toNumber(rowRecord.points),
        form: Array.isArray(rowRecord.form) ? (rowRecord.form as Array<'W' | 'D' | 'L'>) : [],
      }
    }),
  }
}

function authHeaders() {
  return {
    Authorization: `Bearer ${import.meta.env.VITE_WC2026_API_KEY ?? ''}`,
  }
}

/**
 * Fetches all tournament matches.
 * @returns A normalized list of matches.
 */
export async function getMatches(): Promise<Match[]> {
  try {
    const response = await axiosInstance.get(`${WC2026_BASE_URL}/matches`, {
      headers: authHeaders(),
    })

    const rows = Array.isArray(response.data) ? response.data : []
    return rows.map(normalizeMatch)
  } catch (error) {
    throw toApiError(error)
  }
}

/**
 * Fetches all group standings.
 * @returns A normalized list of groups.
 */
export async function getGroups(): Promise<Group[]> {
  try {
    const response = await axiosInstance.get(`${WC2026_BASE_URL}/groups`, {
      headers: authHeaders(),
    })

    const rows = Array.isArray(response.data) ? response.data : []
    return rows.map(normalizeGroup)
  } catch (error) {
    throw toApiError(error)
  }
}

/**
 * Fetches all tournament teams.
 * @returns A normalized list of teams.
 */
export async function getTeams(): Promise<Team[]> {
  try {
    const response = await axiosInstance.get(`${WC2026_BASE_URL}/teams`, {
      headers: authHeaders(),
    })

    const rows = Array.isArray(response.data) ? response.data : []
    return rows.map(normalizeTeam)
  } catch (error) {
    throw toApiError(error)
  }
}

/**
 * Fetches a single match by identifier.
 * @param id Match identifier.
 * @returns A normalized match object.
 */
export async function getMatchById(id: string): Promise<Match> {
  try {
    const response = await axiosInstance.get(`${WC2026_BASE_URL}/matches/${id}`, {
      headers: authHeaders(),
    })

    return normalizeMatch(response.data)
  } catch (error) {
    throw toApiError(error)
  }
}
