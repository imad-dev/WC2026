import fs from 'fs';
let content = fs.readFileSync('src/app/components/LiveScoresWidget.tsx', 'utf-8');

// Add supabase import if not there
if (!content.includes("import { supabase }")) {
  content = content.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport { supabase } from '@/lib/supabaseClient';");
}

// Modify refresh() to try supabase
const fallbackLogic = `
    // Try Supabase matches as a fallback before static data
    const { data: dbMatches } = await supabase.from('wc2026_matches').select('*');
    if (dbMatches && dbMatches.length > 0) {
      const liveDb = dbMatches.filter(m => ['live', 'in_play', 'LIVE', 'IN_PLAY'].includes(m.status));
      if (liveDb.length > 0) {
        setMatches(liveDb.map(m => ({
          id: String(m.id),
          home: m.home_team,
          homeFlag: '', // We could join teams but for now empty
          away: m.away_team,
          awayFlag: '',
          homeScore: m.home_score || 0,
          awayScore: m.away_score || 0,
          status: 'LIVE',
          time: m.minute || '1',
          group: m.group_name || ''
        })));
        setIsLive(true);
        setApiActive(false);
        setLastUpdated(new Date());
        setLoading(false);
        return;
      }
    }
`;

content = content.replace("// 3. Fallback to static data", fallbackLogic + "\n    // 3. Fallback to static data");

fs.writeFileSync('src/app/components/LiveScoresWidget.tsx', content);
