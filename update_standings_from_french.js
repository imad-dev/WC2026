import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = {};
const envStr = fs.readFileSync('.env.local', 'utf-8');
for (const line of envStr.split('\n')) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    env[k.trim()] = v.trim();
  }
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const teamMap = {
  "Mexique": "Mexico",
  "Corée du Sud": "South Korea",
  "Tchéquie": "Czech Republic",
  "Afrique du Sud": "South Africa",
  "Canada": "Canada",
  "Suisse": "Switzerland",
  "Bosnie-Herzégovine": "Bosnia and Herzegovina",
  "Qatar": "Qatar",
  "Brésil": "Brazil",
  "Maroc": "Morocco",
  "Écosse": "Scotland",
  "Haïti": "Haiti",
  "États-Unis": "United States",
  "Australie": "Australia",
  "Paraguay": "Paraguay",
  "Turquie": "Turkey",
  "Allemagne": "Germany",
  "Côte d'Ivoire": "Ivory Coast",
  "Équateur": "Ecuador",
  "Curaçao": "Curaçao",
  "Suède": "Sweden",
  "Japon": "Japan",
  "Pays-Bas": "Netherlands",
  "Tunisie": "Tunisia",
  "Nouvelle-Zélande": "New Zealand",
  "Iran": "Iran",
  "Belgique": "Belgium",
  "Égypte": "Egypt",
  "Uruguay": "Uruguay",
  "Arabie saoudite": "Saudi Arabia",
  "Espagne": "Spain",
  "Cap-Vert": "Cape Verde",
  "Norvège": "Norway",
  "France": "France",
  "Sénégal": "Senegal",
  "Irak": "Iraq",
  "Argentine": "Argentina",
  "Autriche": "Austria",
  "Jordanie": "Jordan",
  "Algérie": "Algeria",
  "Colombie": "Colombia",
  "RD Congo": "Democratic Republic of the Congo",
  "Portugal": "Portugal",
  "Ouzbékistan": "Uzbekistan",
  "Angleterre": "England",
  "Ghana": "Ghana",
  "Panama": "Panama",
  "Croatie": "Croatia"
};

const standingsData = `
Mexique 2 2 0 0 3 0 3 6
Corée du Sud 2 1 0 1 2 2 0 3
Tchéquie 2 0 1 1 2 3 -1 1
Afrique du Sud 2 0 1 1 1 3 -2 1
Canada 2 1 1 0 7 1 6 4
Suisse 2 1 1 0 5 2 3 4
Bosnie-Herzégovine 2 0 1 1 2 5 -3 1
Qatar 2 0 1 1 1 7 -6 1
Brésil 2 1 1 0 4 1 3 4
Maroc 2 1 1 0 2 1 1 4
Écosse 2 1 0 1 1 1 0 3
Haïti 2 0 0 2 0 4 -4 0
États-Unis 2 2 0 0 6 1 5 6
Australie 2 1 0 1 2 2 0 3
Paraguay 2 1 0 1 2 4 -2 3
Turquie 2 0 0 2 0 3 -3 0
Allemagne 1 1 0 0 7 1 6 3
Côte d'Ivoire 1 1 0 0 1 0 1 3
Équateur 1 0 0 1 0 1 -1 0
Curaçao 1 0 0 1 1 7 -6 0
Suède 1 1 0 0 5 1 4 3
Japon 1 0 1 0 2 2 0 1
Pays-Bas 1 0 1 0 2 2 0 1
Tunisie 1 0 0 1 1 5 -4 0
Nouvelle-Zélande 1 0 1 0 2 2 0 1
Iran 1 0 1 0 2 2 0 1
Belgique 1 0 1 0 1 1 0 1
Égypte 1 0 1 0 1 1 0 1
Uruguay 1 0 1 0 1 1 0 1
Arabie saoudite 1 0 1 0 1 1 0 1
Espagne 1 0 1 0 0 0 0 1
Cap-Vert 1 0 1 0 0 0 0 1
Norvège 1 1 0 0 4 1 3 3
France 1 1 0 0 3 1 2 3
Sénégal 1 0 0 1 1 3 -2 0
Irak 1 0 0 1 1 4 -3 0
Argentine 1 1 0 0 3 0 3 3
Autriche 1 1 0 0 3 1 2 3
Jordanie 1 0 0 1 1 3 -2 0
Algérie 1 0 0 1 0 3 -3 0
Colombie 1 1 0 0 3 1 2 3
RD Congo 1 0 1 0 1 1 0 1
Portugal 1 0 1 0 1 1 0 1
Ouzbékistan 1 0 0 1 1 3 -2 0
Angleterre 1 1 0 0 4 2 2 3
Ghana 1 1 0 0 1 0 1 3
Panama 1 0 0 1 0 1 -1 0
Croatie 1 0 0 1 2 4 -2 0
`;

async function updateStandings() {
  const lines = standingsData.trim().split('\n');
  
  for (const line of lines) {
    if (!line) continue;
    
    // Parse line from right to left because team name can have spaces
    const parts = line.split(' ');
    const pts = parseInt(parts.pop());
    const gd = parseInt(parts.pop());
    const ga = parseInt(parts.pop());
    const gf = parseInt(parts.pop());
    const l = parseInt(parts.pop());
    const d = parseInt(parts.pop());
    const w = parseInt(parts.pop());
    const p = parseInt(parts.pop());
    
    const frenchName = parts.join(' ');
    const engName = teamMap[frenchName];
    
    if (!engName) {
      console.log('Missing mapping for:', frenchName);
      continue;
    }
    
    console.log(`Updating ${engName}: ${p} ${w} ${d} ${l} ${gf} ${ga} ${pts}`);
    
    const { error } = await supabase.from('wc_standings').update({
      played: p,
      won: w,
      drawn: d,
      lost: l,
      goals_for: gf,
      goals_against: ga,
      points: pts
    }).eq('team', engName);
    
    if (error) {
      console.error('Error updating', engName, error);
    }
  }
  
  console.log('Standings updated successfully.');
}

updateStandings();
