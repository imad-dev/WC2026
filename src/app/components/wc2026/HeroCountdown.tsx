'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

const TARGET_DATE = new Date('2026-06-11T19:00:00-06:00').getTime();

const FLAGS = ["🇺🇸","🇨🇦","🇲🇽","🇧🇷","🇦🇷","🇫🇷","🏴󠁧󠁢󠁥󠁮󠁧󠁿","🇩🇪","🇪🇸","🇵🇹","🇳🇱","🇮🇹","🇺🇾","🇨🇴","🇲🇦","🇯🇵","🇰🇷","🇸🇳","🇭🇷","🇨🇭","🇧🇪","🇩🇰","🇪🇨"];

function FlipDigit({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-14 h-18 sm:w-16 sm:h-20 md:w-24 md:h-32 bg-[var(--wc-surface)] rounded shadow-2xl flex items-center justify-center border border-[var(--wc-border)] overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ rotateX: 90, opacity: 0, y: -20 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            exit={{ rotateX: -90, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="absolute text-4xl sm:text-5xl md:text-8xl tabular"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--wc-text)' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        {/* Middle divider line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/50 z-10" />
      </div>
      <span className="mt-2 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.2em] text-[var(--wc-text-muted)] uppercase" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </span>
    </div>
  );
}

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [mounted, setMounted] = useState(false);
  
  // Pre-generate 30 random particles
  const [particles] = useState(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `${Math.random() * -20}s`
    }))
  );

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const distance = TARGET_DATE - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const Separator = () => (
    <span className="text-2xl sm:text-4xl md:text-7xl text-[var(--wc-text-muted)] self-start mt-1 sm:mt-2 mx-0.5" style={{ fontFamily: 'var(--font-display)' }}>:</span>
  );

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-mesh-stadium px-4">
      
      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && particles.map(p => (
          <div 
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-base sm:text-xl md:text-3xl tracking-widest text-[var(--wc-gold)] mb-6 sm:mb-8"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          THE GREATEST SHOW ON EARTH
        </motion.h1>

        {mounted ? (
          <div className="flex justify-center items-start gap-1 sm:gap-3 md:gap-6 mb-8 sm:mb-10">
            <FlipDigit value={String(timeLeft.days).padStart(2, '0')} label="Days" />
            <Separator />
            <FlipDigit value={String(timeLeft.hours).padStart(2, '0')} label="Hours" />
            <Separator />
            <FlipDigit value={String(timeLeft.mins).padStart(2, '0')} label="Mins" />
            <Separator />
            <FlipDigit value={String(timeLeft.secs).padStart(2, '0')} label="Secs" />
          </div>
        ) : (
          <div className="flex justify-center items-start gap-1 sm:gap-3 md:gap-6 mb-8 sm:mb-10 opacity-0">
             <FlipDigit value="00" label="Days" />
             <FlipDigit value="00" label="Hours" />
             <FlipDigit value="00" label="Mins" />
             <FlipDigit value="00" label="Secs" />
          </div>
        )}

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xs sm:text-sm md:text-base font-medium tracking-[0.08em] sm:tracking-[0.1em] text-[var(--wc-text-muted)] mb-8 sm:mb-12 uppercase max-w-lg"
        >
          Opening Kickoff &middot; June 11, 2026 &middot; Estadio Azteca &middot; Mexico
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-12"
        >
          <Link 
            href="/live" 
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--wc-red)] text-white font-bold tracking-wider hover:bg-[#ff1a35] transition-all rounded w-full sm:w-auto shadow-[0_0_20px_rgba(232,0,29,0.4)]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
          >
            WATCH LIVE <span className="text-xl">→</span>
          </Link>
          <Link 
            href="/schedule" 
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00A651] to-[#00853E] text-white font-bold tracking-wider hover:opacity-90 transition-all rounded w-full sm:w-auto shadow-[0_0_20px_rgba(0,166,81,0.4)] border border-[rgba(255,255,255,0.1)]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
          >
            VIEW SCHEDULE
          </Link>
        </motion.div>

        {/* Stat Pills — hidden on mobile, contained on desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:flex flex-wrap justify-center gap-3 mb-8"
        >
          {['48 TEAMS · 6 CONF.', '104 MATCHES · GROUP + KO', '$1B PRIZE FUND'].map(stat => (
            <div key={stat} className="text-[11px] font-bold tracking-widest text-white uppercase rounded-full px-5 py-2.5"
                 style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              {stat}
            </div>
          ))}
        </motion.div>

        {/* Featured Matches — horizontal scroll with snap, no overflow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center mb-4 sm:mb-6"
        >
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--wc-green)] mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>FEATURED MATCHES TODAY</span>
          <div className="animate-bounce text-[var(--wc-text-muted)]">↓</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl pb-2"
        >
          {[
            { home: 'MEX', homeFlag: '🇲🇽', away: 'RSA', awayFlag: '🇿🇦', time: '19:00', venue: 'Estadio Azteca' },
            { home: 'BRA', homeFlag: '🇧🇷', away: 'MAR', awayFlag: '🇲🇦', time: '21:00', venue: 'SoFi Stadium' },
            { home: 'FRA', homeFlag: '🇫🇷', away: 'SEN', awayFlag: '🇸🇳', time: '16:00', venue: 'MetLife Stadium' }
          ].map(match => (
            <div key={match.home} className="p-3 rounded-lg border border-[var(--wc-border)] bg-[var(--wc-surface)]">
              <div className="text-[9px] sm:text-[10px] text-[var(--wc-text-muted)] mb-2 uppercase font-bold tracking-wider truncate">{match.time} · {match.venue}</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5"><span className="text-base sm:text-lg">{match.homeFlag}</span><span className="font-bold text-white text-sm sm:text-base" style={{ fontFamily: 'var(--font-mono)' }}>{match.home}</span></div>
                <span className="text-[10px] text-[var(--wc-text-muted)] font-mono mx-2">VS</span>
                <div className="flex items-center gap-1.5"><span className="font-bold text-white text-sm sm:text-base" style={{ fontFamily: 'var(--font-mono)' }}>{match.away}</span><span className="text-base sm:text-lg">{match.awayFlag}</span></div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Flag Marquee */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-14 bg-black/40 backdrop-blur-sm border-t border-[var(--wc-border)] overflow-hidden flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 sm:gap-8 text-xl sm:text-2xl md:text-3xl">
          {[...FLAGS, ...FLAGS].map((flag, i) => (
            <span key={i} className="inline-block hover:scale-125 transition-transform cursor-default">{flag}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
