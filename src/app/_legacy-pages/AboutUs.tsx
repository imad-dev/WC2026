"use client";
import { Globe, Trophy, Users, Zap, Target, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Hero */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
            style={{ borderColor: 'var(--wc-gold)', background: 'rgba(255,179,0,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--wc-gold)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--wc-gold)]">About Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase mb-4"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--wc-text)' }}>
            Built for <span className="text-[var(--wc-green)]">Football</span> Fans
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-[var(--wc-text-muted)]">
            WC2026.games is the ultimate destination for everything related to the 2026 FIFA World Cup — from the official draw and fixtures to real-time stats and team profiles.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border p-6 sm:p-8 mb-8 sm:mb-10"
          style={{ background: 'var(--wc-surface)', borderColor: 'var(--wc-border)', borderTop: '3px solid var(--wc-green)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-[var(--wc-green)] shrink-0" />
            <h2 className="text-xl font-bold uppercase text-white" style={{ fontFamily: 'var(--font-display)' }}>Our Mission</h2>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--wc-text-muted)]">
            Our mission is simple: deliver the most accurate, up-to-date, and visually engaging World Cup experience on the web. We believe every football fan deserves a premium dashboard — one that combines tournament excitement with real data. WC2026.games is built to be your go-to companion from the draw all the way to the final whistle on July 19, 2026.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10">
          {[
            { icon: Trophy, title: 'Accuracy First', desc: 'All data — from group draws to coaches and player squads — is manually verified against official FIFA and confederation sources.', color: 'var(--wc-gold)' },
            { icon: Zap,    title: 'Always Up to Date', desc: 'We continuously track team changes, coach appointments, and ranking updates so you always see the latest reality.', color: 'var(--wc-green)' },
            { icon: Globe,  title: 'Global Coverage', desc: 'All 48 nations across 6 confederations — every team gets the same attention whether they\'re Argentina or Uzbekistan.', color: '#448AFF' },
            { icon: Heart,  title: 'Made with Passion', desc: 'This project is built by passionate football fans, for football fans. No corporate fluff — just love for the beautiful game.', color: '#EC407A' },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border p-5 sm:p-6" style={{ background: 'var(--wc-surface)', borderColor: 'var(--wc-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <v.icon className="w-5 h-5 shrink-0" style={{ color: v.color }} />
                <h3 className="font-bold text-white">{v.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--wc-text-muted)]">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* What We Cover */}
        <div className="rounded-2xl border p-6 sm:p-8 mb-8 sm:mb-10" style={{ background: 'var(--wc-surface)', borderColor: 'var(--wc-border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-[var(--wc-green)] shrink-0" />
            <h2 className="text-xl font-bold uppercase text-white" style={{ fontFamily: 'var(--font-display)' }}>What We Cover</h2>
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
              <div key={item} className="flex items-start gap-2 text-sm py-2 border-b last:border-0 border-[var(--wc-border)] text-[var(--wc-text-muted)]">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Tournament */}
        <div className="rounded-2xl border p-6 sm:p-8 mb-8 sm:mb-10"
          style={{ background: 'linear-gradient(135deg, rgba(0,166,81,0.05) 0%, transparent 100%)', borderColor: 'rgba(0,166,81,0.2)' }}>
          <h2 className="text-xl font-bold uppercase mb-3 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            About the Tournament
          </h2>
          <p className="text-sm leading-relaxed mb-6 text-[var(--wc-text-muted)]">
            The 2026 FIFA World Cup is the first ever edition to feature 48 teams — up from 32 in previous tournaments. It will be jointly hosted by the United States, Canada, and Mexico across 16 stadiums, running from June 11 to July 19, 2026.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { v: '48', l: 'Teams' }, { v: '104', l: 'Matches' },
              { v: '16', l: 'Venues' }, { v: '$1B', l: 'Prize Fund' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-extrabold text-[var(--wc-green)]" style={{ fontFamily: 'var(--font-display)' }}>{s.v}</div>
                <div className="text-xs text-[var(--wc-text-muted)]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <p className="text-sm mb-4 text-[var(--wc-text-muted)]">Have questions or suggestions?</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 bg-[var(--wc-green)] text-[var(--wc-dark)]">
            Get in Touch →
          </Link>
        </div>
      </div>
    </div>
  );
}
