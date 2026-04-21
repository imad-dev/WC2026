// Official FIFA World Cup 2026 Static Data — Correct Official Draw

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

// ── Official Group Draw ───────────────────────────────────────────────────────
export const WC2026_GROUPS: Record<string, Array<{ name: string; flag: string; confederation: string }>> = {
  A: [
    { name: 'Mexico',       flag: '🇲🇽', confederation: 'CONCACAF' },
    { name: 'South Africa', flag: '🇿🇦', confederation: 'CAF' },
    { name: 'South Korea',  flag: '🇰🇷', confederation: 'AFC' },
    { name: 'Czech Republic',flag: '🇨🇿', confederation: 'UEFA' },
  ],
  B: [
    { name: 'Canada',          flag: '🇨🇦', confederation: 'CONCACAF' },
    { name: 'Bosnia-Herz.',    flag: '🇧🇦', confederation: 'UEFA' },
    { name: 'Qatar',           flag: '🇶🇦', confederation: 'AFC' },
    { name: 'Switzerland',     flag: '🇨🇭', confederation: 'UEFA' },
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
    { name: 'Germany',      flag: '🇩🇪', confederation: 'UEFA' },
    { name: 'Curaçao',      flag: '🇨🇼', confederation: 'CONCACAF' },
    { name: "Côte d'Ivoire",flag: '🇨🇮', confederation: 'CAF' },
    { name: 'Ecuador',      flag: '🇪🇨', confederation: 'CONMEBOL' },
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
    { name: 'France',   flag: '🇫🇷', confederation: 'UEFA' },
    { name: 'Senegal',  flag: '🇸🇳', confederation: 'CAF' },
    { name: 'Iraq',     flag: '🇮🇶', confederation: 'AFC' },
    { name: 'Norway',   flag: '🇳🇴', confederation: 'UEFA' },
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

// ── All Group Stage Fixtures ──────────────────────────────────────────────────
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
  'TBD':'⚽',
};
export const getWCFlag = (name: string) => FLAG[name] || '⚽';

const f = (date: string, time: string, group: string, home: string, away: string): WCFixture => ({
  date, time, group, stage: 'Group Stage',
  home, homeFlag: FLAG[home] || '⚽',
  away, awayFlag: FLAG[away] || '⚽',
});

export const WC2026_FIXTURES: WCFixture[] = [
  // Jun 11
  f('2026-06-11','20:00','A','Mexico','South Africa'),
  // Jun 12
  f('2026-06-12','03:00','A','South Korea','Czech Republic'),
  f('2026-06-12','20:00','B','Canada','Bosnia-Herz.'),
  // Jun 13
  f('2026-06-13','02:00','D','USA','Paraguay'),
  f('2026-06-13','20:00','B','Qatar','Switzerland'),
  f('2026-06-13','23:00','C','Brazil','Morocco'),
  // Jun 14
  f('2026-06-14','02:00','C','Haiti','Scotland'),
  f('2026-06-14','05:00','D','Australia','Turkey'),
  f('2026-06-14','18:00','E','Germany','Curaçao'),
  f('2026-06-14','21:00','F','Netherlands','Japan'),
  // Jun 15
  f('2026-06-15','00:00','E',"Côte d'Ivoire",'Ecuador'),
  f('2026-06-15','03:00','F','Sweden','Tunisia'),
  f('2026-06-15','17:00','H','Spain','Cape Verde'),
  f('2026-06-15','20:00','G','Belgium','Egypt'),
  f('2026-06-15','23:00','H','Saudi Arabia','Uruguay'),
  // Jun 16
  f('2026-06-16','02:00','G','Iran','New Zealand'),
  f('2026-06-16','20:00','I','France','Senegal'),
  f('2026-06-16','23:00','I','Iraq','Norway'),
  // Jun 17
  f('2026-06-17','02:00','J','Argentina','Algeria'),
  f('2026-06-17','05:00','J','Austria','Jordan'),
  f('2026-06-17','18:00','K','Portugal','DR Congo'),
  f('2026-06-17','21:00','L','England','Croatia'),
  // Jun 18
  f('2026-06-18','00:00','L','Ghana','Panama'),
  f('2026-06-18','03:00','K','Uzbekistan','Colombia'),
  f('2026-06-18','17:00','A','Czech Republic','South Africa'),
  f('2026-06-18','20:00','B','Switzerland','Bosnia-Herz.'),
  f('2026-06-18','23:00','B','Canada','Qatar'),
  // Jun 19
  f('2026-06-19','02:00','A','Mexico','South Korea'),
  f('2026-06-19','20:00','D','USA','Australia'),
  f('2026-06-19','23:00','C','Scotland','Morocco'),
  // Jun 20
  f('2026-06-20','01:30','C','Brazil','Haiti'),
  f('2026-06-20','04:00','D','Turkey','Paraguay'),
  f('2026-06-20','18:00','F','Netherlands','Sweden'),
  f('2026-06-20','21:00','E','Germany',"Côte d'Ivoire"),
  // Jun 21
  f('2026-06-21','01:00','E','Ecuador','Curaçao'),
  f('2026-06-21','05:00','F','Tunisia','Japan'),
  f('2026-06-21','17:00','H','Spain','Saudi Arabia'),
  f('2026-06-21','20:00','G','Belgium','Iran'),
  f('2026-06-21','23:00','H','Uruguay','Cape Verde'),
  // Jun 22
  f('2026-06-22','02:00','G','New Zealand','Egypt'),
  f('2026-06-22','18:00','J','Argentina','Austria'),
  f('2026-06-22','22:00','I','France','Iraq'),
  // Jun 23
  f('2026-06-23','01:00','I','Norway','Senegal'),
  f('2026-06-23','04:00','J','Jordan','Algeria'),
  f('2026-06-23','18:00','K','Portugal','Uzbekistan'),
  f('2026-06-23','21:00','L','England','Ghana'),
  // Jun 24
  f('2026-06-24','00:00','L','Panama','Croatia'),
  f('2026-06-24','03:00','K','Colombia','DR Congo'),
  f('2026-06-24','20:00','B','Switzerland','Canada'),
  f('2026-06-24','20:00','B','Bosnia-Herz.','Qatar'),
  f('2026-06-24','23:00','C','Morocco','Haiti'),
  f('2026-06-24','23:00','C','Scotland','Brazil'),
  // Jun 25
  f('2026-06-25','02:00','A','South Africa','South Korea'),
  f('2026-06-25','02:00','A','Czech Republic','Mexico'),
  f('2026-06-25','21:00','E','Curaçao',"Côte d'Ivoire"),
  f('2026-06-25','21:00','E','Ecuador','Germany'),
  // Jun 26
  f('2026-06-26','00:00','F','Tunisia','Netherlands'),
  f('2026-06-26','00:00','F','Japan','Sweden'),
  f('2026-06-26','03:00','D','Turkey','USA'),
  f('2026-06-26','03:00','D','Paraguay','Australia'),
  f('2026-06-26','20:00','I','Norway','France'),
  f('2026-06-26','20:00','I','Senegal','Iraq'),
  // Jun 27
  f('2026-06-27','01:00','H','Cape Verde','Saudi Arabia'),
  f('2026-06-27','01:00','H','Uruguay','Spain'),
  f('2026-06-27','04:00','G','New Zealand','Belgium'),
  f('2026-06-27','04:00','G','Egypt','Iran'),
  f('2026-06-27','22:00','L','Panama','England'),
  f('2026-06-27','22:00','L','Croatia','Ghana'),
  // Jun 28
  f('2026-06-28','00:30','K','Colombia','Portugal'),
  f('2026-06-28','00:30','K','DR Congo','Uzbekistan'),
  f('2026-06-28','03:00','J','Algeria','Austria'),
  f('2026-06-28','03:00','J','Jordan','Argentina'),
];

// ── Knockout rounds ───────────────────────────────────────────────────────────
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
  { round: 'Semi-Finals', matches: [
    {date:'2026-07-14',time:'20:00'},{date:'2026-07-15',time:'20:00'},
  ]},
  { round: '3rd Place', matches: [{date:'2026-07-18',time:'22:00'}]},
  { round: 'Final', matches: [{date:'2026-07-19',time:'20:00'}]},
];

// ── Key teams info ────────────────────────────────────────────────────────────
export const TEAM_INFO: Record<string, {
  flag: string; group: string; coach: string; fifaRank: number;
  keyPlayers: Array<{ name: string; pos: string; club: string }>;
}> = {
  France: {
    flag:'🇫🇷', group:'I', coach:'Didier Deschamps', fifaRank:2,
    keyPlayers:[
      {name:'Kylian Mbappé',pos:'ST',club:'Real Madrid'},
      {name:'Antoine Griezmann',pos:'AM',club:'Atlético Madrid'},
      {name:'Aurélien Tchouaméni',pos:'CM',club:'Real Madrid'},
      {name:'Mike Maignan',pos:'GK',club:'AC Milan'},
    ],
  },
  Brazil: {
    flag:'🇧🇷', group:'C', coach:'Dorival Júnior', fifaRank:5,
    keyPlayers:[
      {name:'Vinícius Jr.',pos:'LW',club:'Real Madrid'},
      {name:'Rodrygo',pos:'RW',club:'Real Madrid'},
      {name:'Raphinha',pos:'RW',club:'FC Barcelona'},
      {name:'Alisson',pos:'GK',club:'Liverpool'},
    ],
  },
  Argentina: {
    flag:'🇦🇷', group:'J', coach:'Lionel Scaloni', fifaRank:1,
    keyPlayers:[
      {name:'Lionel Messi',pos:'AM',club:'Inter Miami'},
      {name:'Lautaro Martínez',pos:'ST',club:'Internazionale'},
      {name:'Julián Álvarez',pos:'ST',club:'Atlético Madrid'},
      {name:'Emiliano Martínez',pos:'GK',club:'Aston Villa'},
    ],
  },
  England: {
    flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', group:'L', coach:'Thomas Tuchel', fifaRank:5,
    keyPlayers:[
      {name:'Harry Kane',pos:'ST',club:'Bayern Munich'},
      {name:'Jude Bellingham',pos:'CM',club:'Real Madrid'},
      {name:'Phil Foden',pos:'AM',club:'Manchester City'},
      {name:'Jordan Pickford',pos:'GK',club:'Everton'},
    ],
  },
  Spain: {
    flag:'🇪🇸', group:'H', coach:'Luis de la Fuente', fifaRank:3,
    keyPlayers:[
      {name:'Lamine Yamal',pos:'RW',club:'FC Barcelona'},
      {name:'Pedri',pos:'CM',club:'FC Barcelona'},
      {name:'Álvaro Morata',pos:'ST',club:'AC Milan'},
      {name:'Unai Simón',pos:'GK',club:'Athletic Club'},
    ],
  },
  Germany: {
    flag:'🇩🇪', group:'E', coach:'Julian Nagelsmann', fifaRank:12,
    keyPlayers:[
      {name:'Florian Wirtz',pos:'AM',club:'Bayer Leverkusen'},
      {name:'Jamal Musiala',pos:'AM',club:'Bayern Munich'},
      {name:'Kai Havertz',pos:'ST',club:'Arsenal'},
      {name:'Manuel Neuer',pos:'GK',club:'Bayern Munich'},
    ],
  },
  Portugal: {
    flag:'🇵🇹', group:'K', coach:'Roberto Martínez', fifaRank:6,
    keyPlayers:[
      {name:'Cristiano Ronaldo',pos:'ST',club:'Al Nassr'},
      {name:'Bruno Fernandes',pos:'AM',club:'Manchester United'},
      {name:'Bernardo Silva',pos:'AM',club:'Manchester City'},
      {name:'Rui Patrício',pos:'GK',club:'AS Roma'},
    ],
  },
  Morocco: {
    flag:'🇲🇦', group:'C', coach:'Walid Regragui', fifaRank:14,
    keyPlayers:[
      {name:'Achraf Hakimi',pos:'RB',club:'Paris Saint-Germain'},
      {name:'Hakim Ziyech',pos:'AM',club:'Galatasaray'},
      {name:'Youssef En-Nesyri',pos:'ST',club:'Fenerbahçe'},
      {name:'Bono',pos:'GK',club:'Al-Qadsiah'},
    ],
  },
  Netherlands: {
    flag:'🇳🇱', group:'F', coach:'Ronald Koeman', fifaRank:7,
    keyPlayers:[
      {name:'Virgil van Dijk',pos:'CB',club:'Liverpool'},
      {name:'Cody Gakpo',pos:'LW',club:'Liverpool'},
      {name:'Xavi Simons',pos:'AM',club:'RB Leipzig'},
      {name:'Bart Verbruggen',pos:'GK',club:'Brighton'},
    ],
  },
  USA: {
    flag:'🇺🇸', group:'D', coach:'Mauricio Pochettino', fifaRank:16,
    keyPlayers:[
      {name:'Christian Pulisic',pos:'AM',club:'AC Milan'},
      {name:'Weston McKennie',pos:'CM',club:'Juventus'},
      {name:'Folarin Balogun',pos:'ST',club:'Monaco'},
      {name:'Matt Turner',pos:'GK',club:'Nottm Forest'},
    ],
  },
};

export const MOROCCO_INFO = {
  flag:'🇲🇦', name:'Morocco', group:'C', coach:'Walid Regragui',
  confederation:'CAF', fifaRanking:14, bestResult:'Semi-Finals (2022)',
  wcRecord:{ w:9, d:3, l:4, goals:19, goalsConceded:10 },
  keyPlayers: TEAM_INFO['Morocco'].keyPlayers.map(p => ({...p, flag:'🇲🇦'})),
};

export const STADIUMS = [
  { name:'MetLife Stadium',        city:'New York/NJ',      country:'USA',    capacity:82500, flag:'🇺🇸' },
  { name:"AT&T Stadium",           city:'Dallas',           country:'USA',    capacity:80000, flag:'🇺🇸' },
  { name:'SoFi Stadium',           city:'Los Angeles',      country:'USA',    capacity:70240, flag:'🇺🇸' },
  { name:"Levi's Stadium",         city:'San Francisco',    country:'USA',    capacity:68500, flag:'🇺🇸' },
  { name:'Arrowhead Stadium',      city:'Kansas City',      country:'USA',    capacity:76416, flag:'🇺🇸' },
  { name:'Mercedes-Benz Stadium',  city:'Atlanta',          country:'USA',    capacity:71000, flag:'🇺🇸' },
  { name:'Lincoln Financial Field',city:'Philadelphia',     country:'USA',    capacity:69796, flag:'🇺🇸' },
  { name:'NRG Stadium',            city:'Houston',          country:'USA',    capacity:72220, flag:'🇺🇸' },
  { name:'Lumen Field',            city:'Seattle',          country:'USA',    capacity:69000, flag:'🇺🇸' },
  { name:'Hard Rock Stadium',      city:'Miami',            country:'USA',    capacity:64767, flag:'🇺🇸' },
  { name:'Gillette Stadium',       city:'Boston',           country:'USA',    capacity:65878, flag:'🇺🇸' },
  { name:'Estadio Azteca',         city:'Mexico City',      country:'Mexico', capacity:87523, flag:'🇲🇽', isOpener:true },
  { name:'Estadio Akron',          city:'Guadalajara',      country:'Mexico', capacity:49850, flag:'🇲🇽' },
  { name:'Estadio BBVA',           city:'Monterrey',        country:'Mexico', capacity:53464, flag:'🇲🇽' },
  { name:'BMO Field',              city:'Toronto',          country:'Canada', capacity:30990, flag:'🇨🇦' },
  { name:'BC Place',               city:'Vancouver',        country:'Canada', capacity:54500, flag:'🇨🇦' },
];
