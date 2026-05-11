// Official FIFA World Cup 2026 — Fully Updated April 2026

export const TOURNAMENT_INFO = {
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  hostCountries: ['USA', 'Canada', 'Mexico'],
  totalTeams: 48,
  totalMatches: 104,
  totalStadiums: 16,
  opener: {
    homeTeam: 'Mexico', awayTeam: 'South Africa',
    date: '2026-06-11T20:00:00Z',
    stadium: 'Estadio Azteca', city: 'Mexico City',
    homeFlag: '🇲🇽', awayFlag: '🇿🇦',
  },
  final: { date: '2026-07-19T20:00:00Z', stadium: 'MetLife Stadium', city: 'East Rutherford, NJ' },
};

export const WC2026_GROUPS: Record<string, Array<{ name: string; flag: string; confederation: string }>> = {
  A: [
    { name: 'Mexico',        flag: '🇲🇽', confederation: 'CONCACAF' },
    { name: 'South Africa',  flag: '🇿🇦', confederation: 'CAF' },
    { name: 'South Korea',   flag: '🇰🇷', confederation: 'AFC' },
    { name: 'Czech Republic',flag: '🇨🇿', confederation: 'UEFA' },
  ],
  B: [
    { name: 'Canada',       flag: '🇨🇦', confederation: 'CONCACAF' },
    { name: 'Bosnia-Herz.', flag: '🇧🇦', confederation: 'UEFA' },
    { name: 'Qatar',        flag: '🇶🇦', confederation: 'AFC' },
    { name: 'Switzerland',  flag: '🇨🇭', confederation: 'UEFA' },
  ],
  C: [
    { name: 'Brazil',  flag: '🇧🇷', confederation: 'CONMEBOL' },
    { name: 'Morocco', flag: '🇲🇦', confederation: 'CAF' },
    { name: 'Haiti',   flag: '🇭🇹', confederation: 'CONCACAF' },
    { name: 'Scotland',flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA' },
  ],
  D: [
    { name: 'USA',       flag: '🇺🇸', confederation: 'CONCACAF' },
    { name: 'Paraguay',  flag: '🇵🇾', confederation: 'CONMEBOL' },
    { name: 'Australia', flag: '🇦🇺', confederation: 'AFC' },
    { name: 'Turkey',    flag: '🇹🇷', confederation: 'UEFA' },
  ],
  E: [
    { name: 'Germany',       flag: '🇩🇪', confederation: 'UEFA' },
    { name: 'Curaçao',       flag: '🇨🇼', confederation: 'CONCACAF' },
    { name: "Côte d'Ivoire", flag: '🇨🇮', confederation: 'CAF' },
    { name: 'Ecuador',       flag: '🇪🇨', confederation: 'CONMEBOL' },
  ],
  F: [
    { name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA' },
    { name: 'Japan',       flag: '🇯🇵', confederation: 'AFC' },
    { name: 'Sweden',      flag: '🇸🇪', confederation: 'UEFA' },
    { name: 'Tunisia',     flag: '🇹🇳', confederation: 'CAF' },
  ],
  G: [
    { name: 'Belgium',     flag: '🇧🇪', confederation: 'UEFA' },
    { name: 'Egypt',       flag: '🇪🇬', confederation: 'CAF' },
    { name: 'Iran',        flag: '🇮🇷', confederation: 'AFC' },
    { name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC' },
  ],
  H: [
    { name: 'Spain',        flag: '🇪🇸', confederation: 'UEFA' },
    { name: 'Cape Verde',   flag: '🇨🇻', confederation: 'CAF' },
    { name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC' },
    { name: 'Uruguay',      flag: '🇺🇾', confederation: 'CONMEBOL' },
  ],
  I: [
    { name: 'France',  flag: '🇫🇷', confederation: 'UEFA' },
    { name: 'Senegal', flag: '🇸🇳', confederation: 'CAF' },
    { name: 'Iraq',    flag: '🇮🇶', confederation: 'AFC' },
    { name: 'Norway',  flag: '🇳🇴', confederation: 'UEFA' },
  ],
  J: [
    { name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL' },
    { name: 'Algeria',   flag: '🇩🇿', confederation: 'CAF' },
    { name: 'Austria',   flag: '🇦🇹', confederation: 'UEFA' },
    { name: 'Jordan',    flag: '🇯🇴', confederation: 'AFC' },
  ],
  K: [
    { name: 'Portugal',   flag: '🇵🇹', confederation: 'UEFA' },
    { name: 'DR Congo',   flag: '🇨🇩', confederation: 'CAF' },
    { name: 'Uzbekistan', flag: '🇺🇿', confederation: 'AFC' },
    { name: 'Colombia',   flag: '🇨🇴', confederation: 'CONMEBOL' },
  ],
  L: [
    { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
    { name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA' },
    { name: 'Ghana',   flag: '🇬🇭', confederation: 'CAF' },
    { name: 'Panama',  flag: '🇵🇦', confederation: 'CONCACAF' },
  ],
};

export interface WCFixture {
  date: string; time: string; group: string;
  home: string; homeFlag: string;
  away: string; awayFlag: string;
  stage: string;
  homeScore?: number; awayScore?: number;
}

const FLAG: Record<string, string> = {
  'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷','Czech Republic':'🇨🇿',
  'Canada':'🇨🇦','Bosnia-Herz.':'🇧🇦','Qatar':'🇶🇦','Switzerland':'🇨🇭',
  'Brazil':'🇧🇷','Morocco':'🇲🇦','Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA':'🇺🇸','Paraguay':'🇵🇾','Australia':'🇦🇺','Turkey':'🇹🇷',
  'Germany':'🇩🇪','Curaçao':'🇨🇼',"Côte d'Ivoire":'🇨🇮','Ecuador':'🇪🇨',
  'Netherlands':'🇳🇱','Japan':'🇯🇵','Sweden':'🇸🇪','Tunisia':'🇹🇳',
  'Belgium':'🇧🇪','Egypt':'🇪🇬','Iran':'🇮🇷','New Zealand':'🇳🇿',
  'Spain':'🇪🇸','Cape Verde':'🇨🇻','Saudi Arabia':'🇸🇦','Uruguay':'🇺🇾',
  'France':'🇫🇷','Senegal':'🇸🇳','Iraq':'🇮🇶','Norway':'🇳🇴',
  'Argentina':'🇦🇷','Algeria':'🇩🇿','Austria':'🇦🇹','Jordan':'🇯🇴',
  'Portugal':'🇵🇹','DR Congo':'🇨🇩','Uzbekistan':'🇺🇿','Colombia':'🇨🇴',
  'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croatia':'🇭🇷','Ghana':'🇬🇭','Panama':'🇵🇦',
};
export const getWCFlag = (name: string) => FLAG[name] || '⚽';

const f = (date: string, time: string, group: string, home: string, away: string): WCFixture => ({
  date, time, group, stage: 'Group Stage',
  home, homeFlag: FLAG[home] || '⚽', away, awayFlag: FLAG[away] || '⚽',
});

export const WC2026_FIXTURES: WCFixture[] = [
  f('2026-06-11','20:00','A','Mexico','South Africa'),
  f('2026-06-12','03:00','A','South Korea','Czech Republic'),
  f('2026-06-12','20:00','B','Canada','Bosnia-Herz.'),
  f('2026-06-13','02:00','D','USA','Paraguay'),
  f('2026-06-13','20:00','B','Qatar','Switzerland'),
  f('2026-06-13','23:00','C','Brazil','Morocco'),
  f('2026-06-14','02:00','C','Haiti','Scotland'),
  f('2026-06-14','05:00','D','Australia','Turkey'),
  f('2026-06-14','18:00','E','Germany','Curaçao'),
  f('2026-06-14','21:00','F','Netherlands','Japan'),
  f('2026-06-15','00:00','E',"Côte d'Ivoire",'Ecuador'),
  f('2026-06-15','03:00','F','Sweden','Tunisia'),
  f('2026-06-15','17:00','H','Spain','Cape Verde'),
  f('2026-06-15','20:00','G','Belgium','Egypt'),
  f('2026-06-15','23:00','H','Saudi Arabia','Uruguay'),
  f('2026-06-16','02:00','G','Iran','New Zealand'),
  f('2026-06-16','20:00','I','France','Senegal'),
  f('2026-06-16','23:00','I','Iraq','Norway'),
  f('2026-06-17','02:00','J','Argentina','Algeria'),
  f('2026-06-17','05:00','J','Austria','Jordan'),
  f('2026-06-17','18:00','K','Portugal','DR Congo'),
  f('2026-06-17','21:00','L','England','Croatia'),
  f('2026-06-18','00:00','L','Ghana','Panama'),
  f('2026-06-18','03:00','K','Uzbekistan','Colombia'),
  f('2026-06-18','17:00','A','Czech Republic','South Africa'),
  f('2026-06-18','20:00','B','Switzerland','Bosnia-Herz.'),
  f('2026-06-18','23:00','B','Canada','Qatar'),
  f('2026-06-19','02:00','A','Mexico','South Korea'),
  f('2026-06-19','20:00','D','USA','Australia'),
  f('2026-06-19','23:00','C','Scotland','Morocco'),
  f('2026-06-20','01:30','C','Brazil','Haiti'),
  f('2026-06-20','04:00','D','Turkey','Paraguay'),
  f('2026-06-20','18:00','F','Netherlands','Sweden'),
  f('2026-06-20','21:00','E','Germany',"Côte d'Ivoire"),
  f('2026-06-21','01:00','E','Ecuador','Curaçao'),
  f('2026-06-21','05:00','F','Tunisia','Japan'),
  f('2026-06-21','17:00','H','Spain','Saudi Arabia'),
  f('2026-06-21','20:00','G','Belgium','Iran'),
  f('2026-06-21','23:00','H','Uruguay','Cape Verde'),
  f('2026-06-22','02:00','G','New Zealand','Egypt'),
  f('2026-06-22','18:00','J','Argentina','Austria'),
  f('2026-06-22','22:00','I','France','Iraq'),
  f('2026-06-23','01:00','I','Norway','Senegal'),
  f('2026-06-23','04:00','J','Jordan','Algeria'),
  f('2026-06-23','18:00','K','Portugal','Uzbekistan'),
  f('2026-06-23','21:00','L','England','Ghana'),
  f('2026-06-24','00:00','L','Panama','Croatia'),
  f('2026-06-24','03:00','K','Colombia','DR Congo'),
  f('2026-06-24','20:00','B','Switzerland','Canada'),
  f('2026-06-24','20:00','B','Bosnia-Herz.','Qatar'),
  f('2026-06-24','23:00','C','Morocco','Haiti'),
  f('2026-06-24','23:00','C','Scotland','Brazil'),
  f('2026-06-25','02:00','A','South Africa','South Korea'),
  f('2026-06-25','02:00','A','Czech Republic','Mexico'),
  f('2026-06-25','21:00','E','Curaçao',"Côte d'Ivoire"),
  f('2026-06-25','21:00','E','Ecuador','Germany'),
  f('2026-06-26','00:00','F','Tunisia','Netherlands'),
  f('2026-06-26','00:00','F','Japan','Sweden'),
  f('2026-06-26','03:00','D','Turkey','USA'),
  f('2026-06-26','03:00','D','Paraguay','Australia'),
  f('2026-06-26','20:00','I','Norway','France'),
  f('2026-06-26','20:00','I','Senegal','Iraq'),
  f('2026-06-27','01:00','H','Cape Verde','Saudi Arabia'),
  f('2026-06-27','01:00','H','Uruguay','Spain'),
  f('2026-06-27','04:00','G','New Zealand','Belgium'),
  f('2026-06-27','04:00','G','Egypt','Iran'),
  f('2026-06-27','22:00','L','Panama','England'),
  f('2026-06-27','22:00','L','Croatia','Ghana'),
  f('2026-06-28','00:30','K','Colombia','Portugal'),
  f('2026-06-28','00:30','K','DR Congo','Uzbekistan'),
  f('2026-06-28','03:00','J','Algeria','Austria'),
  f('2026-06-28','03:00','J','Jordan','Argentina'),
];

export interface KnockoutRound { round: string; matches: Array<{ date: string; time: string }> }
export const WC2026_KNOCKOUT: KnockoutRound[] = [
  { round: 'Round of 32', matches: [
    {date:'2026-06-28',time:'20:00'},{date:'2026-06-29',time:'18:00'},
    {date:'2026-06-29',time:'21:30'},{date:'2026-06-30',time:'02:00'},
    {date:'2026-06-30',time:'18:00'},{date:'2026-06-30',time:'22:00'},
    {date:'2026-07-01',time:'02:00'},{date:'2026-07-01',time:'17:00'},
    {date:'2026-07-01',time:'21:00'},{date:'2026-07-02',time:'01:00'},
    {date:'2026-07-02',time:'20:00'},{date:'2026-07-03',time:'00:00'},
    {date:'2026-07-03',time:'04:00'},{date:'2026-07-03',time:'19:00'},
    {date:'2026-07-03',time:'23:00'},{date:'2026-07-04',time:'02:30'},
  ]},
  { round: 'Round of 16', matches: [
    {date:'2026-07-04',time:'18:00'},{date:'2026-07-04',time:'22:00'},
    {date:'2026-07-05',time:'21:00'},{date:'2026-07-06',time:'01:00'},
    {date:'2026-07-06',time:'20:00'},{date:'2026-07-07',time:'01:00'},
    {date:'2026-07-07',time:'17:00'},{date:'2026-07-07',time:'21:00'},
  ]},
  { round: 'Quarter-Finals', matches: [
    {date:'2026-07-09',time:'21:00'},{date:'2026-07-10',time:'20:00'},
    {date:'2026-07-11',time:'22:00'},{date:'2026-07-12',time:'02:00'},
  ]},
  { round: 'Semi-Finals', matches: [{date:'2026-07-14',time:'20:00'},{date:'2026-07-15',time:'20:00'}]},
  { round: '3rd Place',   matches: [{date:'2026-07-18',time:'22:00'}]},
  { round: 'Final',       matches: [{date:'2026-07-19',time:'20:00'}]},
];

// ── Updated Team Info — April 2026 ────────────────────────────────────────────
export interface TeamInfo {
  flag: string;
  group: string;
  coach: string;
  fifaRank: number;
  confederation: string;
  keyPlayers: Array<{ name: string; pos: string; club: string }>;
  bestResult?: string;
  wcRecord?: { w: number; d: number; l: number; goals?: number; goalsConceded?: number };
  titles?: number;
}
export const TEAM_INFO: Record<string, TeamInfo> = {
  // ── GROUP A ──
  Mexico: {
    flag:'🇲🇽', group:'A', confederation:'CONCACAF', coach:'Javier Aguirre', fifaRank:15,
    keyPlayers:[
      {name:'Hirving Lozano',  pos:'RW',  club:'PSV Eindhoven'},
      {name:'Edson Álvarez',   pos:'CDM', club:'West Ham United'},
      {name:'Raúl Jiménez',    pos:'ST',  club:'Fulham'},
      {name:'Santiago Giménez',pos:'ST',  club:'AC Milan'},
      {name:'Guillermo Ochoa', pos:'GK',  club:'Salernitana'},
    ],
    bestResult:'Quarter-Finals (1986)',
    wcRecord:{ w:14, d:14, l:16, goals:58, goalsConceded:65 },
  },
  // ── GROUP B ──
  Canada: {
    flag:'🇨🇦', group:'B', confederation:'CONCACAF', coach:'Jesse Marsch', fifaRank:38,
    keyPlayers:[
      {name:'Alphonso Davies',   pos:'LB',  club:'Bayern Munich'},
      {name:'Jonathan David',    pos:'ST',  club:'Internazionale'},
      {name:'Tajon Buchanan',    pos:'RW',  club:'Villarreal'},
      {name:'Stephen Eustáquio', pos:'CM',  club:'FC Porto'},
      {name:'Milan Borjan',      pos:'GK',  club:'Red Star Belgrade'},
    ],
    bestResult:'Group Stage (1986)',
    wcRecord:{ w:0, d:0, l:3, goals:0, goalsConceded:5 },
  },
  // ── GROUP C ──
  Brazil: {
    flag:'🇧🇷', group:'C', confederation:'CONMEBOL', coach:'Dorival Júnior', fifaRank:5,
    keyPlayers:[
      {name:'Vinícius Jr.',  pos:'LW', club:'Real Madrid'},
      {name:'Raphinha',      pos:'RW', club:'FC Barcelona'},
      {name:'Rodrygo',       pos:'RW', club:'Real Madrid'},
      {name:'Endrick',       pos:'ST', club:'Real Madrid'},
      {name:'Alisson',       pos:'GK', club:'Liverpool'},
    ],
    bestResult:'Winner (2002)',
    wcRecord:{ w:76, d:19, l:20, goals:237, goalsConceded:105 },
    titles: 5,
  },
  Morocco: {
    flag:'🇲🇦', group:'C', confederation:'CAF', coach:'Mohamed Ouahbi', fifaRank:8,
    keyPlayers:[
      {name:'Achraf Hakimi',      pos:'RB',  club:'Paris Saint-Germain'},
      {name:'Noussair Mazraoui',  pos:'CB',  club:'Manchester United'},
      {name:'Youssef En-Nesyri',  pos:'ST',  club:'Al-Ittihad'},
      {name:'Yassine Bounou',     pos:'GK',  club:'Al-Hilal'},
      {name:'Bilal El Khannouss', pos:'CAM', club:'Racing Club'},
      {name:'Brahim Díaz',        pos:'AM',  club:'Real Madrid'},
    ],
    bestResult:'Semi-Finals (2022)',
    wcRecord:{ w:9, d:3, l:4, goals:19, goalsConceded:10 },
  },
  // ── GROUP D ──
  USA: {
    flag:'🇺🇸', group:'D', confederation:'CONCACAF', coach:'Mauricio Pochettino', fifaRank:16,
    keyPlayers:[
      {name:'Christian Pulisic', pos:'AM',  club:'AC Milan'},
      {name:'Weston McKennie',   pos:'CM',  club:'Juventus'},
      {name:'Tyler Adams',       pos:'CDM', club:'Bournemouth'},
      {name:'Folarin Balogun',   pos:'ST',  club:'Monaco'},
      {name:'Matt Turner',       pos:'GK',  club:'Nottm Forest'},
    ],
    bestResult:'Semi-Finals (1930)',
    wcRecord:{ w:12, d:7, l:17, goals:50, goalsConceded:67 },
  },
  // ── GROUP E ──
  Germany: {
    flag:'🇩🇪', group:'E', confederation:'UEFA', coach:'Julian Nagelsmann', fifaRank:12,
    keyPlayers:[
      {name:'Florian Wirtz',    pos:'AM',  club:'Bayer Leverkusen'},
      {name:'Jamal Musiala',   pos:'AM',  club:'Bayern Munich'},
      {name:'Kai Havertz',     pos:'ST',  club:'Arsenal'},
      {name:'Leroy Sané',      pos:'LW',  club:'Bayern Munich'},
      {name:'Manuel Neuer',    pos:'GK',  club:'Bayern Munich'},
    ],
    bestResult:'Winner (2014)',
    wcRecord:{ w:67, d:21, l:20, goals:232, goalsConceded:130 },
    titles: 4,
  },
  // ── GROUP F ──
  Netherlands: {
    flag:'🇳🇱', group:'F', confederation:'UEFA', coach:'Ronald Koeman', fifaRank:7,
    keyPlayers:[
      {name:'Virgil van Dijk',   pos:'CB',  club:'Liverpool'},
      {name:'Cody Gakpo',        pos:'LW',  club:'Liverpool'},
      {name:'Xavi Simons',       pos:'AM',  club:'RB Leipzig'},
      {name:'Donyell Malen',     pos:'RW',  club:'Aston Villa'},
      {name:'Bart Verbruggen',   pos:'GK',  club:'Brighton'},
    ],
    bestResult:'Runner-Up (1974, 1978, 2010)',
    wcRecord:{ w:32, d:13, l:14, goals:118, goalsConceded:68 },
  },
  // ── GROUP G ──
  Belgium: {
    flag:'🇧🇪', group:'G', confederation:'UEFA', coach:'Rudi Garcia', fifaRank:10,
    keyPlayers:[
      {name:'Romelu Lukaku',      pos:'ST',  club:'Napoli'},
      {name:'Kevin De Bruyne',    pos:'CM',  club:'Manchester City'},
      {name:'Lois Openda',        pos:'ST',  club:'RB Leipzig'},
      {name:'Arthur Theate',      pos:'CB',  club:'Rennes'},
      {name:'Koen Casteels',      pos:'GK',  club:'VfL Wolfsburg'},
    ],
    bestResult:'3rd Place (1986)',
    wcRecord:{ w:21, d:12, l:18, goals:81, goalsConceded:80 },
  },
  // ── GROUP H ──
  Spain: {
    flag:'🇪🇸', group:'H', confederation:'UEFA', coach:'Luis de la Fuente', fifaRank:3,
    keyPlayers:[
      {name:'Lamine Yamal',   pos:'RW',  club:'FC Barcelona'},
      {name:'Pedri',          pos:'CM',  club:'FC Barcelona'},
      {name:'Nico Williams',  pos:'LW',  club:'Athletic Club'},
      {name:'Álvaro Morata',  pos:'ST',  club:'AC Milan'},
      {name:'Unai Simón',     pos:'GK',  club:'Athletic Club'},
    ],
    bestResult:'Winner (2010)',
    wcRecord:{ w:31, d:13, l:17, goals:108, goalsConceded:76 },
    titles: 1,
  },
  // ── GROUP I ──
  France: {
    flag:'🇫🇷', group:'I', confederation:'UEFA', coach:'Didier Deschamps', fifaRank:2,
    keyPlayers:[
      {name:'Kylian Mbappé',        pos:'ST',  club:'Real Madrid'},
      {name:'Antoine Griezmann',    pos:'AM',  club:'Atlético Madrid'},
      {name:'Aurélien Tchouaméni',  pos:'CM',  club:'Real Madrid'},
      {name:'Ousmane Dembélé',      pos:'RW',  club:'Paris Saint-Germain'},
      {name:'Mike Maignan',         pos:'GK',  club:'AC Milan'},
    ],
    bestResult:'Winner (2018)',
    wcRecord:{ w:34, d:13, l:16, goals:120, goalsConceded:73 },
    titles: 2,
  },
  // ── GROUP J ──
  Argentina: {
    flag:'🇦🇷', group:'J', confederation:'CONMEBOL', coach:'Lionel Scaloni', fifaRank:1,
    keyPlayers:[
      {name:'Lionel Messi',         pos:'AM',  club:'Inter Miami'},
      {name:'Julián Álvarez',       pos:'ST',  club:'Atlético Madrid'},
      {name:'Alexis Mac Allister',  pos:'CM',  club:'Liverpool'},
      {name:'Lautaro Martínez',     pos:'ST',  club:'Internazionale'},
      {name:'Emiliano Martínez',    pos:'GK',  club:'Aston Villa'},
    ],
    bestResult:'Winner (2022)',
    wcRecord:{ w:47, d:15, l:20, goals:155, goalsConceded:93 },
    titles: 3,
  },
  // ── GROUP K ──
  Portugal: {
    flag:'🇵🇹', group:'K', confederation:'UEFA', coach:'Roberto Martínez', fifaRank:6,
    keyPlayers:[
      {name:'Cristiano Ronaldo',  pos:'ST',  club:'Al Nassr'},
      {name:'Bruno Fernandes',    pos:'AM',  club:'Manchester United'},
      {name:'Bernardo Silva',     pos:'AM',  club:'Manchester City'},
      {name:'Rafael Leão',        pos:'LW',  club:'AC Milan'},
      {name:'Diogo Costa',        pos:'GK',  club:'FC Porto'},
    ],
    bestResult:'3rd Place (1966)',
    wcRecord:{ w:17, d:9, l:12, goals:59, goalsConceded:44 },
  },
  // ── GROUP L ──
  England: {
    flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', group:'L', confederation:'UEFA', coach:'Thomas Tuchel', fifaRank:5,
    keyPlayers:[
      {name:'Harry Kane',      pos:'ST',  club:'Bayern Munich'},
      {name:'Jude Bellingham', pos:'CM',  club:'Real Madrid'},
      {name:'Phil Foden',      pos:'AM',  club:'Manchester City'},
      {name:'Bukayo Saka',     pos:'RW',  club:'Arsenal'},
      {name:'Jordan Pickford', pos:'GK',  club:'Everton'},
    ],
    bestResult:'Winner (1966)',
    wcRecord:{ w:32, d:19, l:22, goals:89, goalsConceded:74 },
    titles: 1,
  },
  // ── GROUP A ──
  'South Africa': { flag:'🇿🇦', group:'A', confederation:'CAF', coach:'Hugo Broos', fifaRank:57,
    keyPlayers:[{name:'Percy Tau',pos:'LW',club:'Al Ahly'},{name:'Themba Zwane',pos:'AM',club:'Mamelodi Sundowns'},{name:'Ronwen Williams',pos:'GK',club:'Mamelodi Sundowns'},{name:'Bongani Zungu',pos:'CM',club:'Amiens SC'},{name:'Evidence Makgopa',pos:'ST',club:'Pirates'}],
    bestResult:'Group Stage (2010)', wcRecord:{w:1,d:3,l:2,goals:9,goalsConceded:12} },
  'South Korea': { flag:'🇰🇷', group:'A', confederation:'AFC', coach:'Hong Myung-bo', fifaRank:22,
    keyPlayers:[{name:'Son Heung-min',pos:'LW',club:'Tottenham'},{name:'Lee Kang-in',pos:'AM',club:'PSG'},{name:'Kim Min-jae',pos:'CB',club:'Bayern Munich'},{name:'Hwang Hee-chan',pos:'ST',club:'Wolves'},{name:'Jo Hyeon-woo',pos:'GK',club:'Ulsan HD'}],
    bestResult:'Semi-Finals (2002)', wcRecord:{w:10,d:5,l:19,goals:37,goalsConceded:66} },
  'Czech Republic': { flag:'🇨🇿', group:'A', confederation:'UEFA', coach:'Ivan Hašek', fifaRank:36,
    keyPlayers:[{name:'Tomáš Souček',pos:'CM',club:'West Ham'},{name:'Patrik Schick',pos:'ST',club:'Bayer Leverkusen'},{name:'Vladimír Coufal',pos:'RB',club:'West Ham'},{name:'Lukáš Provod',pos:'CM',club:'Slavia Prague'},{name:'Jindřich Staněk',pos:'GK',club:'Slavia Prague'}],
    bestResult:'Runner-Up (2023 — as Czechoslovakia)', wcRecord:{w:4,d:3,l:5,goals:19,goalsConceded:21} },
  // ── GROUP B ──
  'Bosnia-Herz.': { flag:'🇧🇦', group:'B', confederation:'UEFA', coach:'Sergej Barbarez', fifaRank:61,
    keyPlayers:[{name:'Edin Džeko',pos:'ST',club:'Fenerbahçe'},{name:'Miralem Pjanić',pos:'CM',club:'Sharjah FC'},{name:'Sead Kolašinac',pos:'LB',club:'Atalanta'},{name:'Ermedin Demirović',pos:'ST',club:'Augsburg'},{name:'Ibrahim Šehić',pos:'GK',club:'FK Tuzla City'}],
    bestResult:'Group Stage (2014)', wcRecord:{w:0,d:0,l:3,goals:4,goalsConceded:7} },
  Qatar: { flag:'🇶🇦', group:'B', confederation:'AFC', coach:'Márquez López', fifaRank:37,
    keyPlayers:[{name:'Akram Afif',pos:'LW',club:'Al Sadd'},{name:'Almoez Ali',pos:'ST',club:'Al Duhail'},{name:'Hassan Al-Haydos',pos:'AM',club:'Al Sadd'},{name:'Boualem Khoukhi',pos:'CB',club:'Al Sadd'},{name:'Meshaal Barsham',pos:'GK',club:'Al Sadd'}],
    bestResult:'Group Stage (2022)', wcRecord:{w:0,d:0,l:3,goals:1,goalsConceded:7} },
  Switzerland: { flag:'🇨🇭', group:'B', confederation:'UEFA', coach:'Murat Yakin', fifaRank:18,
    keyPlayers:[{name:'Granit Xhaka',pos:'CM',club:'Bayer Leverkusen'},{name:'Xherdan Shaqiri',pos:'RW',club:'Chicago Fire'},{name:'Manuel Akanji',pos:'CB',club:'Man City'},{name:'Breel Embolo',pos:'ST',club:'Monaco'},{name:'Yann Sommer',pos:'GK',club:'Internazionale'}],
    bestResult:'Quarter-Finals (1954)', wcRecord:{w:14,d:10,l:18,goals:60,goalsConceded:72} },
  // ── GROUP C ──
  Haiti: { flag:'🇭🇹', group:'C', confederation:'CONCACAF', coach:'Marc Collat', fifaRank:83,
    keyPlayers:[{name:'Duckens Nazon',pos:'ST',club:'Metz'},{name:'Frantzdy Pierrot',pos:'ST',club:'Troyes'},{name:'Steeven Saba',pos:'CM',club:'Le Havre'},{name:'Jonathan Rémy',pos:'RB',club:'Sportif Mahajanga'},{name:'Josué Duverger',pos:'GK',club:'Clermont'}],
    bestResult:'Round of 16 (1974)', wcRecord:{w:0,d:0,l:3,goals:2,goalsConceded:14} },
  Scotland: { flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', group:'C', confederation:'UEFA', coach:'Steve Clarke', fifaRank:32,
    keyPlayers:[{name:'Andrew Robertson',pos:'LB',club:'Liverpool'},{name:'Scott McTominay',pos:'CM',club:'Napoli'},{name:'Che Adams',pos:'ST',club:'Torino'},{name:'Ryan Christie',pos:'AM',club:'Bournemouth'},{name:'Angus Gunn',pos:'GK',club:'Norwich'}],
    bestResult:'Group Stage (1974, 1978, 1982, 1990, 1998)', wcRecord:{w:1,d:4,l:8,goals:25,goalsConceded:41} },
  // ── GROUP D ──
  Paraguay: { flag:'🇵🇾', group:'D', confederation:'CONMEBOL', coach:'Gustavo Alfaro', fifaRank:45,
    keyPlayers:[{name:'Miguel Almirón',pos:'AM',club:'Atlanta United'},{name:'Julio Enciso',pos:'AM',club:'Brighton'},{name:'Gustavo Gómez',pos:'CB',club:'Palmeiras'},{name:'Ángel Romero',pos:'ST',club:'Club Olimpia'},{name:'Antony Silva',pos:'GK',club:'Club Olimpia'}],
    bestResult:'Quarter-Finals (1962)', wcRecord:{w:11,d:11,l:15,goals:44,goalsConceded:55} },
  Australia: { flag:'🇦🇺', group:'D', confederation:'AFC', coach:'Tony Popovic', fifaRank:23,
    keyPlayers:[{name:'Mathew Leckie',pos:'RW',club:'Melbourne City'},{name:'Mitchell Duke',pos:'ST',club:'Fagiano Okayama'},{name:'Aaron Mooy',pos:'CM',club:'Celtic'},{name:'Harry Souttar',pos:'CB',club:'Leicester'},{name:'Mat Ryan',pos:'GK',club:'AZ Alkmaar'}],
    bestResult:'Round of 16 (2006)', wcRecord:{w:4,d:4,l:13,goals:24,goalsConceded:55} },
  Turkey: { flag:'🇹🇷', group:'D', confederation:'UEFA', coach:'Vincenzo Montella', fifaRank:28,
    keyPlayers:[{name:'Hakan Çalhanoğlu',pos:'CM',club:'Internazionale'},{name:'Arda Güler',pos:'AM',club:'Real Madrid'},{name:'Merih Demiral',pos:'CB',club:'Al-Qadsiah'},{name:'Kerem Aktürkoğlu',pos:'LW',club:'Galatasaray'},{name:'Mert Günok',pos:'GK',club:'Galatasaray'}],
    bestResult:'3rd Place (2002)', wcRecord:{w:10,d:3,l:7,goals:40,goalsConceded:34} },
  // ── GROUP E ──
  'Curaçao': { flag:'🇨🇼', group:'E', confederation:'CONCACAF', coach:'Wilfried Ulrich', fifaRank:72,
    keyPlayers:[{name:'Cuco Martina',pos:'RB',club:'Retired'},{name:'Leandro Bacuna',pos:'CM',club:'Cardiff City'},{name:'Juriën Gaari',pos:'CB',club:'NEC Nijmegen'},{name:'Rangelo Janga',pos:'ST',club:'KAS Eupen'},{name:'Eloy Room',pos:'GK',club:'Colorado Rapids'}],
    bestResult:'First World Cup', wcRecord:{w:0,d:0,l:0} },
  "Côte d'Ivoire": { flag:'🇨🇮', group:'E', confederation:'CAF', coach:'Emerse Faé', fifaRank:48,
    keyPlayers:[{name:'Sébastien Haller',pos:'ST',club:'Dortmund'},{name:'Franck Kessié',pos:'CM',club:'Al Ahli'},{name:'Nicolas Pépé',pos:'RW',club:'Trabzonspor'},{name:'Wilfried Zaha',pos:'LW',club:'Galatasaray'},{name:'Yahia Fofana',pos:'GK',club:'Chelsea'}],
    bestResult:'Group Stage (2006, 2010, 2014)', wcRecord:{w:1,d:2,l:6,goals:9,goalsConceded:18} },
  Ecuador: { flag:'🇪🇨', group:'E', confederation:'CONMEBOL', coach:'Sebastián Beccacece', fifaRank:40,
    keyPlayers:[{name:'Enner Valencia',pos:'ST',club:'Independiente del Valle'},{name:'Moisés Caicedo',pos:'CDM',club:'Chelsea'},{name:'Gonzalo Plata',pos:'RW',club:'Al-Qadsiah'},{name:'Piero Hincapié',pos:'LB',club:'Bayer Leverkusen'},{name:'Hernán Galíndez',pos:'GK',club:'Aucas'}],
    bestResult:'Round of 16 (2006)', wcRecord:{w:3,d:2,l:5,goals:11,goalsConceded:19} },
  // ── GROUP F ──
  Japan: { flag:'🇯🇵', group:'F', confederation:'AFC', coach:'Hajime Moriyasu', fifaRank:17,
    keyPlayers:[{name:'Takumi Minamino',pos:'AM',club:'Monaco'},{name:'Ritsu Doan',pos:'RW',club:'Freiburg'},{name:'Takehiro Tomiyasu',pos:'RB',club:'Arsenal'},{name:'Wataru Endō',pos:'CDM',club:'Liverpool'},{name:'Shuichi Gonda',pos:'GK',club:'Shimizu S-Pulse'}],
    bestResult:'Round of 16 (2002, 2010, 2018, 2022)', wcRecord:{w:10,d:5,l:11,goals:33,goalsConceded:38} },
  Sweden: { flag:'🇸🇪', group:'F', confederation:'UEFA', coach:'Jon Dahl Tomasson', fifaRank:25,
    keyPlayers:[{name:'Alexander Isak',pos:'ST',club:'Newcastle'},{name:'Dejan Kulusevski',pos:'RW',club:'Tottenham'},{name:'Victor Nilsson Lindelöf',pos:'CB',club:'Man Utd'},{name:'Emil Forsberg',pos:'AM',club:'RB Leipzig'},{name:'Robin Olsen',pos:'GK',club:'Aston Villa'}],
    bestResult:'3rd Place (1950, 1994)', wcRecord:{w:18,d:13,l:18,goals:87,goalsConceded:74} },
  Tunisia: { flag:'🇹🇳', group:'F', confederation:'CAF', coach:'Faouzi Benzarti', fifaRank:30,
    keyPlayers:[{name:'Youssef Msakni',pos:'AM',club:'Espérance'},{name:'Wahbi Khazri',pos:'AM',club:'Montpellier'},{name:'Ellyes Skhiri',pos:'CM',club:'Eintracht Frankfurt'},{name:'Dylan Bronn',pos:'CB',club:'Salernitana'},{name:'Bechir Ben Said',pos:'GK',club:'Espérance'}],
    bestResult:'Group Stage (×6)', wcRecord:{w:1,d:5,l:10,goals:11,goalsConceded:29} },
  // ── GROUP G ──
  Egypt: { flag:'🇪🇬', group:'G', confederation:'CAF', coach:'Hossam Hassan', fifaRank:34,
    keyPlayers:[{name:'Mohamed Salah',pos:'RW',club:'Liverpool'},{name:'Omar Marmoush',pos:'ST',club:'Man City'},{name:'Ahmed Hegazi',pos:'CB',club:'Ittihad Alexandria'},{name:'Mostafa Mohamed',pos:'ST',club:'Nantes'},{name:'Mohamed El-Shenawy',pos:'GK',club:'Al Ahly'}],
    bestResult:'Group Stage (1934, 1990)', wcRecord:{w:0,d:1,l:3,goals:3,goalsConceded:11} },
  Iran: { flag:'🇮🇷', group:'G', confederation:'AFC', coach:'Amir Ghalenoei', fifaRank:20,
    keyPlayers:[{name:'Sardar Azmoun',pos:'ST',club:'Bayer Leverkusen'},{name:'Mehdi Taremi',pos:'ST',club:'Internazionale'},{name:'Alireza Jahanbakhsh',pos:'RW',club:'Feyenoord'},{name:'Morteza Pouraliganji',pos:'CB',club:'Al-Sail'},{name:'Alireza Beiranvand',pos:'GK',club:'Antwerp'}],
    bestResult:'Group Stage (×6)', wcRecord:{w:3,d:2,l:10,goals:14,goalsConceded:31} },
  'New Zealand': { flag:'🇳🇿', group:'G', confederation:'OFC', coach:'Darren Bazeley', fifaRank:90,
    keyPlayers:[{name:'Chris Wood',pos:'ST',club:'Nottm Forest'},{name:'Clayton Lewis',pos:'CM',club:'Vitesse'},{name:'Winston Reid',pos:'CB',club:'Brentford'},{name:'Matthew Garbett',pos:'CM',club:'Nottm Forest'},{name:'Oliver Sail',pos:'GK',club:'SD Huesca'}],
    bestResult:'Group Stage (1982, 2010)', wcRecord:{w:1,d:0,l:5,goals:5,goalsConceded:22} },
  // ── GROUP H ──
  'Cape Verde': { flag:'🇨🇻', group:'H', confederation:'CAF', coach:'Pedro Leitão', fifaRank:66,
    keyPlayers:[{name:'Garry Rodrigues',pos:'RW',club:'Galatasaray'},{name:'Ryan Mendes',pos:'LW',club:'Desportivo de Chaves'},{name:'Stopira',pos:'CB',club:'FK Ural'},{name:'Lisandro',pos:'ST',club:'Omonia'},{name:'Josimar Dias',pos:'GK',club:'Farense'}],
    bestResult:'First World Cup', wcRecord:{w:0,d:0,l:0} },
  'Saudi Arabia': { flag:'🇸🇦', group:'H', confederation:'AFC', coach:'Roberto Mancini', fifaRank:55,
    keyPlayers:[{name:'Salem Al-Dawsari',pos:'LW',club:'Al-Hilal'},{name:'Mohammed Al-Owais',pos:'GK',club:'Al-Hilal'},{name:'Ali Al-Bulayhi',pos:'LB',club:'Al-Hilal'},{name:'Firas Al-Buraikan',pos:'ST',club:'Al-Fateh'},{name:'Sami Al-Najei',pos:'CM',club:'Al-Ahli'}],
    bestResult:'Round of 16 (1994)', wcRecord:{w:4,d:3,l:10,goals:19,goalsConceded:42} },
  Uruguay: { flag:'🇺🇾', group:'H', confederation:'CONMEBOL', coach:'Marcelo Bielsa', fifaRank:14,
    keyPlayers:[{name:'Darwin Núñez',pos:'ST',club:'Liverpool'},{name:'Federico Valverde',pos:'CM',club:'Real Madrid'},{name:'Rodrigo Bentancur',pos:'CM',club:'Tottenham'},{name:'Ronald Araújo',pos:'CB',club:'Juventus'},{name:'Sergio Rochet',pos:'GK',club:'Nacional'}],
    bestResult:'Winner (1930, 1950)', wcRecord:{w:27,d:13,l:19,goals:94,goalsConceded:77}, titles:2 },
  // ── GROUP I ──
  Senegal: { flag:'🇸🇳', group:'I', confederation:'CAF', coach:'Aliou Cissé', fifaRank:19,
    keyPlayers:[{name:'Sadio Mané',pos:'LW',club:'Al-Nassr'},{name:'Kalidou Koulibaly',pos:'CB',club:'Al-Hilal'},{name:'Ismaïla Sarr',pos:'RW',club:'Marseille'},{name:'Idrissa Gana Gueye',pos:'CM',club:'Everton'},{name:'Édouard Mendy',pos:'GK',club:'Al-Ahli'}],
    bestResult:'Quarter-Finals (2002)', wcRecord:{w:4,d:3,l:4,goals:14,goalsConceded:13} },
  Iraq: { flag:'🇮🇶', group:'I', confederation:'AFC', coach:'Jesús Casas', fifaRank:52,
    keyPlayers:[{name:'Aymen Hussein',pos:'ST',club:'Al-Zawraa'},{name:'Ali Adnan',pos:'LB',club:'Shabab Al-Ahli'},{name:'Mohanad Ali',pos:'AM',club:'Al-Zawraa'},{name:'Amjed Attwan',pos:'CM',club:'Al-Quwa Al-Jawiya'},{name:'Jalal Hassan',pos:'GK',club:'Al-Zawraa'}],
    bestResult:'Group Stage (1986)', wcRecord:{w:0,d:0,l:3,goals:1,goalsConceded:11} },
  Norway: { flag:'🇳🇴', group:'I', confederation:'UEFA', coach:'Ståle Solbakken', fifaRank:29,
    keyPlayers:[{name:'Erling Haaland',pos:'ST',club:'Man City'},{name:'Martin Ødegaard',pos:'AM',club:'Arsenal'},{name:'Alexander Sørloth',pos:'ST',club:'Atlético Madrid'},{name:'Sander Berge',pos:'CM',club:'Burnley'},{name:'Ørjan Nyland',pos:'GK',club:'Brentford'}],
    bestResult:'Quarter-Finals (1938)', wcRecord:{w:2,d:2,l:4,goals:9,goalsConceded:16} },
  // ── GROUP J ──
  Algeria: { flag:'🇩🇿', group:'J', confederation:'CAF', coach:'Vladimir Petković', fifaRank:43,
    keyPlayers:[{name:'Riyad Mahrez',pos:'RW',club:'Al-Ahli'},{name:'Islam Slimani',pos:'ST',club:'Monaco'},{name:'Sofiane Feghouli',pos:'AM',club:'Valencia'},{name:'Ramy Bensebaini',pos:'LB',club:'Dortmund'},{name:'Raïs M\'Bolhi',pos:'GK',club:'USMA'}],
    bestResult:'Winner (1990 AFCON)', wcRecord:{w:5,d:3,l:8,goals:20,goalsConceded:28} },
  Austria: { flag:'🇦🇹', group:'J', confederation:'UEFA', coach:'Ralf Rangnick', fifaRank:24,
    keyPlayers:[{name:'David Alaba',pos:'CB',club:'Real Madrid'},{name:'Marcel Sabitzer',pos:'CM',club:'Dortmund'},{name:'Marko Arnautović',pos:'ST',club:'Internazionale'},{name:'Konrad Laimer',pos:'CM',club:'Bayern Munich'},{name:'Patrick Pentz',pos:'GK',club:'Real Betis'}],
    bestResult:'3rd Place (1954)', wcRecord:{w:17,d:8,l:18,goals:86,goalsConceded:88} },
  Jordan: { flag:'🇯🇴', group:'J', confederation:'AFC', coach:'Hussein Ammouta', fifaRank:64,
    keyPlayers:[{name:'Baha\' Faisal',pos:'ST',club:'Al-Ramtha'},{name:'Musa Al-Taamari',pos:'LW',club:'Montpellier'},{name:'Yazan Al-Naimat',pos:'CM',club:'Al-Jazeera'},{name:'Omar Al-Sayed',pos:'RB',club:'Al-Ramtha'},{name:'Yazeed Abdeelal',pos:'GK',club:'Al-Faisaly'}],
    bestResult:'First World Cup', wcRecord:{w:0,d:0,l:0} },
  // ── GROUP K ──
  'DR Congo': { flag:'🇨🇩', group:'K', confederation:'CAF', coach:'Sébastien Desabre', fifaRank:31,
    keyPlayers:[{name:'Yoane Wissa',pos:'ST',club:'Brentford'},{name:'Chancel Mbemba',pos:'CB',club:'Porto'},{name:'Arthur Masuaku',pos:'LB',club:'Besiktas'},{name:'Cédric Bakambu',pos:'ST',club:'Marseille'},{name:'Lionel Mpasi',pos:'GK',club:'TP Mazembe'}],
    bestResult:'Winner (1974 AFCON)', wcRecord:{w:0,d:0,l:3,goals:4,goalsConceded:14} },
  Uzbekistan: { flag:'🇺🇿', group:'K', confederation:'AFC', coach:'Srecko Katanec', fifaRank:69,
    keyPlayers:[{name:'Eldor Shomurodov',pos:'ST',club:'Roma'},{name:'Otabek Shukurov',pos:'CM',club:'Pakhtakor'},{name:'Dostonbek Khamdamov',pos:'RW',club:'Pakhtakor'},{name:'Sanjar Tursunov',pos:'CB',club:'Pakhtakor'},{name:'Eldorbek Sobirov',pos:'GK',club:'Pakhtakor'}],
    bestResult:'First World Cup', wcRecord:{w:0,d:0,l:0} },
  Colombia: { flag:'🇨🇴', group:'K', confederation:'CONMEBOL', coach:'Néstor Lorenzo', fifaRank:9,
    keyPlayers:[{name:'James Rodríguez',pos:'AM',club:'Rayo Vallecano'},{name:'Luis Díaz',pos:'LW',club:'Liverpool'},{name:'Falcao',pos:'ST',club:'Rionegro Águilas'},{name:'Davinson Sánchez',pos:'CB',club:'Galatasaray'},{name:'Camilo Vargas',pos:'GK',club:'Atlas'}],
    bestResult:'Quarter-Finals (2014)', wcRecord:{w:8,d:4,l:8,goals:29,goalsConceded:27} },
  // ── GROUP L ──
  Croatia: { flag:'🇭🇷', group:'L', confederation:'UEFA', coach:'Zlatko Dalić', fifaRank:11,
    keyPlayers:[{name:'Luka Modrić',pos:'CM',club:'Real Madrid'},{name:'Ivan Perišić',pos:'LW',club:'Hajduk Split'},{name:'Mateo Kovačić',pos:'CM',club:'Man City'},{name:'Joško Gvardiol',pos:'LB',club:'Man City'},{name:'Dominik Livaković',pos:'GK',club:'Fenerbahçe'}],
    bestResult:'Runner-Up (2018)', wcRecord:{w:15,d:7,l:7,goals:50,goalsConceded:32} },
  Ghana: { flag:'🇬🇭', group:'L', confederation:'CAF', coach:'Otto Addo', fifaRank:53,
    keyPlayers:[{name:'Jordan Ayew',pos:'ST',club:'Leicester'},{name:'Thomas Partey',pos:'CDM',club:'Arsenal'},{name:'Mohammed Kudus',pos:'AM',club:'West Ham'},{name:'Andy Yiadom',pos:'RB',club:'Reading'},{name:'Lawrence Ati-Zigi',pos:'GK',club:'FC Sion'}],
    bestResult:'Quarter-Finals (2010)', wcRecord:{w:4,d:4,l:5,goals:13,goalsConceded:18} },
  Panama: { flag:'🇵🇦', group:'L', confederation:'CONCACAF', coach:'Thomas Christiansen', fifaRank:74,
    keyPlayers:[{name:'Ismael Díaz',pos:'ST',club:'Olympiacos'},{name:'Andrés Andrade',pos:'CM',club:'Toluca'},{name:'Roderick Miller',pos:'CB',club:'Club Deportivo Árabe Unido'},{name:'Cecilio Waterman',pos:'ST',club:'Club Deportivo Plaza Amador'},{name:'Luis Mejía',pos:'GK',club:'Independiente'}],
    bestResult:'Group Stage (2018)', wcRecord:{w:0,d:0,l:3,goals:2,goalsConceded:11} },
};


export const MOROCCO_INFO = {
  flag:'🇲🇦', name:'Morocco', group:'C',
  coach:'Mohamed Ouahbi',  // Appointed March 5, 2026 — replacing Regragui
  confederation:'CAF', fifaRanking:8,
  bestResult:'Semi-Finals (2022)',
  wcRecord:{ w:9, d:3, l:4, goals:19, goalsConceded:10 },
  keyPlayers: TEAM_INFO['Morocco'].keyPlayers.map(p => ({...p, flag:'🇲🇦'})),
};

export const STADIUMS = [
  { name:'MetLife Stadium',        city:'New York/NJ',   country:'USA',    capacity:82500, flag:'🇺🇸', isFinal:true },
  { name:"AT&T Stadium",           city:'Dallas',         country:'USA',    capacity:80000, flag:'🇺🇸' },
  { name:'SoFi Stadium',           city:'Los Angeles',    country:'USA',    capacity:70240, flag:'🇺🇸' },
  { name:"Levi's Stadium",         city:'San Francisco',  country:'USA',    capacity:68500, flag:'🇺🇸' },
  { name:'Arrowhead Stadium',      city:'Kansas City',    country:'USA',    capacity:76416, flag:'🇺🇸' },
  { name:'Mercedes-Benz Stadium',  city:'Atlanta',        country:'USA',    capacity:71000, flag:'🇺🇸' },
  { name:'Lincoln Financial Field',city:'Philadelphia',   country:'USA',    capacity:69796, flag:'🇺🇸' },
  { name:'NRG Stadium',            city:'Houston',        country:'USA',    capacity:72220, flag:'🇺🇸' },
  { name:'Lumen Field',            city:'Seattle',        country:'USA',    capacity:69000, flag:'🇺🇸' },
  { name:'Hard Rock Stadium',      city:'Miami',          country:'USA',    capacity:64767, flag:'🇺🇸' },
  { name:'Gillette Stadium',       city:'Boston',         country:'USA',    capacity:65878, flag:'🇺🇸' },
  { name:'Estadio Azteca',         city:'Mexico City',    country:'Mexico', capacity:87523, flag:'🇲🇽', isOpener:true },
  { name:'Estadio Akron',          city:'Guadalajara',    country:'Mexico', capacity:49850, flag:'🇲🇽' },
  { name:'Estadio BBVA',           city:'Monterrey',      country:'Mexico', capacity:53464, flag:'🇲🇽' },
  { name:'BMO Field',              city:'Toronto',        country:'Canada', capacity:30990, flag:'🇨🇦' },
  { name:'BC Place',               city:'Vancouver',      country:'Canada', capacity:54500, flag:'🇨🇦' },
];
