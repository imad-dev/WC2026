import { useState } from 'react';

export default function H2HTab({ match, h2h }: any) {
  const [filter, setFilter] = useState<'all' | 'competition' | 'home'>('all');

  const homeTeamId = match.home_team?.id || match.home_team_id;

  const filteredH2H = h2h.filter((h: any) => {
    if (filter === 'all') return true;
    if (filter === 'competition') return h.competition === 'FIFA World Cup';
    if (filter === 'home') return h.home_team_id === homeTeamId;
    return true;
  });

  const getResultPill = (h: any) => {
    // Relative to the home_team of the *current match viewing*
    let isHome = h.home_team_id === homeTeamId;
    let homeS = h.home_score;
    let awayS = h.away_score;
    
    let result = 'D';
    if (isHome) {
      if (homeS > awayS) result = 'W';
      if (homeS < awayS) result = 'L';
    } else {
      if (awayS > homeS) result = 'W';
      if (awayS < homeS) result = 'L';
    }

    const colors = {
      'W': 'bg-[var(--wc-green)] text-white',
      'D': 'bg-[var(--wc-text-muted)] text-black',
      'L': 'bg-[var(--wc-red)] text-white'
    };

    return (
      <span className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold ${colors[result as keyof typeof colors]}`}>
        {result}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 w-full">
      {/* FILTER ROW */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6 pb-4 border-b border-[var(--wc-border)]">
        <div className="flex items-center gap-3">
          <span className="font-bold">Show:</span>
          <button 
            className={`text-xs px-3 py-1.5 rounded-full ${filter === 'all' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
            onClick={() => setFilter('all')}
          >All</button>
          <button 
            className={`text-xs px-3 py-1.5 rounded-full ${filter === 'competition' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
            onClick={() => setFilter('competition')}
          >This Competition</button>
          <button 
            className={`text-xs px-3 py-1.5 rounded-full ${filter === 'home' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
            onClick={() => setFilter('home')}
          >At {match.home_team?.name || 'Home'}</button>
        </div>
      </div>

      {/* MATCHES LIST */}
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--wc-text-muted)] mb-4">Recent Meetings</h3>
      
      {filteredH2H.length === 0 ? (
        <div className="text-center py-8 text-[var(--wc-text-muted)] border border-[var(--wc-border)] rounded-lg border-dashed">
          No head-to-head records found for selected filter.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredH2H.map((h: any) => (
            <div key={h.id} className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-lg p-3 hover:bg-white/5 transition-colors flex items-center gap-4">
              {/* Date & Comp */}
              <div className="w-[100px] shrink-0 border-r border-[var(--wc-border)] pr-2">
                <div className="text-[10px] text-[var(--wc-text-muted)] truncate" title={h.competition}>{h.competition}</div>
                <div className="text-xs font-medium">{new Date(h.match_date).toLocaleDateString()}</div>
              </div>
              
              {/* Teams & Score */}
              <div className="flex-1 flex flex-col justify-center">
                <div className={`flex justify-between items-center ${h.home_score > h.away_score ? 'font-bold text-white' : 'text-[var(--wc-text-muted)]'}`}>
                  <div className="flex items-center gap-2">
                    {h.home_team?.country_code && <img src={`https://flagcdn.com/16x12/${h.home_team.country_code}.png`} alt="flag" />}
                    <span>{h.home_team?.name || 'Home'}</span>
                  </div>
                  <span>{h.home_score}</span>
                </div>
                <div className={`flex justify-between items-center mt-1 ${h.away_score > h.home_score ? 'font-bold text-white' : 'text-[var(--wc-text-muted)]'}`}>
                  <div className="flex items-center gap-2">
                    {h.away_team?.country_code && <img src={`https://flagcdn.com/16x12/${h.away_team.country_code}.png`} alt="flag" />}
                    <span>{h.away_team?.name || 'Away'}</span>
                  </div>
                  <span>{h.away_score}</span>
                </div>
              </div>

              {/* Result Pill */}
              <div className="shrink-0 flex justify-center w-8">
                {getResultPill(h)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
