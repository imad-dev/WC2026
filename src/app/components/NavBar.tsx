'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Trophy } from 'lucide-react';

const navLinks = [
  { name: 'LIVE HUB', href: '/live' },
  { name: 'SCHEDULE', href: '/schedule' },
  { name: 'GROUPS', href: '/groups' },
  { name: 'TEAMS', href: '/teams' },
  { name: 'VENUES', href: '/venues' },
  { name: 'NEWS', href: '/news' },
];

export function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [daysToKo, setDaysToKo] = useState(0);

  useEffect(() => {
    const target = new Date('2026-06-11T19:00:00-06:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    setDaysToKo(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--wc-border)]" style={{ background: 'rgba(10,14,26,0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Trophy className="w-6 h-6 text-[var(--wc-gold)] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[28px] leading-none text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>WC2026</span>
          </Link>

          {/* DESKTOP LINKS */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/live' && pathname === '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-180 ${isActive ? 'text-white' : 'text-[var(--wc-text-muted)] hover:text-white'}`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-6 left-0 right-0 h-[2px] bg-[var(--wc-green)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            
            {/* LIVE TICKER — only on large screens, contained */}
            <div className="hidden xl:flex items-center">
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4px 12px' }}>
                <div className="relative overflow-hidden" style={{ maxWidth: '260px', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                  <div className="animate-marquee whitespace-nowrap font-mono text-[var(--wc-text-muted)]" style={{ fontSize: '13px' }}>
                    <span className="text-[var(--wc-live)] mr-1">●</span> BRA 2-0 SRB &nbsp;&nbsp; ARG 1-1 MEX &nbsp;&nbsp;
                    <span className="text-[var(--wc-live)] mr-1">●</span> BRA 2-0 SRB &nbsp;&nbsp; ARG 1-1 MEX
                  </div>
                </div>
              </div>
              <span className="w-px h-4 bg-[rgba(255,255,255,0.12)] mx-3" />
            </div>

            {/* COUNTDOWN PILL */}
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider text-white shrink-0" style={{ background: 'var(--wc-red)' }}>
              {daysToKo}d TO KO
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button 
              className="md:hidden p-2 -mr-2 text-[var(--wc-text-muted)] hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 bottom-0 w-64 bg-[var(--wc-surface)] shadow-2xl transition-transform duration-300 ease-in-out border-l border-[var(--wc-border)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b border-[var(--wc-border)]">
            <span className="text-xl text-white" style={{ fontFamily: 'var(--font-display)' }}>MENU</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[var(--wc-text-muted)] hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium transition-colors duration-180 ${isActive ? 'text-[var(--wc-green)]' : 'text-white'}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-[var(--wc-border)]">
               <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider text-white" style={{ background: 'var(--wc-red)' }}>
                {daysToKo}d TO KO
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
