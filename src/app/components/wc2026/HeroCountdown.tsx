"use client";

import { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-06-11T00:00:00Z').getTime();

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

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

  return (
    <div 
      className="w-full h-32 md:h-40 flex items-center justify-between px-6 md:px-20 text-white shadow-inner"
      style={{ backgroundColor: 'var(--blue-ref)' }}
    >
      <div className="flex-1">
        {/* Placeholder for left-side imagery if needed, otherwise empty to push countdown to right */}
      </div>

      <div className="flex gap-4 md:gap-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-extrabold leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm tracking-wider uppercase mt-1 opacity-90">days</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-extrabold leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm tracking-wider uppercase mt-1 opacity-90">hours</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-extrabold leading-none">{String(timeLeft.mins).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm tracking-wider uppercase mt-1 opacity-90">mins</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-extrabold leading-none">{String(timeLeft.secs).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm tracking-wider uppercase mt-1 opacity-90">secs</span>
        </div>
      </div>
    </div>
  );
}
