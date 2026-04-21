import { Link } from 'react-router-dom';
import { Globe, Trophy, Users, Zap, Target, Heart, ArrowLeft } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--void)', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="border-b px-6 md:px-20 py-4 flex items-center gap-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-glass)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--green-live)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span style={{ color: 'var(--border)' }}>|</span>
        <div style={{ fontFamily: 'var(--font-display)' }}>
          <span className="font-extrabold text-white">WC</span>
          <span className="font-extrabold" style={{ color: 'var(--green-live)' }}>2026</span>
          <span className="text-sm ml-1" style={{ color: 'var(--white-ghost)' }}>.games</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
            style={{ borderColor: 'var(--gold-leader)', background: 'rgba(255,179,0,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-leader)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gold-leader)' }}>About Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase mb-4"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--white-primary)' }}>
            Built for <span style={{ color: 'var(--green-live)' }}>Football</span> Fans
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--white-muted)' }}>
            WC2026.games is the ultimate destination for everything related to the 2026 FIFA World Cup — from the official draw and fixtures to real-time stats and team profiles.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border p-8 mb-10"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', borderTop: '3px solid var(--green-live)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5" style={{ color: 'var(--green-live)' }} />
            <h2 className="text-xl font-bold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>Our Mission</h2>
          </div>
          <p className="text-base leading-relaxed" style={{ color: 'var(--white-muted)' }}>
            Our mission is simple: deliver the most accurate, up-to-date, and visually engaging World Cup experience on the web. We believe every football fan deserves a premium dashboard — one that combines tournament excitement with real data. WC2026.games is built to be your go-to companion from the draw all the way to the final whistle on July 19, 2026.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: Trophy, title: 'Accuracy First', desc: 'All data — from group draws to coaches and player squads — is manually verified against official FIFA and confederation sources.', color: 'var(--gold-leader)' },
            { icon: Zap,    title: 'Always Up to Date', desc: 'We continuously track team changes, coach appointments, and ranking updates so you always see the latest reality.', color: 'var(--green-live)' },
            { icon: Globe,  title: 'Global Coverage', desc: 'All 48 nations across 6 confederations — every team gets the same attention whether they\'re Argentina or Uzbekistan.', color: '#448AFF' },
            { icon: Heart,  title: 'Made with Passion', desc: 'This project is built by passionate football fans, for football fans. No corporate fluff — just love for the beautiful game.', color: '#EC407A' },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <v.icon className="w-5 h-5" style={{ color: v.color }} />
                <h3 className="font-bold" style={{ color: 'var(--white-primary)' }}>{v.title}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--white-muted)' }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* What We Cover */}
        <div className="rounded-2xl border p-8 mb-10" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5" style={{ color: 'var(--green-live)' }} />
            <h2 className="text-xl font-bold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>What We Cover</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              '🏆 Official WC2026 Group Draw (48 teams, 12 groups)',
              '📅 Full group stage & knockout schedules',
              '🧑‍💼 Up-to-date coaches for all 48 nations',
              '⭐ Key player profiles per team',
              '🏟️ All 16 official venues across USA, Canada & Mexico',
              '📊 FIFA world rankings (updated regularly)',
              '⏱️ Live countdown to the June 11 opener',
              '📍 Venue locations & capacities',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm py-2 border-b last:border-0"
                style={{ borderColor: 'var(--border)', color: 'var(--white-muted)' }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Tournament */}
        <div className="rounded-2xl border p-8 mb-10"
          style={{ background: 'linear-gradient(135deg, rgba(0,230,118,0.05) 0%, transparent 100%)', borderColor: 'rgba(0,230,118,0.2)' }}>
          <h2 className="text-xl font-bold uppercase mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
            About the Tournament
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--white-muted)' }}>
            The 2026 FIFA World Cup is the first ever edition to feature 48 teams — up from 32 in previous tournaments. It will be jointly hosted by the United States, Canada, and Mexico across 16 stadiums, running from June 11 to July 19, 2026. The tournament will feature a prize fund of $1 billion — a record in football history.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { v: '48', l: 'Teams' }, { v: '104', l: 'Matches' },
              { v: '16', l: 'Venues' }, { v: '$1B', l: 'Prize Fund' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--green-live)' }}>{s.v}</div>
                <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--white-ghost)' }}>Have questions or suggestions?</p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--green-live)', color: 'var(--void)' }}>
            Get in Touch →
          </Link>
        </div>
      </div>

      <PageFooter />
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="border-t mt-16 py-8 px-6 md:px-20 text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}>
      <div className="flex flex-wrap justify-center gap-6 mb-3">
        <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </div>
      <p>© 2026 WC2026.games · All rights reserved · Not affiliated with FIFA</p>
    </footer>
  );
}
