'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Clock, BarChart2, Send } from 'lucide-react';
import { supabase, WC2026Match } from '@/lib/supabaseClient';

export default function LiveHubPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'timeline' | 'predict'>('predict');
  const [chatMessages, setChatMessages] = useState<{id: number, user: string, msg: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [predictedTeam, setPredictedTeam] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live match state
  const [liveMatch, setLiveMatch] = useState<WC2026Match | null>(null);
  
  // Predictions state
  const [predictionStats, setPredictionStats] = useState({ team_a_pct: 0, draw_pct: 0, team_b_pct: 0, total_votes: 0 });

  const fetchPredictions = async (matchId: number) => {
    const { data } = await supabase.rpc('get_prediction_percentages', { p_match_id: matchId });
    if (data && data.length > 0) {
      setPredictionStats({
        team_a_pct: Number(data[0].team_a_pct) || 0,
        draw_pct: Number(data[0].draw_pct) || 0,
        team_b_pct: Number(data[0].team_b_pct) || 0,
        total_votes: Number(data[0].total_votes) || 0
      });
    }
  };

  useEffect(() => {
    // 1. Fetch initial live match
    const fetchLiveMatch = async () => {
      const { data, error } = await supabase
        .from('wc2026_matches')
        .select('*')
        .eq('status', 'live')
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setLiveMatch(data);
        fetchPredictions(data.id);
      }
    };
    fetchLiveMatch();

    // 2. Subscribe to realtime updates for matches
    const matchesChannel = supabase.channel('live-matches')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wc2026_matches', filter: "status=eq.live" },
        (payload) => {
          if (payload.new && (payload.new as any).status === 'live') {
            setLiveMatch(payload.new as WC2026Match);
          }
        }
      )
      .subscribe();

    // 3. Subscribe to predictions
    const predictionsChannel = supabase.channel('live-predictions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'wc2026_predictions' },
        () => {
          if (liveMatch) {
            fetchPredictions(liveMatch.id);
          } else {
             // In case liveMatch isn't set in closure, we just re-fetch the match query or rely on useEffect deps.
             // Best to just re-fetch live match predictions
             fetchLiveMatch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(predictionsChannel);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev.slice(-19), { id: Date.now(), user: 'You', msg: chatInput }]);
    setChatInput('');
  };

  const submitPrediction = async (choice: 'team_a' | 'draw' | 'team_b', teamLabel: string) => {
    if (!liveMatch || predictedTeam) return;
    
    setPredictedTeam(teamLabel);
    
    // Generate an anonymous user UUID (or load from localStorage in a real app)
    const randomUserId = crypto.randomUUID();
    
    await supabase.from('wc2026_predictions').insert({
      match_id: liveMatch.id,
      choice: choice,
      user_id: randomUserId
    });
  };

  return (
    <div className="w-full bg-[#030408] flex flex-col min-h-screen">
      
      {/* Live App Container */}
      <div className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-64px)] border-b border-[var(--wc-border)]">
      
      {/* SEO text */}
      <div className="sr-only">
        <h1>Live Matches - FIFA World Cup 2026</h1>
        <p>Watch live match broadcasts, predict match outcomes, track the timeline of events, and chat with other fans worldwide during the FIFA World Cup 2026.</p>
      </div>

      {/* LEFT: Video Player */}
      <div className="w-full lg:flex-1 h-[35vh] sm:h-[40vh] lg:h-[calc(100vh-64px)] relative bg-black flex flex-col group">
        
        {/* Live Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 sm:gap-3 bg-[rgba(10,14,26,0.6)] backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[rgba(255,255,255,0.1)] max-w-[calc(100%-60px)]">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--wc-red)] animate-pulse shadow-[0_0_8px_var(--wc-red)] shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-wider sm:tracking-widest text-white uppercase truncate" style={{ fontFamily: 'var(--font-display)' }}>
              LIVE · {liveMatch ? `${liveMatch.home_team.substring(0,3).toUpperCase()} ${liveMatch.home_score}-${liveMatch.away_score} ${liveMatch.away_team.substring(0,3).toUpperCase()}` : 'LOADING...'} 
              {liveMatch?.kickoff_utc && ` · ${Math.max(0, Math.floor((Date.now() - new Date(liveMatch.kickoff_utc).getTime()) / 60000))}'`}
            </span>
          </div>
          <div className="px-2 sm:px-3 py-1 bg-[var(--wc-red)] text-white text-[10px] sm:text-xs font-bold rounded shrink-0">LIVE</div>
        </div>

        {/* Live Broadcast Iframe */}
        <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
          <iframe 
            allowFullScreen={true} 
            frameBorder="0" 
            height="100%" 
            scrolling="yes" 
            src="https://xxx.onlineworldcup2026.com/albaplayer/sports-1/" 
            width="100%"
            className="absolute inset-0 w-full h-full z-10"
          ></iframe>
        </div>
      </div>

      {/* RIGHT: Interactive Panels */}
      <div className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 h-[calc(65vh-64px)] sm:h-[calc(60vh-64px)] lg:h-[calc(100vh-64px)] bg-[var(--wc-surface)] border-l border-[var(--wc-border)] flex flex-col overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-[var(--wc-border)] bg-[var(--wc-dark)] shrink-0">
          {[
            { id: 'predict', label: 'Predict', icon: BarChart2 },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'timeline', label: 'Timeline', icon: Clock }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-colors ${isActive ? 'text-[var(--wc-green)] bg-[rgba(0,166,81,0.05)] border-b-2 border-[var(--wc-green)]' : 'text-[var(--wc-text-muted)] hover:text-white'}`}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          <AnimatePresence mode="wait">
            
            {/* PREDICT TAB */}
            {activeTab === 'predict' && (
              <motion.div 
                key="predict"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto"
              >
                <h3 className="text-xl sm:text-2xl text-white mb-6 sm:mb-8 uppercase text-center" style={{ fontFamily: 'var(--font-display)' }}>Who will win?</h3>
                
                {/* Radial Gauge */}
                <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center mb-6 sm:mb-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
                  style={{ 
                    background: `conic-gradient(var(--wc-green) 0% ${predictionStats.team_a_pct}%, var(--wc-gold) ${predictionStats.team_a_pct}% ${predictionStats.team_a_pct + predictionStats.draw_pct}%, var(--wc-red) ${predictionStats.team_a_pct + predictionStats.draw_pct}% 100%)` 
                  }}
                >
                  <div className="absolute inset-2 rounded-full bg-[var(--wc-surface)] flex flex-col items-center justify-center text-center">
                    <span className="text-3xl sm:text-4xl text-white mb-1 tabular font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                      {Math.max(predictionStats.team_a_pct, predictionStats.draw_pct, predictionStats.team_b_pct).toFixed(0)}%
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[var(--wc-green)] font-bold tracking-widest uppercase">
                      {predictionStats.team_a_pct > predictionStats.team_b_pct && predictionStats.team_a_pct > predictionStats.draw_pct ? liveMatch?.home_team :
                       predictionStats.team_b_pct > predictionStats.team_a_pct && predictionStats.team_b_pct > predictionStats.draw_pct ? liveMatch?.away_team :
                       predictionStats.draw_pct > Math.max(predictionStats.team_a_pct, predictionStats.team_b_pct) ? 'Draw' : 'Tie'}
                    </span>
                  </div>
                </div>

                <div className="w-full flex gap-2 sm:gap-3">
                  <button 
                    onClick={() => submitPrediction('team_a', liveMatch?.home_team?.substring(0,3).toUpperCase() || 'HOME')}
                    className={`flex-1 py-2.5 sm:py-3 border border-[var(--wc-green)] rounded font-bold text-xs sm:text-sm transition-colors ${predictedTeam === liveMatch?.home_team?.substring(0,3).toUpperCase() ? 'bg-[var(--wc-green)] text-black' : 'bg-[rgba(0,166,81,0.1)] text-[var(--wc-green)] hover:bg-[var(--wc-green)] hover:text-black'}`}
                  >
                    {liveMatch?.home_team?.substring(0,3).toUpperCase() || 'HOME'}
                  </button>
                  <button 
                    onClick={() => submitPrediction('draw', 'DRAW')}
                    className={`flex-1 py-2.5 sm:py-3 border border-[var(--wc-gold)] rounded font-bold text-xs sm:text-sm transition-colors ${predictedTeam === 'DRAW' ? 'bg-[var(--wc-gold)] text-black' : 'bg-[rgba(245,166,35,0.1)] text-[var(--wc-gold)] hover:bg-[var(--wc-gold)] hover:text-black'}`}
                  >
                    DRAW
                  </button>
                  <button 
                    onClick={() => submitPrediction('team_b', liveMatch?.away_team?.substring(0,3).toUpperCase() || 'AWAY')}
                    className={`flex-1 py-2.5 sm:py-3 border border-[var(--wc-red)] rounded font-bold text-xs sm:text-sm transition-colors ${predictedTeam === liveMatch?.away_team?.substring(0,3).toUpperCase() ? 'bg-[var(--wc-red)] text-black' : 'bg-[rgba(232,0,29,0.1)] text-[var(--wc-red)] hover:bg-[var(--wc-red)] hover:text-black'}`}
                  >
                    {liveMatch?.away_team?.substring(0,3).toUpperCase() || 'AWAY'}
                  </button>
                </div>
                
                {predictedTeam && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-xs mt-4 text-center bg-white/10 px-4 py-2 rounded-full"
                  >
                    You predicted: <span className="font-bold">{predictedTeam === 'DRAW' ? 'A DRAW' : predictedTeam + ' TO WIN'}</span>
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* LIVE CHAT TAB */}
            {activeTab === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 flex flex-col bg-[var(--wc-surface)]"
              >
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  <div className="text-center text-[10px] text-[var(--wc-text-muted)] tracking-widest uppercase my-4">Welcome to Live Chat</div>
                  {chatMessages.map(m => (
                    <div key={m.id} className="flex flex-col">
                      <span className="text-[10px] text-[var(--wc-text-muted)] font-bold">{m.user}</span>
                      <p className="text-sm text-white bg-[var(--wc-surface-2)] p-2.5 rounded-r-lg rounded-bl-lg w-max max-w-[80%] break-words">{m.msg}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[var(--wc-surface-2)] border-t border-[var(--wc-border)] flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Say something..." 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    className="flex-1 min-w-0 bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--wc-green)]"
                  />
                  <button type="submit" className="w-10 h-10 rounded-full bg-[var(--wc-green)] text-black flex items-center justify-center hover:scale-105 transition-transform shrink-0">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'timeline' && (
              <motion.div 
                key="timeline"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 p-4 sm:p-6 overflow-y-auto"
              >
                <div className="relative border-l-2 border-[var(--wc-border)] ml-4 space-y-8">
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--wc-green)] border-4 border-[var(--wc-surface)]" />
                    <span className="text-[10px] font-bold text-[var(--wc-green)] tracking-widest">67'</span>
                    <h4 className="text-white font-bold">Goal! Mexico 1, South Africa 0.</h4>
                    <p className="text-xs text-[var(--wc-text-muted)] mt-1">Santiago Giménez (Mexico) left footed shot from the centre of the box.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--wc-gold)] border-4 border-[var(--wc-surface)]" />
                    <span className="text-[10px] font-bold text-[var(--wc-gold)] tracking-widest">45+2'</span>
                    <h4 className="text-white font-bold">Half Time</h4>
                    <p className="text-xs text-[var(--wc-text-muted)] mt-1">First Half ends, Mexico 0, South Africa 0.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--wc-surface-2)] border-4 border-[var(--wc-surface)]" />
                    <span className="text-[10px] font-bold text-[var(--wc-text-muted)] tracking-widest">1'</span>
                    <h4 className="text-[var(--wc-text-muted)] font-bold">Kickoff</h4>
                    <p className="text-xs text-[var(--wc-text-muted)] mt-1">First Half begins.</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      </div> {/* End of Live App Container */}

      {/* SEO Article Section (Arabic) */}
      <article className="max-w-4xl mx-auto px-4 py-12 text-white w-full" dir="rtl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-[var(--wc-green)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          بث مباشر وتغطية حية لمباريات اليوم في كأس العالم 2026: العراق، الجزائر، والأردن في مهمة تاريخية
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-sans">
          <p>
            مرحباً بكم في التغطية الحية والحصرية لمباريات اليوم ضمن منافسات <strong>كأس العالم FIFA 2026</strong>. 
            تتجه أنظار عشاق كرة القدم حول العالم اليوم، 16 يونيو 2026، نحو ثلاث مواجهات نارية ومثيرة، 
            حيث تشهد البطولة مشاركة تاريخية لمنتخباتنا العربية: العراق، الجزائر، والأردن. 
            تابعوا معنا البث المباشر وأدق التفاصيل لحظة بلحظة عبر منصتنا.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-r-4 border-[var(--wc-red)] pr-4">
            موعد مباراة النرويج ضد العراق (المجموعة التاسعة)
          </h2>
          <p>
            في مواجهة مرتقبة بملعب جيليت (Gillette Stadium)، يعود <strong>المنتخب العراقي</strong> (أسود الرافدين) 
            للظهور في المونديال لأول مرة منذ عام 1986. ستكون المهمة صعبة أمام <strong>المنتخب النرويجي</strong> 
            المدجج بالنجوم أمثال إيرلينغ هالاند ومارتن أوديغارد، والذي يعود بدوره للبطولة لأول مرة منذ 1998. 
            هل ينجح الدفاع العراقي في الصمود أمام الهجوم النرويجي الكاسح؟
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-r-4 border-[var(--wc-red)] pr-4">
            موعد مباراة الجزائر ضد الأرجنتين (المجموعة العاشرة)
          </h2>
          <p>
            تتجه الأنظار نحو ملعب كانساس سيتي لمتابعة قمة كروية من العيار الثقيل تجمع <strong>المنتخب الجزائري</strong> 
            (محاربو الصحراء) ببطل العالم <strong>المنتخب الأرجنتيني</strong>. يسعى رفاق رياض محرز لتحقيق 
            مفاجأة مدوية وتكرار إنجازاتهم المونديالية التاريخية، في حين تطمح الأرجنتين لبداية قوية في حملة 
            الدفاع عن اللقب. لقاء يعد بالكثير من الإثارة والتكتيك العالي.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-r-4 border-[var(--wc-red)] pr-4">
            موعد مباراة النمسا ضد الأردن (المجموعة العاشرة)
          </h2>
          <p>
            يكتب <strong>المنتخب الأردني</strong> (النشامى) تاريخاً جديداً بمشاركته الأولى على الإطلاق 
            في نهائيات كأس العالم. يلتقي الأردن مع <strong>المنتخب النمساوي</strong> القوي المتطور أوروبياً 
            على أرضية ملعب ليفاي (Levi's Stadium). يتسلح الأردنيون بالروح العالية والجيل الذهبي بقيادة 
            موسى التعمري، سعيًا لخطف نقاط المباراة الافتتاحية ووضع بصمة لا تُنسى في مشاركتهم الأولى.
          </p>

          <div className="bg-[var(--wc-surface-2)] p-6 rounded-xl mt-8 border border-[var(--wc-border)]">
            <h3 className="text-xl font-bold text-[var(--wc-gold)] mb-3">شارك برأيك في الدردشة الحية</h3>
            <p className="text-sm text-gray-400">
              لا تفوتوا فرصة التفاعل مع المشجعين من كافة أنحاء العالم. استخدموا قسم "الدردشة" (Chat) أعلى الصفحة 
              لمشاركة توقعاتكم للنتائج، ومتابعة الخط الزمني (Timeline) للأهداف والبطاقات أولاً بأول. 
              تجربة كأس العالم 2026 تكتمل بمشاركتكم!
            </p>
          </div>
        </div>
      </article>

    </div>
  );
}
