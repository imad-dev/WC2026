import type { DashboardData, FormResult, Group, Match, MatchPhase, MatchStatus, Player, PlayerStats, Team } from '@/types'

function createTeam(id: string, name: string, code: string, group: string, country: string): Team {
  return {
    id,
    name,
    code,
    flagUrl: `https://flagcdn.com/w80/${code.toLowerCase().slice(0, 2)}.png`,
    group,
    country,
  }
}

function createMatch(
  id: string,
  homeTeam: Team,
  awayTeam: Team,
  homeScore: number | null,
  awayScore: number | null,
  status: MatchStatus,
  phase: MatchPhase,
  date: string,
  minute?: number
): Match {
  return {
    id,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status,
    phase,
    group: phase === 'GROUP' ? homeTeam.group : undefined,
    minute,
    date,
    stadium: 'MetLife Stadium',
    city: 'New York',
    stats: {
      homePossession: 54,
      awayPossession: 46,
      homeShots: 12,
      awayShots: 8,
      homeShotsOnTarget: 5,
      awayShotsOnTarget: 3,
      homeCorners: 6,
      awayCorners: 4,
      homePassAccuracy: 87,
      awayPassAccuracy: 91,
    },
  }
}

function createPlayer(id: string, name: string, nationality: string, teamId: string): Player {
  const [firstName = '', ...rest] = name.split(' ')

  return {
    id,
    name,
    firstName,
    lastName: rest.join(' ') || firstName,
    nationality,
    teamId,
    position: 'FWD',
  }
}

const teams = {
  MAR: createTeam('team-mar', 'Morocco', 'MAR', 'F', 'Morocco'),
  FRA: createTeam('team-fra', 'France', 'FRA', 'F', 'France'),
  BRA: createTeam('team-bra', 'Brazil', 'BRA', 'F', 'Brazil'),
  ARG: createTeam('team-arg', 'Argentina', 'ARG', 'F', 'Argentina'),
  POR: createTeam('team-por', 'Portugal', 'POR', 'F', 'Portugal'),
  BEL: createTeam('team-bel', 'Belgium', 'BEL', 'F', 'Belgium'),
  JPN: createTeam('team-jpn', 'Japan', 'JPN', 'F', 'Japan'),
  CAN: createTeam('team-can', 'Canada', 'CAN', 'F', 'Canada'),
}

function createGroup(name: string, rows: Array<{ code: keyof typeof teams; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number; form: Array<'W' | 'D' | 'L'> }>): Group {
  return {
    name,
    standings: rows.map((row, index) => ({
      position: index + 1,
      team: teams[row.code],
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.gf,
      goalsAgainst: row.ga,
      goalDifference: row.gf - row.ga,
      points: row.points,
      form: row.form,
    })),
  }
}

const genericGroups = ['A', 'B', 'C', 'D', 'E', 'G', 'H'].map((groupName) => {
  const seed = groupName.charCodeAt(0) - 64

  return {
    name: groupName,
    standings: Array.from({ length: 6 }, (_, i) => {
      const points = Math.max(0, 13 - i * 2 - (seed % 2))
      const goalsFor = 10 - i
      const goalsAgainst = 4 + i

      return {
        position: i + 1,
        team: createTeam(
          `team-${groupName}-${i + 1}`,
          `Team ${groupName}${i + 1}`,
          `${groupName}${i + 1}`,
          groupName,
          `Country ${groupName}${i + 1}`
        ),
        played: 6,
        won: Math.max(0, 4 - i),
        drawn: i < 2 ? 1 : i === 2 ? 0 : 2,
        lost: i > 2 ? 2 + (i % 2) : i,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points,
        form: (['W', 'D', 'W', 'L', 'W'] as FormResult[]).slice(0, 5),
      }
    }),
  }
})

const groupF = createGroup('F', [
  { code: 'MAR', played: 6, won: 4, drawn: 1, lost: 1, gf: 9, ga: 4, points: 13, form: ['W', 'W', 'D', 'W', 'L'] },
  { code: 'BRA', played: 6, won: 3, drawn: 2, lost: 1, gf: 10, ga: 5, points: 11, form: ['W', 'D', 'W', 'D', 'L'] },
  { code: 'FRA', played: 6, won: 3, drawn: 1, lost: 2, gf: 8, ga: 6, points: 10, form: ['W', 'L', 'W', 'D', 'L'] },
  { code: 'POR', played: 6, won: 2, drawn: 2, lost: 2, gf: 7, ga: 7, points: 8, form: ['D', 'W', 'L', 'W', 'L'] },
  { code: 'BEL', played: 6, won: 1, drawn: 2, lost: 3, gf: 6, ga: 9, points: 5, form: ['L', 'D', 'L', 'W', 'L'] },
  { code: 'JPN', played: 6, won: 1, drawn: 0, lost: 5, gf: 4, ga: 13, points: 3, form: ['L', 'L', 'W', 'L', 'L'] },
])

const topScorers: PlayerStats[] = [
  ['player-vinicius', 'Vinicius Jr', 'Brazil', teams.BRA, 7, 2],
  ['player-ennesyri', 'En-Nesyri', 'Morocco', teams.MAR, 6, 1],
  ['player-mbappe', 'Kylian Mbappe', 'France', teams.FRA, 5, 3],
  ['player-salah', 'Mohamed Salah', 'Egypt', teams.ARG, 4, 1],
  ['player-bellingham', 'Jude Bellingham', 'England', teams.BEL, 4, 2],
  ['player-kane', 'Harry Kane', 'England', teams.POR, 4, 1],
  ['player-messi', 'Lionel Messi', 'Argentina', teams.ARG, 3, 2],
  ['player-bruno', 'Bruno Fernandes', 'Portugal', teams.POR, 3, 2],
  ['player-ziyech', 'Hakim Ziyech', 'Morocco', teams.MAR, 3, 3],
  ['player-griezmann', 'Antoine Griezmann', 'France', teams.FRA, 3, 1],
].map(([id, name, nationality, team, goals, assists], index) => ({
  player: createPlayer(id as string, name as string, nationality as string, (team as Team).id),
  team: team as Team,
  goals: goals as number,
  assists: assists as number,
  matchesPlayed: 7,
  minutesPlayed: 560 - index * 12,
  yellowCards: index % 2,
  redCards: index % 9 === 0 ? 1 : 0,
}))

const liveMatches: Match[] = [
  createMatch('live-1', teams.MAR, teams.FRA, 2, 1, 'LIVE', 'SF', '2026-04-20T18:00:00.000Z', 67),
  createMatch('live-2', teams.BRA, teams.ARG, 1, 0, 'LIVE', 'SF', '2026-04-20T20:00:00.000Z', 43),
]

const upcomingMatches: Match[] = [
  createMatch('upcoming-1', teams.POR, teams.BEL, null, null, 'UPCOMING', 'QF', '2026-04-21T18:00:00.000Z'),
  createMatch('upcoming-2', teams.JPN, teams.CAN, null, null, 'UPCOMING', 'GROUP', '2026-04-22T15:30:00.000Z'),
]

const recentMatches: Match[] = [
  createMatch('recent-1', teams.MAR, teams.BEL, 2, 0, 'FT', 'GROUP', '2026-04-18T18:00:00.000Z'),
  createMatch('recent-2', teams.BRA, teams.POR, 3, 2, 'FT', 'GROUP', '2026-04-18T21:00:00.000Z'),
  createMatch('recent-3', teams.ARG, teams.FRA, 1, 1, 'FT', 'GROUP', '2026-04-19T18:00:00.000Z'),
  createMatch('recent-4', teams.JPN, teams.CAN, 0, 1, 'FT', 'GROUP', '2026-04-19T21:00:00.000Z'),
]

export const MOCK_DASHBOARD_DATA: DashboardData = {
  liveMatches,
  upcomingMatches,
  recentMatches,
  groups: [...genericGroups.slice(0, 5), groupF, ...genericGroups.slice(5)],
  topScorers,
  kpis: {
    totalGoals: 147,
    goalsPerMatch: 3.1,
    cleanSheets: 18,
    yellowCards: 89,
    redCards: 9,
    totalMatches: 104,
    matchesPlayed: 47,
  },
}
