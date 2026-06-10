'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface MatchTabsProps {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
}

interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  x: number; // 0-100 percentage for pitch position (x-axis)
  y: number; // 0-100 percentage for pitch position (y-axis)
  team: 'home' | 'away';
}

export function MatchTabs({ matchId, homeTeam, awayTeam }: MatchTabsProps) {
  const [activeTab, setActiveTab] = useState<'lineups' | 'standings' | 'h2h' | 'media'>('lineups');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLineups() {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('wc2026_lineups')
        .select('*')
        .eq('match_id', matchId);

      if (!error && data && data.length > 0) {
        setPlayers(data);
      } else {
        // Fallback realistic mock data (Sofascore style) if DB is empty
        setPlayers([
          // Home Team (Left side - assuming 4-3-3)
          { id: 1, name: 'R. Rangel', number: 1, position: 'GK', x: 5, y: 50, team: 'home' },
          { id: 2, name: 'J. Gallardo', number: 23, position: 'DEF', x: 20, y: 20, team: 'home' },
          { id: 3, name: 'J. Vásquez', number: 5, position: 'DEF', x: 20, y: 40, team: 'home' },
          { id: 4, name: 'C. Montes', number: 3, position: 'DEF', x: 20, y: 60, team: 'home' },
          { id: 5, name: 'I. Reyes', number: 15, position: 'DEF', x: 20, y: 80, team: 'home' },
          { id: 6, name: 'A. Fidalgo', number: 8, position: 'MID', x: 35, y: 30, team: 'home' },
          { id: 7, name: 'E. Lira', number: 6, position: 'MID', x: 35, y: 50, team: 'home' },
          { id: 8, name: 'B. Gutiérrez', number: 26, position: 'MID', x: 35, y: 70, team: 'home' },
          { id: 9, name: 'J. Quiñones', number: 16, position: 'FWD', x: 45, y: 25, team: 'home' },
          { id: 10, name: 'R. Jiménez', number: 9, position: 'FWD', x: 45, y: 50, team: 'home' },
          { id: 11, name: 'R. Alvarado', number: 25, position: 'FWD', x: 45, y: 75, team: 'home' },

          // Away Team (Right side - assuming 4-2-3-1)
          { id: 12, name: 'R. Williams', number: 1, position: 'GK', x: 95, y: 50, team: 'away' },
          { id: 13, name: 'K. Mudau', number: 20, position: 'DEF', x: 80, y: 20, team: 'away' },
          { id: 14, name: 'I. Okon', number: 21, position: 'DEF', x: 80, y: 40, team: 'away' },
          { id: 15, name: 'M. Mbokazi', number: 14, position: 'DEF', x: 80, y: 60, team: 'away' },
          { id: 16, name: 'A. Modiba', number: 6, position: 'DEF', x: 80, y: 80, team: 'away' },
          { id: 17, name: 'O. Appollis', number: 7, position: 'MID', x: 65, y: 30, team: 'away' },
          { id: 18, name: 'J. Adams', number: 23, position: 'MID', x: 65, y: 50, team: 'away' },
          { id: 19, name: 'T. Mokoena', number: 4, position: 'MID', x: 65, y: 70, team: 'away' },
          { id: 20, name: 'L. Foster', number: 9, position: 'FWD', x: 55, y: 50, team: 'away' },
          { id: 21, name: 'T. Zwane', number: 11, position: 'FWD', x: 55, y: 30, team: 'away' },
          { id: 22, name: 'R. Mofokeng', number: 10, position: 'FWD', x: 55, y: 70, team: 'away' },
        ]);
      }
      setLoading(false);
    }
    fetchLineups();
  }, [matchId]);

  return (
    <div className="w-full bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl overflow-hidden mt-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-[var(--wc-border)] overflow-x-auto hide-scrollbar">
        {['Lineups', 'Standings', 'H2H', 'Media'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase() as any)}
            className={`flex-1 min-w-[100px] py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === tab.toLowerCase()
                ? 'border-[var(--wc-green)] text-[var(--wc-green)] bg-[var(--wc-surface-2)]'
                : 'border-transparent text-[var(--wc-text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">
        {activeTab === 'lineups' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6 px-2">
              <h4 className="text-white font-bold">{homeTeam}</h4>
              <span className="text-xs text-[var(--wc-text-muted)] uppercase tracking-widest bg-[var(--wc-surface-2)] px-3 py-1 rounded-full">Possible Lineups</span>
              <h4 className="text-white font-bold">{awayTeam}</h4>
            </div>

            {/* Pitch Container */}
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-[#2e8241] rounded-lg border-2 border-white/40 overflow-hidden shadow-inner">
              {/* Pitch Lines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/40 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white/40 -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Home Penalty Area */}
              <div className="absolute top-1/4 bottom-1/4 left-0 w-[15%] border-2 border-l-0 border-white/40"></div>
              <div className="absolute top-[35%] bottom-[35%] left-0 w-[5%] border-2 border-l-0 border-white/40"></div>
              <div className="absolute top-1/2 left-[11%] w-1.5 h-1.5 rounded-full bg-white/40 -translate-y-1/2"></div>
              
              {/* Away Penalty Area */}
              <div className="absolute top-1/4 bottom-1/4 right-0 w-[15%] border-2 border-r-0 border-white/40"></div>
              <div className="absolute top-[35%] bottom-[35%] right-0 w-[5%] border-2 border-r-0 border-white/40"></div>
              <div className="absolute top-1/2 right-[11%] w-1.5 h-1.5 rounded-full bg-white/40 -translate-y-1/2"></div>

              {/* Corner Arcs */}
              <div className="absolute top-0 left-0 w-4 h-4 border-b-2 border-r-2 border-white/40 rounded-br-full"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-t-2 border-r-2 border-white/40 rounded-tr-full"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-b-2 border-l-2 border-white/40 rounded-bl-full"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-t-2 border-l-2 border-white/40 rounded-tl-full"></div>

              {/* Players rendering */}
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-110 hover:z-10"
                  style={{ left: `${player.x}%`, top: `${player.y}%` }}
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 shadow-lg ${
                    player.team === 'home' 
                      ? 'bg-white text-black border-[var(--wc-green)]' 
                      : 'bg-[#1a2b4c] text-white border-yellow-400'
                  }`}>
                    {player.number}
                  </div>
                  <div className="mt-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] md:text-xs text-white whitespace-nowrap opacity-90 font-medium">
                    {player.name}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
               <button className="text-xs font-bold uppercase tracking-widest bg-[var(--wc-surface-2)] hover:bg-[var(--wc-green)] hover:text-black text-white px-6 py-3 rounded transition-colors">
                 Analyse Match with AI
               </button>
            </div>
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="text-[var(--wc-text-muted)] mb-4 uppercase tracking-widest text-sm font-bold">Group Standings</div>
            <p className="text-white">Standings data will be fetched from Supabase here.</p>
          </div>
        )}

        {activeTab === 'h2h' && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="text-[var(--wc-text-muted)] mb-4 uppercase tracking-widest text-sm font-bold">Head to Head Statistics</div>
            <p className="text-white">H2H history and form guide goes here.</p>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="text-[var(--wc-text-muted)] mb-4 uppercase tracking-widest text-sm font-bold">Match Media</div>
            <p className="text-white">Highlights and videos from this match.</p>
          </div>
        )}
      </div>
    </div>
  );
}
