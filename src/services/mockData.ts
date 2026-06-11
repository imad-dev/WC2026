export function generatePredictedLineups(homeTeam: any, awayTeam: any, players: any[] = []) {
  const lineups: any[] = [];

  const createFormation = (team: any, isHome: boolean) => {
    const teamPlayers = players.filter(p => p.team_id === team.id);
    const formation = [1, 4, 3, 3]; // Default 4-3-3
    const positions = [
      { pos: 'GK', x: 0.5, y: 0.9 },
      // Defenders
      { pos: 'LB', x: 0.15, y: 0.75 },
      { pos: 'CB', x: 0.35, y: 0.8 },
      { pos: 'CB', x: 0.65, y: 0.8 },
      { pos: 'RB', x: 0.85, y: 0.75 },
      // Midfielders
      { pos: 'CM', x: 0.3, y: 0.5 },
      { pos: 'CDM', x: 0.5, y: 0.65 },
      { pos: 'CM', x: 0.7, y: 0.5 },
      // Attackers
      { pos: 'LW', x: 0.2, y: 0.25 },
      { pos: 'ST', x: 0.5, y: 0.15 },
      { pos: 'RW', x: 0.8, y: 0.25 },
    ];

    // Subtitutes
    const subs = [
      { pos: 'GK' }, { pos: 'CB' }, { pos: 'CM' }, { pos: 'ST' }, { pos: 'LW' }
    ];

    let playerIndex = 0;

    // Generate Starting XI
    positions.forEach((p, idx) => {
      const realPlayer = teamPlayers[playerIndex];
      playerIndex++;

      lineups.push({
        id: `${team.id}-start-${idx}`,
        team_id: team.id,
        is_starting: true,
        shirt_number: realPlayer?.number || (idx + 1),
        position_x: isHome ? p.x : 1 - p.x,
        position_y: isHome ? p.y : 1 - p.y, // Away team attacks the other way
        rating: (Math.random() * 2 + 6.5).toFixed(1), // 6.5 to 8.5
        player: realPlayer || {
          name: `${team.name} Player ${idx + 1}`,
          short_name: `Player ${idx + 1}`,
          age: Math.floor(Math.random() * 10) + 20,
          club_name: 'Unknown FC',
          position: p.pos,
          number: idx + 1,
        }
      });
    });

    // Generate Bench
    subs.forEach((p, idx) => {
      const realPlayer = teamPlayers[playerIndex];
      playerIndex++;

      lineups.push({
        id: `${team.id}-sub-${idx}`,
        team_id: team.id,
        is_starting: false,
        shirt_number: realPlayer?.number || (idx + 12),
        rating: '-',
        player: realPlayer || {
          name: `${team.name} Sub ${idx + 1}`,
          short_name: `Sub ${idx + 1}`,
          age: Math.floor(Math.random() * 10) + 20,
          club_name: 'Unknown FC',
          position: p.pos,
          number: idx + 12,
        }
      });
    });
  };

  if (homeTeam) createFormation(homeTeam, true);
  if (awayTeam) createFormation(awayTeam, false);

  return lineups as any;
}

export function generateH2H(homeTeam: any, awayTeam: any) {
  if (!homeTeam || !awayTeam) return [];
  
  // Generate 3 historical matches between these teams
  const h2h: any[] = [];
  const competitions = ['FIFA World Cup', 'Friendly International', 'Confederations Cup'];
  
  for (let i = 0; i < 3; i++) {
    const isHome = i % 2 === 0;
    const date = new Date();
    date.setFullYear(date.getFullYear() - (i + 1) * 2);
    date.setMonth(Math.floor(Math.random() * 12));
    
    h2h.push({
      id: `h2h-${i}`,
      competition: competitions[i % competitions.length],
      match_date: date.toISOString(),
      home_team_id: isHome ? homeTeam.id : awayTeam.id,
      away_team_id: isHome ? awayTeam.id : homeTeam.id,
      home_score: Math.floor(Math.random() * 4),
      away_score: Math.floor(Math.random() * 3),
      home_team: isHome ? homeTeam : awayTeam,
      away_team: isHome ? awayTeam : homeTeam,
    });
  }

  return h2h as any;
}
