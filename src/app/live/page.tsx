'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Play, Pause, Volume2, MessageSquare, Clock, BarChart2, Send } from 'lucide-react';

export default function LiveHubPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'timeline' | 'predict'>('predict');
  const [chatMessages, setChatMessages] = useState<{id: number, user: string, msg: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [predictedTeam, setPredictedTeam] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#030408] flex flex-col lg:flex-row overflow-hidden">
      
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
              LIVE · MEX 1-0 RSA · 67'
            </span>
          </div>
          <div className="px-2 sm:px-3 py-1 bg-[var(--wc-red)] text-white text-[10px] sm:text-xs font-bold rounded shrink-0">LIVE</div>
        </div>

        {/* Custom Placeholder Video Element */}
        <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?w=1280&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030408] via-transparent to-transparent" />
          
          <div className="z-10 flex flex-col items-center justify-center text-center px-4">
             <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
               <Play className="w-6 h-6 text-white ml-1" />
             </div>
             <h2 className="text-white text-xl sm:text-2xl font-bold tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>Waiting for Broadcast Signal</h2>
             <p className="text-[var(--wc-text-muted)] text-sm max-w-md">The live stream will begin automatically when the broadcaster provides the official feed.</p>
          </div>
        </div>

        {/* Custom Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 bg-gradient-to-t from-black/90 to-transparent opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className="flex items-center gap-3 sm:gap-4">
             <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-[var(--wc-green)] transition-colors shrink-0">
               {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
             </button>
             {/* Timeline bar */}
             <div className="flex-1 h-1 sm:h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-[var(--wc-red)] w-[75%]" />
             </div>
             <button className="text-white hover:text-[var(--wc-green)] transition-colors shrink-0"><Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /></button>
             <button className="text-white hover:text-[var(--wc-green)] transition-colors shrink-0 hidden sm:block"><Maximize className="w-4 h-4 sm:w-5 sm:h-5" /></button>
           </div>
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
                    background: `conic-gradient(var(--wc-green) 0% 62%, var(--wc-gold) 62% 74%, var(--wc-red) 74% 100%)` 
                  }}
                >
                  <div className="absolute inset-2 rounded-full bg-[var(--wc-surface)] flex flex-col items-center justify-center text-center">
                    <span className="text-3xl sm:text-4xl text-white mb-1 tabular font-bold" style={{ fontFamily: 'var(--font-mono)' }}>62%</span>
                    <span className="text-[9px] sm:text-[10px] text-[var(--wc-green)] font-bold tracking-widest uppercase">Mexico</span>
                  </div>
                </div>

                <div className="w-full flex gap-2 sm:gap-3">
                  <button 
                    onClick={() => setPredictedTeam('MEX')}
                    className={`flex-1 py-2.5 sm:py-3 border border-[var(--wc-green)] rounded font-bold text-xs sm:text-sm transition-colors ${predictedTeam === 'MEX' ? 'bg-[var(--wc-green)] text-black' : 'bg-[rgba(0,166,81,0.1)] text-[var(--wc-green)] hover:bg-[var(--wc-green)] hover:text-black'}`}
                  >
                    MEX
                  </button>
                  <button 
                    onClick={() => setPredictedTeam('DRAW')}
                    className={`flex-1 py-2.5 sm:py-3 border border-[var(--wc-gold)] rounded font-bold text-xs sm:text-sm transition-colors ${predictedTeam === 'DRAW' ? 'bg-[var(--wc-gold)] text-black' : 'bg-[rgba(245,166,35,0.1)] text-[var(--wc-gold)] hover:bg-[var(--wc-gold)] hover:text-black'}`}
                  >
                    DRAW
                  </button>
                  <button 
                    onClick={() => setPredictedTeam('RSA')}
                    className={`flex-1 py-2.5 sm:py-3 border border-[var(--wc-red)] rounded font-bold text-xs sm:text-sm transition-colors ${predictedTeam === 'RSA' ? 'bg-[var(--wc-red)] text-black' : 'bg-[rgba(232,0,29,0.1)] text-[var(--wc-red)] hover:bg-[var(--wc-red)] hover:text-black'}`}
                  >
                    RSA
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
    </div>
  );
}
