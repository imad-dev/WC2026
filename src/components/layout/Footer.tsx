'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate API call to /api/subscribe
    setTimeout(() => setStatus('success'), 1000);
  };

  return (
    <footer className="w-full bg-[var(--wc-dark)] border-t border-[var(--wc-border)] pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1: Brand & Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-max">
              <Trophy className="w-8 h-8 text-[var(--wc-gold)] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-4xl leading-none text-white tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>WC2026</span>
            </Link>
            <p className="text-sm text-[var(--wc-text-muted)] leading-relaxed max-w-sm">
              The ultimate live hub for the 2026 FIFA World Cup. 104 matches, 48 teams, 16 venues across USA, Canada, and Mexico.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--wc-surface-2)] flex items-center justify-center text-[var(--wc-text-muted)] hover:text-white hover:bg-[var(--wc-green)] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--wc-surface-2)] flex items-center justify-center text-[var(--wc-text-muted)] hover:text-white hover:bg-[var(--wc-green)] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--wc-surface-2)] flex items-center justify-center text-[var(--wc-text-muted)] hover:text-white hover:bg-[var(--wc-green)] transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-widest uppercase text-sm" style={{ fontFamily: 'var(--font-display)' }}>Tournament Hub</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/schedule" className="text-sm text-[var(--wc-text-muted)] hover:text-[var(--wc-green)] transition-colors">Match Schedule</Link></li>
              <li><Link href="/groups" className="text-sm text-[var(--wc-text-muted)] hover:text-[var(--wc-green)] transition-colors">Group Standings</Link></li>
              <li><Link href="/teams" className="text-sm text-[var(--wc-text-muted)] hover:text-[var(--wc-green)] transition-colors">Qualified Teams</Link></li>
              <li><Link href="/venues" className="text-sm text-[var(--wc-text-muted)] hover:text-[var(--wc-green)] transition-colors">Host Cities</Link></li>
              <li><Link href="/news" className="text-sm text-[var(--wc-text-muted)] hover:text-[var(--wc-green)] transition-colors">Latest News</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-widest uppercase text-sm" style={{ fontFamily: 'var(--font-display)' }}>Never Miss a Goal</h4>
            <p className="text-sm text-[var(--wc-text-muted)]">Subscribe for match alerts, predictions, and daily recaps.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--wc-green)] transition-colors"
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-[var(--wc-green)] hover:bg-[#00c961] text-black font-bold text-sm tracking-widest uppercase py-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : <>NOTIFY ME <Send className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--wc-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--wc-text-muted)] font-mono">
            © {new Date().getFullYear()} WC2026.games — Not affiliated with FIFA.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/about" className="text-xs text-[var(--wc-text-muted)] hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="text-xs text-[var(--wc-text-muted)] hover:text-white transition-colors">Contact Us</Link>
            <Link href="/privacy" className="text-xs text-[var(--wc-text-muted)] hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-[var(--wc-text-muted)] hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
