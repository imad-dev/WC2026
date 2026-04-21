import { AxiosError } from 'axios'
import { axiosInstance } from '@/lib/axiosInstance'
import type {
  ApiError,
  FormResult,
  Group,
  Match,
  MatchPhase,
  MatchStatus,
  MatchStats,
  Player,
  PlayerStats,
  StandingRow,
  Team,
} from '@/types'

const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io'
export const WC_LEAGUE_ID = 1
const WC_SEASON = 2026

function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<{ message?: string }>
  const status = axiosError.response?.status
  const message = axiosError.response?.data?.message || axiosError.message || 'API-Football request failed'

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

function toStatus(shortStatus: string): MatchStatus {
  if (['1H', '2H', 'ET', 'P', 'LIVE'].includes(shortStatus)) return 'LIVE'
  if (['HT'].includes(shortStatus)) return 'HT'
  if (['FT', 'AET', 'PEN'].includes(shortStatus)) return 'FT'
  if (['CANC', 'PST', 'ABD'].includes(shortStatus)) return 'CANCELLED'
  return 'UPCOMING'
}

function toPhase(round: string): MatchPhase {
  const normalized = round.toLowerCase()
  if (normalized.includes('round of 16')) return 'R16'
  if (normalized.includes('quarter')) return 'QF'
  if (normalized.includes('semi')) return 'SF'
  if (normalized.includes('final')) return 'FINAL'
  return 'GROUP'
}

function headers() {
  return {
    'x-apisports-key': import.meta.env.VITE_API_FOOTBALL_KEY ?? '',
  }
}

function teamFromApi(raw: unknown, group = ''): Team {
  const record = asRecord(raw)

  return {
    id: String(record.id ?? ''),
    name: toString(record.name, 'Unknown Team'),
    code: toString(record.code, 'UNK'),
    flagUrl: toString(record.logo, ''),
    group,
    country: toString(record.country, toString(record.name, 'Unknown')),
  }
}

function normalizeFixture(rawFixture: unknown): Match {
  const fixtureRecord = asRecord(rawFixture)
  const fixture = asRecord(fixtureRecord.fixture)
  const league = asRecord(fixtureRecord.league)
  const teams = asRecord(fixtureRecord.teams)
  const goals = asRecord(fixtureRecord.goals)
  const score = asRecord(fixtureRecord.score)
  const fulltime = asRecord(score.fulltime)

  const homeTeam = teamFromApi(teams.home, toString(league.round, 'GROUP'))
  const awayTeam = teamFromApi(teams.away, toString(league.round, 'GROUP'))
  const shortStatus = toString(asRecord(fixture.status).short, 'NS')
  const date = toString(fixture.date, new Date().toISOString())

  const stats: MatchStats | undefined = undefined

  return {
    id: String(fixture.id ?? crypto.randomUUID()),
    homeTeam,
    awayTeam,
    homeScore: toNullableNumber(goals.home ?? fulltime.home),
    awayScore: toNullableNumber(goals.away ?? fulltime.away),
    status: toStatus(shortStatus),
    phase: toPhase(toString(league.round, 'Group Stage')),
    group: toString(league.round, undefined),
    minute: toNumber(asRecord(fixture.status).elapsed, undefined),
    date,
    stadium: toString(asRecord(fixture.venue).name, 'TBD Stadium'),
    city: toString(asRecord(fixture.venue).city, 'TBD City'),
    stats,
  }
}

function parseForm(form: string): FormResult[] {
  return form
    .split('')
    .filter((char): char is FormResult => char === 'W' || char === 'D' || char === 'L')
}

function normalizeStanding(rawStanding: unknown): StandingRow {
  const record = asRecord(rawStanding)
  const team = teamFromApi(record.team, toString(record.group, ''))
  const all = asRecord(record.all)
  const goals = asRecord(all.goals)

  return {
    position: toNumber(record.rank),
    team,
    played: toNumber(all.played),
    won: toNumber(all.win),
    drawn: toNumber(all.draw),
    lost: toNumber(all.lose),
    goalsFor: toNumber(goals.for),
    goalsAgainst: toNumber(goals.against),
    goalDifference: toNumber(record.goalsDiff),
    points: toNumber(record.points),
    form: parseForm(toString(record.form, '')),
  }
}

export async function getFixtures(leagueId: number, season = WC_SEASON): Promise<Match[]> {
  try {
    const response = await axiosInstance.get(`${API_FOOTBALL_BASE_URL}/fixtures`, {
      params: { league: leagueId, season },
      headers: headers(),
    })

    const payload = asRecord(response.data)
    const rows = Array.isArray(payload.response) ? payload.response : []

    return rows.map(normalizeFixture)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getStandings(leagueId: number): Promise<Group[]> {
  try {
    const response = await axiosInstance.get(`${API_FOOTBALL_BASE_URL}/standings`, {
      params: { league: leagueId, season: WC_SEASON },
      headers: headers(),
    })

    const payload = asRecord(response.data)
    const responseRows = Array.isArray(payload.response) ? payload.response : []

    const groups = responseRows.flatMap((entry) => {
      const league = asRecord(asRecord(entry).league)
      const standingsGroups = Array.isArray(league.standings) ? league.standings : []

      return standingsGroups.map((groupRows) => {
        const rows = Array.isArray(groupRows) ? groupRows : []
        const first = asRecord(rows[0])

        return {
          name: toString(first.group, 'A').replace('Group ', ''),
          standings: rows.map(normalizeStanding),
        }
      })
    })

    return groups
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getTopScorers(leagueId: number): Promise<PlayerStats[]> {
  try {
    const response = await axiosInstance.get(`${API_FOOTBALL_BASE_URL}/players/topscorers`, {
      params: { league: leagueId, season: WC_SEASON },
      headers: headers(),
    })

    const payload = asRecord(response.data)
    const rows = Array.isArray(payload.response) ? payload.response : []

    return rows.map((row) => {
      const record = asRecord(row)
      const playerRaw = asRecord(record.player)
      const statistics = Array.isArray(record.statistics) ? asRecord(record.statistics[0]) : {}
      const team = teamFromApi(asRecord(statistics.team))
      const goals = asRecord(statistics.goals)
      const cards = asRecord(statistics.cards)
      const games = asRecord(statistics.games)
      const shots = asRecord(statistics.shots)

      const player: Player = {
        id: String(playerRaw.id ?? crypto.randomUUID()),
        name: toString(playerRaw.name, 'Unknown Player'),
        firstName: toString(playerRaw.firstname, 'Unknown'),
        lastName: toString(playerRaw.lastname, 'Player'),
        nationality: toString(playerRaw.nationality, 'Unknown'),
        teamId: team.id,
        position: 'FWD',
        photoUrl: toString(playerRaw.photo, undefined),
      }

      return {
        player,
        team,
        goals: toNumber(goals.total),
        assists: toNumber(goals.assists),
        matchesPlayed: toNumber(games.appearences),
        minutesPlayed: toNumber(games.minutes),
        yellowCards: toNumber(cards.yellow),
        redCards: toNumber(cards.red),
        shotsOnTarget: toNumber(shots.on),
        xG: undefined,
      }
    })
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getLiveFixtures(): Promise<Match[]> {
  try {
    const response = await axiosInstance.get(`${API_FOOTBALL_BASE_URL}/fixtures`, {
      params: { live: 'all' },
      headers: headers(),
    })

    const payload = asRecord(response.data)
    const rows = Array.isArray(payload.response) ? payload.response : []

    return rows.map(normalizeFixture)
  } catch (error) {
    throw toApiError(error)
  }
}
