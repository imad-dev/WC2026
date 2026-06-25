'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Sidebar widgets
import ScoreWidget from './sidebar/ScoreWidget';
import PredictionWidget from './sidebar/PredictionWidget';
import OddsWidget from './sidebar/OddsWidget';
import MatchInfoWidget from './sidebar/MatchInfoWidget';

// Tabs
import LineupsTab from './tabs/LineupsTab';
import StandingsTab from './tabs/StandingsTab';
import H2HTab from './tabs/H2HTab';
import MediaTab from './tabs/MediaTab';

type Tab = 'lineups' | 'standings' | 'h2h' | 'media';

export default function MatchDetailClient({ match, lineups, stats, events, h2h, predictions }: any) {
  const [activeTab, setActiveTab] = useState<Tab>('lineups');
  const [matchData, setMatchData] = useState(match);
  const [liveEvents, setLiveEvents] = useState(events || []);
  const [livePredictions, setLivePredictions] = useState(predictions);

  // Setup Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel(`match-${match.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'wc2026_matches',
        filter: `id=eq.${match.id}`
      }, (payload) => {
        setMatchData(payload.new);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'wc2026_match_events',
        filter: `match_id=eq.${match.id}`
      }, (payload) => {
        setLiveEvents((prev: any) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [match.id]);

  const homeTeamName = matchData.home_team?.name || matchData.home_team || 'Home';
  const awayTeamName = matchData.away_team?.name || matchData.away_team || 'Away';
  const competition = matchData.round || 'FIFA World Cup';

  const dateStr = matchData.match_date ? new Date(matchData.match_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '';

  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)] text-white text-sm font-sans pb-16">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 pt-4">
        
        {/* BREADCRUMB */}
        <div className="flex items-center text-xs text-[var(--wc-text-muted)] mb-4 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white">Football</Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span>World</span>
          <ChevronRight className="w-3 h-3 mx-1" />
          <Link href="/schedule" className="hover:text-white">FIFA World Cup</Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span className="text-white font-medium">{homeTeamName} vs {awayTeamName}</span>
        </div>

        {/* HEADER BAR */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--wc-text-muted)] mb-6 bg-[var(--wc-surface)] p-3 rounded-lg border border-[var(--wc-border)] shadow-sm">
          <div className="flex items-center gap-2">
            <span>{dateStr}</span>
            {matchData.match_time && <span>·</span>}
            {matchData.match_time && <span>{matchData.match_time}</span>}
          </div>
          <span className="w-1 h-1 rounded-full bg-[var(--wc-border)] hidden sm:block"></span>
          <span className="text-[var(--wc-gold)] uppercase tracking-wider">{competition}</span>
          {matchData.venue && <span className="w-1 h-1 rounded-full bg-[var(--wc-border)] hidden sm:block"></span>}
          {matchData.venue && <span className="truncate max-w-[150px] sm:max-w-none">{matchData.venue}</span>}
          
          {matchData.broadcasters && matchData.broadcasters.length > 0 && (
            <div className="ml-auto flex items-center gap-1 bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded">
              <span className="text-white">📺 {matchData.broadcasters[0]}</span>
              {matchData.broadcasters.length > 1 && <span className="text-[10px] bg-[var(--wc-red)] text-white px-1 rounded">+{matchData.broadcasters.length - 1}</span>}
            </div>
          )}
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-4">
            <ScoreWidget match={matchData} events={liveEvents} />
            <PredictionWidget matchId={matchData.id} homeTeam={matchData.home_team} awayTeam={matchData.away_team} initialPredictions={livePredictions} onPredict={setLivePredictions} />
            <OddsWidget />
            <MatchInfoWidget match={matchData} />
          </div>

          {/* CENTER MAIN PANEL */}
          <div className="w-full flex-1 bg-[var(--wc-surface)] rounded-xl border border-[var(--wc-border)] overflow-hidden shadow-lg flex flex-col min-h-[600px]">
            {/* TABS */}
            <div className="flex border-b border-[var(--wc-border)] overflow-x-auto hide-scrollbar sticky top-0 bg-[var(--wc-surface)] z-10">
              {(['lineups', 'standings', 'h2h', 'media'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[100px] py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === tab 
                      ? 'border-[var(--wc-green)] text-white bg-[rgba(255,255,255,0.03)]' 
                      : 'border-transparent text-[var(--wc-text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.01)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="p-0 flex-1 relative bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.2)]">
              {activeTab === 'lineups' && <LineupsTab match={matchData} lineups={lineups} />}
              {activeTab === 'standings' && <StandingsTab match={matchData} />}
              {activeTab === 'h2h' && <H2HTab match={matchData} h2h={h2h} />}
              {activeTab === 'media' && <MediaTab match={matchData} />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
