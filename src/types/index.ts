export interface Team {
  id: string
  name: string
  code: string
  flagUrl: string
  group: string
  country: string
}

export interface Player {
  id: string
  name: string
  firstName: string
  lastName: string
  nationality: string
  teamId: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  photoUrl?: string
  jerseyNumber?: number
}

export type MatchStatus = 'LIVE' | 'FT' | 'UPCOMING' | 'HT' | 'CANCELLED'
export type MatchPhase = 'GROUP' | 'R16' | 'QF' | 'SF' | 'FINAL'
export type FormResult = 'W' | 'D' | 'L'

export interface MatchEvent {
  minute: number
  type: 'GOAL' | 'RED_CARD' | 'YELLOW_CARD' | 'SUBSTITUTION'
  playerId: string
  playerName: string
  teamId: string
}

export interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  status: MatchStatus
  phase: MatchPhase
  group?: string
  minute?: number
  date: string
  stadium: string
  city: string
  events?: MatchEvent[]
  stats?: MatchStats
}

export interface MatchStats {
  homePossession: number
  awayPossession: number
  homeShots: number
  awayShots: number
  homeShotsOnTarget: number
  awayShotsOnTarget: number
  homeCorners: number
  awayCorners: number
  homePassAccuracy: number
  awayPassAccuracy: number
}

export interface StandingRow {
  position: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: FormResult[]
}

export interface Group {
  name: string
  standings: StandingRow[]
}

export interface PlayerStats {
  player: Player
  team: Team
  goals: number
  assists: number
  matchesPlayed: number
  minutesPlayed: number
  yellowCards: number
  redCards: number
  shotsOnTarget?: number
  xG?: number
}

export interface TournamentKPIs {
  totalGoals: number
  goalsPerMatch: number
  cleanSheets: number
  yellowCards: number
  redCards: number
  totalMatches: number
  matchesPlayed: number
}

export interface DashboardData {
  liveMatches: Match[]
  upcomingMatches: Match[]
  recentMatches: Match[]
  groups: Group[]
  topScorers: PlayerStats[]
  kpis: TournamentKPIs
}

export interface ApiResponse<T> {
  data: T
  source: 'wc2026api' | 'apiFootball' | 'ballDontLie' | 'mock'
  timestamp: number
  cached: boolean
}

export interface ApiError {
  message: string
  status?: number
  retryable: boolean
}
