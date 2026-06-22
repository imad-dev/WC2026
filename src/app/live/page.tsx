'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Clock, BarChart2, Send } from 'lucide-react';
import { supabase, WC2026Match } from '@/lib/supabaseClient';
import { useGeo } from '@/hooks/useSupabase';

export default function LiveHubPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'timeline' | 'predict'>('predict');
  const [chatMessages, setChatMessages] = useState<{id: number, user: string, msg: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [predictedTeam, setPredictedTeam] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const country = useGeo();
  const showAds = country !== 'ES';

  // Live match state
  const [liveMatch, setLiveMatch] = useState<WC2026Match | null>(null);

  // Ad state
  const [adClicked, setAdClicked] = useState(false);
  
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
      
      {/* Page H1 — compact visible heading */}
      <div className="w-full bg-[var(--wc-dark)] border-b border-[var(--wc-border)] px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg sm:text-xl text-white uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            Live — FIFA World Cup 2026
          </h1>
          <span className="text-[10px] font-bold text-[var(--wc-green)] tracking-widest uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--wc-green)] animate-pulse" />
            ON AIR
          </span>
        </div>
      </div>

      {/* Live App Container */}
      <div className="w-full flex flex-col lg:flex-row min-h-[500px] lg:h-[calc(100vh-117px)] border-b border-[var(--wc-border)]">

      {/* LEFT: Video Player */}
      <div className="w-full lg:flex-1 h-[40vh] sm:h-[45vh] lg:h-full min-h-[300px] relative bg-black flex flex-col group">
        
        {/* Live Broadcast Iframe */}
        <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
          {(!adClicked && showAds) && (
            <a 
              href="https://www.effectivecpmnetwork.com/steh40ys?key=c3817b02a6ce5ba1e04b14695f562abc"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAdClicked(true)}
              className="absolute inset-0 w-full h-full z-30 flex flex-col items-center justify-center cursor-pointer group bg-black/40 hover:bg-black/20 transition-colors"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--wc-red)]/80 backdrop-blur-md flex items-center justify-center group-hover:bg-[var(--wc-red)] group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(232,0,29,0.5)]">
                <div className="w-0 h-0 border-t-[12px] sm:border-t-[15px] border-t-transparent border-l-[20px] sm:border-l-[25px] border-l-white border-b-[12px] sm:border-b-[15px] border-b-transparent ml-2"></div>
              </div>
              <span className="mt-4 text-white font-bold tracking-widest text-sm sm:text-base uppercase drop-shadow-lg">Click to Play</span>
            </a>
          )}
          <div className="absolute inset-0 w-full h-full z-10">
            <iframe allowFullScreen={true} frameBorder="0" height="100%" scrolling="1" src="https://mesi.onlineworldcup2026.com/albaplayer/sports-1/" width="100%"></iframe>
          </div>
        </div>
      </div>

      {/* RIGHT: Interactive Panels */}
      <div className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 h-[calc(60vh-64px)] sm:h-[calc(55vh-64px)] lg:h-full bg-[var(--wc-surface)] border-l border-[var(--wc-border)] flex flex-col overflow-hidden">
        
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

                {/* Smartlink Ad Button */}
                {showAds && (
                  <a 
                    href="https://www.effectivecpmnetwork.com/steh40ys?key=c3817b02a6ce5ba1e04b14695f562abc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full mt-6 py-3 bg-gradient-to-r from-[var(--wc-gold)] to-yellow-600 text-black font-bold text-sm sm:text-base rounded-lg text-center shadow-[0_0_15px_rgba(245,166,35,0.4)] hover:scale-105 transition-transform uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">🎁</span> Claim Your World Cup Bonus
                  </a>
                )}

                {/* Native Banner Ad */}
                {showAds && (
                  <div className="w-full mt-6 min-h-[100px] flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
                    <script async={true} data-cfasync="false" src="https://pl29770202.effectivecpmnetwork.com/3ffa407b9e421b28184453613f9fdd5c/invoke.js"></script>
                    <div id="container-3ffa407b9e421b28184453613f9fdd5c"></div>
                  </div>
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

      {/* SEO Article Section (Bilingual) */}
      <article className="max-w-6xl mx-auto px-4 py-12 text-white w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Arabic Section */}
          <div dir="rtl" className="space-y-6 text-gray-300 leading-relaxed text-lg font-sans">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--wc-green)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              بث مباشر وتغطية حية لمباريات 20 و 21 يونيو في كأس العالم 2026: قمم أوروبية خالصة ومواجهات حاسمة
            </h2>
            <p>
              مرحباً بكم في التغطية الحية والحصرية لمباريات <strong>كأس العالم FIFA 2026</strong>. 
              تتجه أنظار عشاق كرة القدم حول العالم يومي 20 و 21 يونيو 2026 نحو مواجهات حاسمة ومثيرة، 
              حيث نشهد قمة أوروبية خالصة تجمع بين الطواحين الهولندية والمنتخب السويدي، واختباراً قوياً للمنتخب الألماني أمام كوت ديفوار. 
              كما يحمل اليوم التالي مواجهات نارية لمنتخبات مثل إسبانيا، بلجيكا، أوروغواي والمنتخب السعودي.
              تابعوا معنا البث المباشر وأدق التفاصيل لحظة بلحظة عبر منصتنا.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4 border-r-4 border-[var(--wc-red)] pr-4">
              مباريات اليوم (20 يونيو): هولندا ضد السويد وألمانيا ضد كوت ديفوار
            </h3>
            <p>
              تستمر المتعة بمواجهات من العيار الثقيل هذا اليوم، حيث يلتقي <strong>المنتخب الهولندي</strong> بنظيره <strong>السويدي</strong> في قمة المجموعة السادسة عند الساعة 18:00. وفي الساعة 21:00، يسعى <strong>المنتخب الألماني</strong> لتحقيق انتصار مهم عندما يواجه أفيال <strong>كوت ديفوار</strong> في مواجهة قوية لحساب المجموعة الخامسة.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4 border-r-4 border-[var(--wc-red)] pr-4">
              مباريات الغد (21 يونيو): إسبانيا تواجه السعودية وظهور بلجيكا وأوروغواي
            </h3>
            <p>
              يحمل يوم غد جدولاً مزدحماً بالمباريات الحاسمة. تبدأ الإثارة بمواجهة الإكوادور ضد كوراساو (01:00) وتونس ضد اليابان (05:00). 
              وتتجه الأنظار العربية نحو <strong>المنتخب السعودي</strong> الذي يواجه تحدياً صعباً أمام <strong>الماتادور الإسباني</strong> (17:00). 
              كما يلتقي <strong>المنتخب البلجيكي</strong> بنظيره الإيراني (20:00)، وتُختتم الليلة بلقاء <strong>أوروغواي</strong> القوي أمام الرأس الأخضر (23:00). يوم مليء بالإثارة الكروية التي لا تفوت!
            </p>
          </div>

          {/* English Section */}
          <div dir="ltr" className="space-y-6 text-gray-300 leading-relaxed text-lg font-sans">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--wc-green)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Live Coverage for June 20 & 21 Matches in the 2026 World Cup: All-European Clashes & Decisive Encounters
            </h2>
            <p>
              Welcome to the live and exclusive coverage of the <strong>FIFA World Cup 2026</strong> matches. 
              Football fans worldwide are turning their attention to June 20 and 21, 2026, for decisive and thrilling encounters. 
              Today features a massive all-European clash between the Netherlands and Sweden, as well as a strong test for Germany against Ivory Coast. 
              Tomorrow brings a packed schedule featuring powerhouses like Spain, Belgium, Uruguay, and an exciting challenge for Saudi Arabia.
              Follow our live broadcast and minute-by-minute details on our platform.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4 border-l-4 border-[var(--wc-red)] pl-4">
              Today's Matches (June 20): Netherlands vs Sweden & Germany vs Ivory Coast
            </h3>
            <p>
              The excitement continues today with heavyweight matchups, as the <strong>Netherlands</strong> takes on <strong>Sweden</strong> in a crucial Group F clash at 18:00. Later at 21:00, the <strong>German National Team</strong> seeks an important victory against the Elephants of <strong>Ivory Coast</strong> in a strong Group E encounter.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4 border-l-4 border-[var(--wc-red)] pl-4">
              Tomorrow's Clashes (June 21): Spain vs Saudi Arabia, Belgium, and Uruguay
            </h3>
            <p>
              Tomorrow brings a packed schedule of decisive games. The action starts early with Ecuador vs Curaçao (01:00) and Tunisia vs Japan (05:00). 
              All eyes will then turn to <strong>Saudi Arabia</strong> as they face a tough challenge against <strong>Spain</strong> (17:00). 
              Additionally, <strong>Belgium</strong> meets Iran (20:00), and the night concludes with a strong <strong>Uruguay</strong> taking on Cabo Verde (23:00). A day full of unmissable football excitement!
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--wc-surface-2)] p-6 rounded-xl mt-12 border border-[var(--wc-border)] text-center">
            <h3 className="text-xl font-bold text-[var(--wc-gold)] mb-3">Join the Live Chat / شارك برأيك في الدردشة الحية</h3>
            <p className="text-sm text-gray-400">
              Don't miss the chance to interact with fans from all over the world. Use the "Chat" section at the top of the page to share your match predictions, and follow the Timeline for real-time goals and cards updates. / 
              لا تفوتوا فرصة التفاعل مع المشجعين من كافة أنحاء العالم. استخدموا قسم "الدردشة" أعلى الصفحة لمشاركة توقعاتكم للنتائج، ومتابعة الخط الزمني للأهداف والبطاقات أولاً بأول.
            </p>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 text-center" dir="ltr">
            <h3 className="font-bold text-gray-400 mb-2">Watch Live Streaming WC 2026</h3>
            <p>
              Looking for a reliable wc 2026 stream? You are in the right place for fifa world cup 2026 live streaming. 
              We offer every wc match in crystal clear quality. Enjoy fifa world cup 2026 live streaming full hd free, 
              ensuring you catch all the action of the live fifa world cup 2026. Whether it's a group stage parche wc 2026 
              or the grand finale, our fifa wc free streaming hub has you covered.
            </p>
          </div>
        </div>
      </article>

      {/* Internal Links Section */}
      <nav className="max-w-4xl mx-auto px-4 pb-12" aria-label="Related pages">
        <h2 className="text-xl text-white uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>Explore More</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/schedule', label: 'Match Schedule', icon: '📅' },
            { href: '/groups', label: 'Group Standings', icon: '📊' },
            { href: '/teams', label: 'All 48 Teams', icon: '🏳️' },
            { href: '/venues', label: 'Stadiums & Venues', icon: '🏟️' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 p-3 rounded-lg bg-[var(--wc-surface)] border border-[var(--wc-border)] text-white text-sm font-medium hover:border-[var(--wc-green)] transition-colors"
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

    </div>
  );
}
