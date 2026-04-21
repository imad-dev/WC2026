// Fallback mock data when API is not available or rate limited
// NOTE: Using World Cup 2026 themed data as a preview
// Real API data will come from Premier League 2024 (free tier limitation)

export const mockLiveMatches = [
  { teamA: 'FRA', teamB: 'ARG', scoreA: 2, scoreB: 1 },
  { teamA: 'BRA', teamB: 'GER', scoreA: 1, scoreB: 1 },
  { teamA: 'ESP', teamB: 'POR', scoreA: 3, scoreB: 2 }
];

export const mockTodayMatches = [
  {
    teamA: { name: 'Brazil', flag: '🇧🇷', score: 2 },
    teamB: { name: 'Argentina', flag: '🇦🇷', score: 1 },
    status: 'LIVE' as const,
    time: '67\'',
    stadium: 'MetLife Stadium, New Jersey',
    scorers: [
      { team: 'A' as const, player: 'Vinicius Jr.', minute: 23 },
      { team: 'A' as const, player: 'Rodrygo', minute: 67 },
      { team: 'B' as const, player: 'Messi', minute: 45 }
    ],
    motm: 'Vinicius Jr.'
  },
  {
    teamA: { name: 'France', flag: '🇫🇷', score: 1 },
    teamB: { name: 'Germany', flag: '🇩🇪', score: 1 },
    status: 'LIVE' as const,
    time: '82\'',
    stadium: 'SoFi Stadium, Los Angeles',
    scorers: [
      { team: 'A' as const, player: 'Mbappé', minute: 12 },
      { team: 'B' as const, player: 'Havertz', minute: 78 }
    ]
  },
  {
    teamA: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', score: 0 },
    teamB: { name: 'Spain', flag: '🇪🇸', score: 0 },
    status: 'UPCOMING' as const,
    time: '20:00',
    stadium: 'AT&T Stadium, Dallas'
  }
];

export const mockGroupStandings = {
  F: [
    { pos: 1, team: 'Portugal', flag: '🇵🇹', mp: 3, w: 2, d: 1, l: 0, gf: 7, ga: 3, gd: 4, pts: 7, form: ['W' as const, 'W' as const, 'D' as const, 'W' as const, 'W' as const], qualified: true },
    { pos: 2, team: 'Morocco', flag: '🇲🇦', mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7, form: ['W' as const, 'D' as const, 'W' as const, 'W' as const, 'D' as const], qualified: true },
    { pos: 3, team: 'Croatia', flag: '🇭🇷', mp: 3, w: 1, d: 1, l: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: ['L' as const, 'W' as const, 'D' as const, 'L' as const, 'W' as const] },
    { pos: 4, team: 'Belgium', flag: '🇧🇪', mp: 3, w: 0, d: 0, l: 3, gf: 2, ga: 10, gd: -8, pts: 0, form: ['L' as const, 'L' as const, 'L' as const, 'L' as const, 'L' as const] }
  ]
};

export const mockTopScorers = [
  { rank: 1, player: 'Vinicius Jr.', nationality: '🇧🇷', team: 'Brazil', goals: 7, assists: 2, matches: 3, isTop: true },
  { rank: 2, player: 'Kylian Mbappé', nationality: '🇫🇷', team: 'France', goals: 6, assists: 3, matches: 3 },
  { rank: 3, player: 'Harry Kane', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'England', goals: 5, assists: 1, matches: 3 },
  { rank: 4, player: 'En-Nesyri', nationality: '🇲🇦', team: 'Morocco', goals: 5, assists: 0, matches: 3 },
  { rank: 5, player: 'Cristiano Ronaldo', nationality: '🇵🇹', team: 'Portugal', goals: 4, assists: 1, matches: 3 },
  { rank: 6, player: 'Lionel Messi', nationality: '🇦🇷', team: 'Argentina', goals: 4, assists: 2, matches: 3 },
  { rank: 7, player: 'Ziyech', nationality: '🇲🇦', team: 'Morocco', goals: 3, assists: 2, matches: 3 }
];

export const mockRecentMatches = [
  {
    group: 'Group F',
    date: 'Apr 18, 2026',
    teamA: { name: 'Morocco', flag: '🇲🇦', code: 'MAR', score: 2 },
    teamB: { name: 'Croatia', flag: '🇭🇷', code: 'CRO', score: 1 },
    scorers: { A: [{ name: 'Ziyech', time: '34' }, { name: 'En-Nesyri', time: '71' }], B: [{ name: 'Modrić', time: '89' }] },
    motm: 'Ziyech',
    stats: { possession: { a: 54, b: 46 }, shots: { a: 12, b: 8 }, corners: { a: 6, b: 4 } }
  },
  {
    group: 'Group F',
    date: 'Apr 18, 2026',
    teamA: { name: 'Portugal', flag: '🇵🇹', code: 'POR', score: 3 },
    teamB: { name: 'Belgium', flag: '🇧🇪', code: 'BEL', score: 2 },
    scorers: { A: [{ name: 'Ronaldo', time: '15' }, { name: 'Bruno Fernandes', time: '42' }, { name: 'Bernardo Silva', time: '88' }], B: [{ name: 'De Bruyne', time: '56' }, { name: 'Lukaku', time: '73' }] },
    motm: 'Bruno Fernandes',
    stats: { possession: { a: 58, b: 42 }, shots: { a: 15, b: 11 }, corners: { a: 7, b: 3 } }
  }
];
