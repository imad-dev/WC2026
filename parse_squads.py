#!/usr/bin/env python3
"""
FIFA WC2026 Squad Parser - reads squad_raw.txt → squads.json
Structure per player: #\n\nPOS\n\nNAME\n\n[more fields]\n\nClub\n\nHeight\n\nCaps\n\nGoals
"""
import re, json

with open('squad_raw.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into pages (form feed char) then work on clean tokens
# Strip whitespace-only lines and work with non-empty tokens
tokens = [t.strip() for t in content.split('\n') if t.strip()]

NATIONAL_TEAMS = {
    'Algeria': 'ALG', 'Argentina': 'ARG', 'Australia': 'AUS', 'Austria': 'AUT',
    'Belgium': 'BEL', 'Bosnia and Herzegovina': 'BIH', 'Bosnia & Herzegovina': 'BIH',
    'Brazil': 'BRA', 'Canada': 'CAN', 'Cape Verde': 'CPV', 'Colombia': 'COL',
    'Croatia': 'CRO', 'Curaçao': 'CUW', 'Czech Republic': 'CZE',
    'Democratic Republic of the Congo': 'COD', 'DR Congo': 'COD',
    'Ecuador': 'ECU', 'Egypt': 'EGY', 'England': 'ENG', 'France': 'FRA',
    'Germany': 'GER', 'Ghana': 'GHA', 'Haiti': 'HAI', 'Iran': 'IRN',
    'Iraq': 'IRQ', 'Jordan': 'JOR', 'Japan': 'JPN', 'Korea Republic': 'KOR',
    'Saudi Arabia': 'KSA', 'Morocco': 'MAR', 'Mexico': 'MEX',
    'Netherlands': 'NED', 'Norway': 'NOR', 'New Zealand': 'NZL',
    'Panama': 'PAN', 'Paraguay': 'PAR', 'Portugal': 'POR', 'Qatar': 'QAT',
    'South Africa': 'RSA', 'Scotland': 'SCO', 'Senegal': 'SEN', 'Spain': 'ESP',
    'Switzerland': 'SUI', 'Sweden': 'SWE', 'Tunisia': 'TUN', 'Türkiye': 'TUR',
    'Uruguay': 'URU', 'USA': 'USA', 'Uzbekistan': 'UZB',
    "Côte d'Ivoire": 'CIV', 'Ivory Coast': 'CIV', 'South Korea': 'KOR',
}

# Fixed-text markers to skip
SKIP_TOKENS = {
    '#', 'POS', 'CAPS', 'GOALS', 'PLAYER NAME', 'FIRST NAME(S)', 'LAST NAME(S)',
    'NAME ON SHIRT', 'DOB', 'CLUB', 'HEIGHT (CM)',
    'SQUAD LIST', 'FIFA World Cup 2026™', '11 June 2026 – 19 July 2026',
}

team_header_re = re.compile(r'^(.+?) \(([A-Z]{3})\)$')
num_re = re.compile(r'^\d{1,2}$')
pos_re = re.compile(r'^(GK|DF|MF|FW)$')
date_re = re.compile(r'^\d{2}/\d{2}/\d{4}$')
height_re = re.compile(r'^1[5-9]\d$')  # 150-199 cm
int_re = re.compile(r'^\d+$')
club_re = re.compile(r'\([A-Z]{2,3}\)$')  # ends with (XXX)

# Find team section boundaries in token list
team_positions = []
for i, tok in enumerate(tokens):
    m = team_header_re.match(tok)
    if m:
        name = m.group(1).strip()
        code = m.group(2)
        if name in NATIONAL_TEAMS:
            team_positions.append((i, name, code))

print(f"Found {len(team_positions)} national teams")

all_squads = {}

for t_idx, (start, team_name, team_code) in enumerate(team_positions):
    end = team_positions[t_idx+1][0] if t_idx+1 < len(team_positions) else len(tokens)
    section = tokens[start:end]
    
    players = []
    i = 1  # skip team header
    
    while i < len(section):
        tok = section[i]
        
        # Skip known header tokens
        if tok in SKIP_TOKENS:
            i += 1
            continue
        
        # A player block starts with jersey number
        if num_re.match(tok):
            number = int(tok)
            j = i + 1
            position = None
            display_name = None
            first_name = None
            last_name = None
            name_on_shirt = None
            dob = None
            club = None
            height = None
            caps = None
            goals = None
            
            state = 'pos'  # what we expect next
            pending_nums = []  # collect number-like tokens for caps/goals
            
            while j < min(i + 40, len(section)):
                t = section[j]
                
                if t in SKIP_TOKENS:
                    j += 1
                    continue
                
                if state == 'pos':
                    if pos_re.match(t):
                        position = t
                        state = 'display_name'
                elif state == 'display_name':
                    if pos_re.match(t):
                        j += 1; continue  # skip duplicate
                    if display_name is None and len(t) > 1:
                        display_name = t
                        state = 'first_name'
                elif state == 'first_name':
                    if first_name is None and len(t) > 1 and not t.isupper():
                        first_name = t
                        state = 'last_name'
                    elif t.isupper() and len(t) > 1:
                        last_name = t
                        state = 'name_on_shirt'
                elif state == 'last_name':
                    if last_name is None and t.isupper():
                        last_name = t
                        state = 'name_on_shirt'
                elif state == 'name_on_shirt':
                    if name_on_shirt is None and t.isupper():
                        name_on_shirt = t
                        state = 'dob'
                elif state == 'dob':
                    if date_re.match(t):
                        dob = t
                        state = 'club'
                elif state == 'club':
                    if club_re.search(t):
                        club = t
                        state = 'height'
                elif state == 'height':
                    if height_re.match(t):
                        height = int(t)
                        state = 'caps'
                elif state == 'caps':
                    if int_re.match(t):
                        caps = int(t)
                        state = 'goals'
                elif state == 'goals':
                    if int_re.match(t):
                        goals = int(t)
                        break
                j += 1
            
            if position and display_name:
                # Parse DOB to age
                age = None
                if dob:
                    try:
                        from datetime import date
                        d = date(int(dob[6:]), int(dob[3:5]), int(dob[:2]))
                        today = date(2026, 6, 18)
                        age = today.year - d.year - ((today.month, today.day) < (d.month, d.day))
                    except:
                        pass
                
                # Build full name from display_name (e.g. "MESSI Lionel" → "Lionel Messi")
                parts = display_name.split(' ', 1)
                if len(parts) == 2:
                    full_name = f"{parts[1]} {parts[0].title()}"
                else:
                    full_name = display_name.title()
                
                players.append({
                    'number': number,
                    'position': position,
                    'name': full_name,
                    'display_name': display_name,
                    'first_name': first_name or '',
                    'last_name': last_name or parts[0] if parts else '',
                    'dob': dob or '',
                    'age': age,
                    'club': club or '',
                    'height_cm': height,
                    'caps': caps,
                    'goals': goals,
                    'team': team_name,
                    'team_code': team_code,
                })
            i = j + 1
        else:
            i += 1
    
    all_squads[team_name] = {'code': team_code, 'players': players}
    print(f"  {team_name} ({team_code}): {len(players)} players")

with open('squads.json', 'w', encoding='utf-8') as f:
    json.dump(all_squads, f, ensure_ascii=False, indent=2)

total = sum(len(v['players']) for v in all_squads.values())
print(f"\n✅ squads.json written: {len(all_squads)} teams, {total} players")

# Show sample
print("\nSample - Argentina squad:")
for p in list(all_squads.get('Argentina', {}).get('players', []))[:5]:
    print(f"  #{p['number']} {p['position']} {p['name']} ({p['club']}) caps:{p['caps']}")
